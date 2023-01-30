"use strict";
// ======================================================================
//
//   GNU GENERAL PUBLIC LICENSE
//   Version 3, 29 June 2007
//   copyright (C) 2020 - 2021 Quentin Gruber
//   copyright (C) 2021 - 2023 H1emu community
//
//   https://github.com/QuentinGruber/h1z1-server
//   https://www.npmjs.com/package/h1z1-server
//
//   Based on https://github.com/psemu/soe-network
// ======================================================================
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZoneServer2015 = void 0;
const events_1 = require("events");
const gatewayserver_1 = require("../GatewayServer/gatewayserver");
const h1z1protocol_1 = require("../../protocols/h1z1protocol");
const h1emuZoneServer_1 = require("../H1emuServer/h1emuZoneServer");
const utils_1 = require("../../utils/utils");
const mongodb_1 = require("mongodb");
const worker_threads_1 = require("worker_threads");
const zoneclient_1 = require("./classes/zoneclient");
const vehicle_1 = require("./classes/vehicle");
const dns_1 = require("dns");
const constants_1 = require("../../utils/constants");
process.env.isBin && require("./workers/dynamicWeather");
const zonepackethandlers_1 = require("./zonepackethandlers");
const healthWorker_1 = require("../shared/workers/healthWorker");
const enums_1 = require("../../utils/enums");
const localSpawnList = require("../../../data/2015/sampleData/spawnLocations.json");
const debugName = "ZoneServer";
const debug = require("debug")(debugName);
const localWeatherTemplates = require("../../../data/2015/sampleData/weather.json");
const stats = require("../../../data/2015/sampleData/stats.json");
const recipes = require("../../../data/2015/sampleData/recipes.json");
const Z1_POIs = require("../../../data/2015/zoneData/Z1_POIs");
let ZoneServer2015 = class ZoneServer2015 extends events_1.EventEmitter {
    constructor(serverPort, gatewayKey, mongoAddress = "", worldId = 0, internalServerPort = 1118) {
        super();
        this._clients = {};
        this._frozeCycle = false;
        this._respawnOnLastPosition = false;
        this._worldRoutineRadiusPercentage = 0.4;
        this.tickRate = 500;
        this._loginServerInfo = {
            address: process.env.LOGINSERVER_IP,
            port: 1110,
        };
        this._hasBeenAuthenticated = false;
        this._clientProtocol = "ClientProtocol_860";
        this._allowedCommands = process.env.ALLOWED_COMMANDS
            ? JSON.parse(process.env.ALLOWED_COMMANDS)
            : [];
        this._maxAllowedPing = 300;
        this._transientIdGenerator = (0, utils_1.generateTransientId)();
        this.gameVersion = enums_1.GAME_VERSIONS.H1Z1_15janv_2015;
        this._gatewayServer = new gatewayserver_1.GatewayServer(serverPort, gatewayKey);
        this._mongoAddress = mongoAddress;
        this._worldId = worldId;
        this._protocol = new h1z1protocol_1.H1Z1Protocol();
        this._clients = {};
        this._characters = {};
        this._npcs = {};
        this._objects = {};
        this._doors = {};
        this._vehicles = {};
        this._props = {};
        this._destroyablesTimeout = {};
        this._speedTrees = {};
        this._destroyables = {};
        this._serverTime = this.getCurrentTime();
        this._transientIds = {};
        this._packetHandlers = new zonepackethandlers_1.zonePacketHandlers();
        this._startTime = 0;
        this._time = Date.now();
        this._startGameTime = 0;
        this._timeMultiplier = 72;
        this._cycleSpeed = 0;
        this._soloMode = false;
        this._defaultWeatherTemplate = "h1emubaseweather";
        this._profiles = [];
        this._items = [];
        this._interactionDistance = 4;
        this._npcRenderDistance = 350;
        this._pingTimeoutTime = 120000;
        this._dynamicWeatherEnabled = true;
        this._dummySelf = require("../../../data/2015/sampleData/sendself.json");
        this._appDataFolder = (0, utils_1.getAppDataFolderPath)();
        if (!this._mongoAddress) {
            this._soloMode = true;
            debug("Server in solo mode !");
        }
        this.on("data", this.onZoneDataEvent);
        this.on("login", (client) => {
            this.onZoneLoginEvent(client);
        });
        this._gatewayServer._soeServer.on("fatalError", (soeClient) => {
            const client = this._clients[soeClient.sessionId];
            this.deleteClient(client);
            // TODO: force crash the client
        });
        this._gatewayServer.on("login", (client, characterId, loginSessionId, clientProtocol) => {
            this.onGatewayLoginEvent(client, characterId, loginSessionId, clientProtocol);
        });
        this._gatewayServer.on("disconnect", (err, client) => {
            this.onGatewayDisconnectEvent(err, client);
        });
        this._gatewayServer.on("tunneldata", (client, data, flags) => {
            this.onGatewayTunnelDataEvent(this._clients[client.sessionId], data, flags);
        });
        if (!this._soloMode) {
            this._h1emuZoneServer = new h1emuZoneServer_1.H1emuZoneServer(this._worldId, internalServerPort); // opens local socket to connect to loginserver
            this._h1emuZoneServer.on("session", (err, client) => {
                if (err) {
                    debug(`An error occured for LoginConnection with ${client.sessionId}`);
                    console.error(err);
                }
                else {
                    debug(`LoginConnection established for ${client.sessionId}`);
                }
            });
            this._h1emuZoneServer.on("sessionfailed", (err, client) => {
                console.error(`h1emuServer sessionfailed for ${client.sessionId}`);
                console.error(err);
                process.exitCode = 1;
            });
            this._h1emuZoneServer.on("disconnect", (err, client, reason) => {
                debug(`LoginConnection dropped: ${reason ? "Connection Lost" : "Unknown Error"}`);
            });
            this._h1emuZoneServer.on("data", async (err, client, packet) => {
                if (err) {
                    console.error(err);
                }
                else {
                    switch (packet.name) {
                        case "CharacterCreateRequest": {
                            this.onCharacterCreateRequest(client, packet);
                            break;
                        }
                        case "CharacterExistRequest": {
                            const { characterId, reqId } = packet.data;
                            try {
                                const collection = this._db.collection("characters");
                                const charactersArray = await collection
                                    .find({ characterId: characterId })
                                    .toArray();
                                if (charactersArray.length) {
                                    this._h1emuZoneServer.sendData(client, "CharacterExistReply", { status: 1, reqId: reqId });
                                }
                                else {
                                    this._h1emuZoneServer.sendData(client, "CharacterExistReply", { status: 0, reqId: reqId });
                                }
                            }
                            catch (error) {
                                this._h1emuZoneServer.sendData(client, "CharacterExistReply", { status: 0, reqId: reqId });
                            }
                            break;
                        }
                        case "CharacterDeleteRequest": {
                            const { characterId, reqId } = packet.data;
                            try {
                                const collection = this._db.collection("characters");
                                const charactersArray = await collection
                                    .find({ characterId: characterId })
                                    .toArray();
                                if (charactersArray.length === 1) {
                                    await collection.updateOne({ characterId: characterId }, {
                                        $set: {
                                            status: 0,
                                        },
                                    });
                                    this._h1emuZoneServer.sendData(client, "CharacterDeleteReply", { status: 1, reqId: reqId });
                                }
                                else {
                                    this._h1emuZoneServer.sendData(client, "CharacterDeleteReply", { status: 1, reqId: reqId });
                                }
                            }
                            catch (error) {
                                this._h1emuZoneServer.sendData(client, "CharacterDeleteReply", { status: 0, reqId: reqId });
                            }
                            break;
                        }
                        default:
                            debug(`Unhandled h1emu packet: ${packet.name}`);
                            break;
                    }
                }
            });
        }
    }
    async onCharacterCreateRequest(client, packet) {
        const { characterObjStringify, reqId } = packet.data;
        try {
            const characterObj = JSON.parse(characterObjStringify);
            const collection = this._db.collection("characters");
            const charactersArray = await collection.findOne({
                characterId: characterObj.characterId,
            });
            if (!charactersArray) {
                await collection.insertOne(characterObj);
            }
            this._h1emuZoneServer.sendData(client, "CharacterCreateReply", {
                reqId: reqId,
                status: 1,
            });
        }
        catch (error) {
            this._h1emuZoneServer.sendData(client, "CharacterCreateReply", {
                reqId: reqId,
                status: 0,
            });
        }
    }
    async fetchLoginInfo() {
        const resolver = new dns_1.Resolver();
        const loginServerAddress = await new Promise((resolve) => {
            resolver.resolve4("loginserver.h1emu.com", (err, addresses) => {
                if (!err) {
                    resolve(addresses[0]);
                }
                else {
                    throw err;
                }
            });
        });
        this._loginServerInfo.address = loginServerAddress;
    }
    onZoneDataEvent(client, packet) {
        client?.pingTimer?.refresh();
        if (packet.name != "KeepAlive" &&
            packet.name != "PlayerUpdateUpdatePositionClientToZone" &&
            packet.name != "PlayerUpdateManagedPosition") {
            debug(`Receive Data ${[packet.name]}`);
        }
        try {
            this._packetHandlers.processPacket(this, client, packet);
        }
        catch (error) {
            console.error(error);
            console.error(`An error occurred while processing a packet : `, packet);
        }
    }
    onZoneLoginEvent(client) {
        debug("zone login");
        try {
            this.sendInitData(client);
        }
        catch (error) {
            debug(error);
            this.sendData(client, "LoginFailed", {});
        }
    }
    generateTransientId(characterId) {
        let generatedTransient;
        do {
            generatedTransient = Number((Math.random() * 30000).toFixed(0));
        } while (this._transientIds[generatedTransient]);
        this._transientIds[generatedTransient] = characterId;
        return generatedTransient;
    }
    createClient(sessionId, soeClientId, loginSessionId, characterId, generatedTransient) {
        return new zoneclient_1.ZoneClient(sessionId, soeClientId, loginSessionId, characterId, generatedTransient);
    }
    onGatewayLoginEvent(soeClient, characterId, loginSessionId, clientProtocol) {
        if (clientProtocol !== this._clientProtocol) {
            debug(`${soeClient.address} is using the wrong client protocol`);
            this.sendData(soeClient, "LoginFailed", {});
            return;
        }
        debug(`Client logged in from ${soeClient.address}:${soeClient.port} with character id: ${characterId}`);
        const generatedTransient = this.generateTransientId(characterId);
        const zoneClient = this.createClient(soeClient.sessionId, soeClient.soeClientId, loginSessionId, characterId, generatedTransient);
        this._clients[soeClient.sessionId] = zoneClient;
        this._transientIds[generatedTransient] = characterId;
        this._characters[characterId] = zoneClient.character;
        zoneClient.pingTimer = setTimeout(() => {
            this.timeoutClient(zoneClient);
        }, this._pingTimeoutTime);
        this.emit("login", zoneClient);
    }
    onGatewayDisconnectEvent(err, client) {
        this.deleteClient(client);
    }
    getSoeClient(soeClientId) {
        return this._gatewayServer._soeServer.getSoeClient(soeClientId);
    }
    deleteClient(client) {
        if (client) {
            if (client.character) {
                this.deleteEntity(client.character.characterId, this._characters);
                clearTimeout(client.character?.resourcesUpdater);
                this.saveCharacterPosition(client);
                client.managedObjects?.forEach((characterId) => {
                    this.dropVehicleManager(client, characterId);
                });
            }
            delete this._clients[client.sessionId];
            const soeClient = this.getSoeClient(client.soeClientId);
            if (soeClient) {
                this._gatewayServer._soeServer.deleteClient(soeClient);
            }
            if (!this._soloMode) {
                this.sendZonePopulationUpdate();
            }
        }
    }
    onGatewayTunnelDataEvent(client, data, flags) {
        const packet = this._protocol.parse(data, flags);
        if (packet) {
            this.emit("data", client, packet);
        }
        else {
            debug("zonefailed : ", data);
        }
    }
    async setupServer() {
        this.forceTime(971172000000); // force day time by default - not working for now
        this._frozeCycle = false;
        this._weather = localWeatherTemplates[this._defaultWeatherTemplate];
        this._profiles = this.generateProfiles();
        this._items = this.generateItems();
        if (!this._soloMode &&
            (await this._db?.collection("worlds").findOne({ worldId: this._worldId }))) {
            await this.fetchWorldData();
        }
        else {
            await this._db
                ?.collection(`worlds`)
                .insertOne({ worldId: this._worldId });
            await this.saveWorld();
        }
        if (!this._soloMode) {
            debug("Starting H1emuZoneServer");
            if (!this._loginServerInfo.address) {
                await this.fetchLoginInfo();
            }
            this._h1emuZoneServer.setLoginInfo(this._loginServerInfo, {
                serverId: this._worldId,
                h1emuVersion: process.env.H1Z1_SERVER_VERSION,
            });
            this._h1emuZoneServer.start();
            this.sendZonePopulationUpdate();
        }
        debug("Server ready");
    }
    getAllCurrentUsedTransientId() {
        const allTransient = {};
        for (const key in this._doors) {
            const door = this._doors[key];
            allTransient[door.transientId] = key;
        }
        for (const key in this._props) {
            const prop = this._props[key];
            allTransient[prop.transientId] = key;
        }
        for (const key in this._vehicles) {
            const vehicle = this._vehicles[key];
            allTransient[vehicle.npcData.transientId] = key;
        }
        for (const key in this._npcs) {
            const npc = this._npcs[key];
            allTransient[npc.transientId] = key;
        }
        for (const key in this._objects) {
            const object = this._objects[key];
            allTransient[object.transientId] = key;
        }
        return allTransient;
    }
    getEntityType(entityKey) {
        if (!!this._npcs[entityKey]) {
            return 1;
        }
        else if (!!this._vehicles[entityKey]) {
            return 2;
        }
        else if (!!this._characters[entityKey]) {
            return 3;
        }
        else if (!!this._objects[entityKey]) {
            return 4;
        }
        else if (!!this._props[entityKey]) {
            return 5;
        }
        else {
            return 6; // doors
        }
    }
    getCollisionEntityType(entityKey) {
        return !!this._destroyables[entityKey] ? 1 : 2;
    }
    sendZonePopulationUpdate() {
        const populationNumber = utils_1._.size(this._characters);
        this._h1emuZoneServer.sendData({
            ...this._loginServerInfo,
            session: true,
        }, "UpdateZonePopulation", { population: populationNumber });
    }
    async fetchWorldData() {
        const { createAllEntities } = require("./workers/createBaseEntities");
        const { npcs, doors, destroyable } = createAllEntities(this);
        this._npcs = npcs;
        this._doors = doors;
        this._destroyables = destroyable;
        delete require.cache[require.resolve("./workers/createBaseEntities")];
        debug("All entities created");
        this._props = {};
        const propsArray = await this._db
            ?.collection("props")
            .find({ worldId: this._worldId })
            .toArray();
        for (let index = 0; index < propsArray.length; index++) {
            const prop = propsArray[index];
            this._props[prop.characterId] = prop;
        }
        this._vehicles = {};
        const vehiclesArray = await this._db
            ?.collection("vehicles")
            .find({ worldId: this._worldId })
            .toArray();
        for (let index = 0; index < vehiclesArray.length; index++) {
            const vehicle = vehiclesArray[index];
            this._vehicles[vehicle.npcData.characterId] = vehicle;
        }
        this._objects = {};
        const objectsArray = await this._db
            ?.collection("objects")
            .find({ worldId: this._worldId })
            .toArray();
        for (let index = 0; index < objectsArray.length; index++) {
            const object = objectsArray[index];
            this._objects[object.characterId] = object;
        }
        this._transientIds = this.getAllCurrentUsedTransientId();
        debug("World fetched!");
    }
    async saveCollections() {
        await this._db?.collection(`props`).insertMany(Object.values(this._props));
        await this._db
            ?.collection(`vehicles`)
            .insertMany(Object.values(this._vehicles));
        await this._db
            ?.collection(`objects`)
            .insertMany(Object.values(this._objects));
    }
    async saveWorld() {
        if (!this._soloMode) {
            if (this._worldId) {
                this.createAllObjects();
                await this.saveCollections();
            }
            else {
                this.createAllObjects();
                const numberOfWorld = (await this._db?.collection("worlds").find({}).count()) || 0;
                this._worldId = numberOfWorld + 1;
                await this._db?.collection("worlds").insertOne({
                    worldId: this._worldId,
                });
                await this.saveCollections();
                debug("World saved!");
            }
        }
        else {
            this.createAllObjects();
        }
    }
    async connectMongo() {
        const mongoClient = (this._mongoClient = new mongodb_1.MongoClient(this._mongoAddress, { maxPoolSize: 50 }));
        try {
            await mongoClient.connect();
        }
        catch (e) {
            throw debug("[ERROR]Unable to connect to mongo server " + this._mongoAddress);
        }
        debug("connected to mongo !");
        // if no collections exist on h1server database , fill it with samples
        const dbIsEmpty = (await mongoClient.db(constants_1.DB_NAME).collections()).length < 1;
        if (dbIsEmpty) {
            await (0, utils_1.initMongo)(mongoClient, debugName);
        }
        this._db = mongoClient.db(constants_1.DB_NAME);
    }
    async start() {
        debug("Starting server");
        debug(`Protocol used : ${this._protocol.protocolName}`);
        if (this._mongoAddress) {
            await this.connectMongo();
        }
        await this.setupServer();
        this._startTime += Date.now() + 82201232; // summer start
        this._startGameTime += Date.now();
        if (this._soloMode) {
            (0, utils_1.setupAppDataFolder)();
        }
        if (this._dynamicWeatherEnabled) {
            this._dynamicWeatherWorker = new worker_threads_1.Worker(`${__dirname}/workers/dynamicWeather.js`, {
                workerData: {
                    timeMultiplier: this._timeMultiplier,
                    serverTime: this._serverTime,
                    startTime: this._startTime,
                },
            });
            this._dynamicWeatherWorker.on("message", (weather) => {
                this.sendRawToAll(Buffer.from(weather));
            });
        }
        this._gatewayServer.start();
        this.worldRoutineTimer = setTimeout(() => this.worldRoutine.bind(this)(true), this.tickRate);
    }
    reloadPackets(client) {
        this.reloadZonePacketHandlers();
        this._protocol.reloadPacketDefinitions();
        this.sendChatText(client, "[DEV] Packets reloaded", true);
    }
    async reloadZonePacketHandlers() {
        //@ts-ignore
        delete this._packetHandlers;
        delete require.cache[require.resolve("./zonepackethandlers")];
        (0, utils_1.removeCacheFullDir)(`${__dirname}/../../packets/ClientProtocol/ClientProtocol_860/`);
        this._packetHandlers = new (require("./zonepackethandlers").zonePacketHandlers)();
        await this._packetHandlers.reloadCommandCache();
    }
    timeoutClient(client) {
        if (!!this._clients[client.sessionId]) {
            // if hasn't already deleted
            debug(`Client (${client.soeClientId}) disconnected ( ping timeout )`);
            this.deleteClient(client);
        }
    }
    generateGuid() {
        return (0, utils_1.generateRandomGuid)();
    }
    async saveCharacterPosition(client, refreshTimeout = false) {
        if (client?.character) {
            const { position, rotation } = client.character.state;
            await this._db?.collection("characters").updateOne({ characterId: client.character.characterId }, {
                $set: {
                    position: position,
                    rotation: rotation,
                },
            });
            refreshTimeout && client.savePositionTimer.refresh();
        }
    }
    async characterData(client) {
        const { data: { identity }, } = this._dummySelf;
        let characterName;
        let character;
        if (!this._soloMode) {
            character = await this._db
                ?.collection("characters")
                .findOne({ characterId: client.character.characterId });
            if (!character) {
                this.sendData(client, "LoginFailed", {});
                return;
            }
            characterName = character.payload.name;
        }
        else {
            delete require.cache[require.resolve(`${this._appDataFolder}/single_player_characters.json`)];
            const SinglePlayerCharacters = require(`${this._appDataFolder}/single_player_characters.json`);
            character = SinglePlayerCharacters.find((character) => character.characterId === client.character.characterId);
            characterName = character.payload.name;
        }
        this._dummySelf.data.identity.characterFirstName = characterName;
        this._dummySelf.data.guid = (0, utils_1.generateRandomGuid)();
        this._dummySelf.data.characterId = character.characterId;
        client.character.guid = client.character.characterId;
        client.character.name =
            identity.characterFirstName + identity.characterLastName;
        const characterDataMongo = await this._db
            ?.collection("characters")
            .findOne({ characterId: client.character.characterId });
        client.character.extraModel = characterDataMongo?.extraModelTexture
            ? characterDataMongo.extraModelTexture
            : this._dummySelf.data.extraModelTexture;
        let isRandomlySpawning = false;
        if (this._soloMode ||
            !characterDataMongo.position ||
            !this._respawnOnLastPosition) {
            isRandomlySpawning = true;
        }
        if (isRandomlySpawning) {
            // Take position/rotation from a random spawn location.
            const spawnLocations = localSpawnList;
            const randomSpawnIndex = Math.floor(Math.random() * spawnLocations.length);
            this._dummySelf.data.position = client.character.state.position =
                spawnLocations[randomSpawnIndex].position;
            this._dummySelf.data.rotation = client.character.state.rotation =
                spawnLocations[randomSpawnIndex].rotation;
            client.character.spawnLocation = spawnLocations[randomSpawnIndex].name;
        }
        else {
            if (!this._soloMode) {
                this._dummySelf.data.position = characterDataMongo.position;
                this._dummySelf.data.rotation = characterDataMongo.rotation;
            }
            client.character.state.position = this._dummySelf.data.position;
            client.character.state.rotation = this._dummySelf.data.rotation;
        }
        /* const characterResources: any[] = []; DISABLED since it's not read by the game rn + we don't need to send all resources
            resources.forEach((resource: any) => {
              characterResources.push({
                resourceType: resource.RESOURCE_TYPE,
                resourceData: {
                  subResourceData: {
                    resourceId: resource.ID,
                    resourceType: resource.RESOURCE_TYPE,
                    unknownArray1: [],
                  },
                  unknownData2: {
                    max_value: resource.MAX_VALUE,
                    initial_value: resource.INITIAL_VALUE,
                  },
                },
              });
            });
            this._dummySelf.data.characterResources = characterResources;*/
        this._dummySelf.data.profiles = this._profiles;
        this._dummySelf.data.stats = stats;
        this._dummySelf.data.recipes = recipes;
        this.sendData(client, "SendSelfToClient", this._dummySelf);
    }
    generateProfiles() {
        const profiles = [];
        const profileTypes = require("../../../data/2015/dataSources/ProfileTypes.json");
        profileTypes.forEach((profile) => {
            profiles.push({
                profileId: profile.ID,
                type: profile.ID,
                nameId: profile.NAME_ID,
            });
        });
        delete require.cache[require.resolve("../../../data/2015/dataSources/ProfileTypes.json")];
        debug("Generated profiles");
        return profiles;
    }
    generateItems() {
        const items = [];
        const itemDefinitions = require("../../../data/2015/dataSources/ClientItemDefinitions.json");
        itemDefinitions.forEach((item) => {
            items.push({
                definitionData: {
                    ID: item.ID,
                    flags: {
                        NO_TRADE: item.NO_TRADE,
                        COMBAT_ONLY: item.COMBAT_ONLY,
                        NO_LIVE_GAMER: item.NO_LIVE_GAMER,
                        SINGLE_USE: item.SINGLE_USE,
                        NON_MINI_GAME: item.NON_MINI_GAME,
                        MEMBERS_ONLY: item.MEMBERS_ONLY,
                        NO_SALE: item.NO_SALE,
                        FORCE_DISABLE_PREVIEW: item.FORCE_DISABLE_PREVIEW,
                    },
                    flags2: {
                        PERSIST_PROFILE_SWITCH: item.PERSIST_PROFILE_SWITCH,
                        FLAG_QUICK_USE: item.FLAG_QUICK_USE,
                        FLAG_NO_DRAG_DROP: false,
                        FLAG_ACCOUNT_SCOPE: item.FLAG_ACCOUNT_SCOPE,
                        FLAG_CAN_EQUIP: item.FLAG_CAN_EQUIP,
                        bit5: false,
                        bit6: false,
                        bit7: false,
                    },
                    nameId: item.NAME_ID,
                    descriptionId: item.DESCRIPTION_ID,
                    unknownDword4: 6,
                    iconId: item.IMAGE_SET_ID,
                    tintId: item.TINT_ID,
                    hudImageSetId: item.HUD_IMAGE_SET_ID,
                    unknownDword8: 10,
                    unknownDword9: 11,
                    coinPurchasePrice: item.COST,
                    itemClass: item.ITEM_CLASS,
                    slot: item.SLOT,
                    unknownDword13: 15,
                    modelName: item.MODEL_NAME,
                    textureAlias: item.TEXTURE_ALIAS,
                    genderUsage: item.GENDER_USAGE,
                    itemType: item.ITEM_TYPE,
                    categoryId: item.CATEGORY_ID,
                    unknownDword17: 19,
                    compositeEffectId: item.COMPOSITE_EFFECT_ID,
                    powerRating: item.POWER_RATING,
                    minProfileRank: item.MIN_PROFILE_RANK,
                    unknownDword21: 23,
                    unknownDword22: 24,
                    unknownDword23: 25,
                    unknownDword24: 26,
                    unknownDword25: 27,
                    maxStackSize: item.MAX_STACK_SIZE,
                    unknownDword27: 29,
                    tintAlias: item.TINT_ALIAS,
                    unknownDword28: 30,
                    unknownDword29: 31,
                    VipRankRequirement: item.VIP_RANK_REQUIRED,
                    unknownDword31: 33,
                    unknownDword32: 34,
                    equipCountMax: item.EQUIP_COUNT_MAX,
                    currencyType: item.CURRENCY_TYPE,
                    unknownDword35: 37,
                    unknownDword36: 38,
                    unknownDword37: 39,
                    overlayTexture: item.OVERLAY_TEXTURE,
                    decalSlot: item.DECAL_SLOT,
                    unknownDword38: 40,
                    unknownDword39: 41,
                    unknownDword40: 42,
                    unknownDword41: 43,
                    overrideAppearance: item.OVERRIDE_APPEARANCE,
                    overrideCameraId: item.OVERRIDE_CAMERA_ID,
                    unknownDword43: 45,
                    unknownDword44: 46,
                    unknownDword45: 2,
                    bulk: item.BULK,
                    unknownDword47: 0,
                    unknownDword48: 0,
                    unknownDword49: 0,
                    unknownDword50: 0,
                    unknownDword51: 0,
                    unknownDword52: 0,
                    stats: [],
                },
            });
        });
        debug("Generated " + items.length + " items");
        return items;
    }
    sendInitData(client) {
        this.SendZoneDetailsPacket(client, this._weather);
        this.sendData(client, "ClientGameSettings", {
            Unknown2: 0,
            interactGlowAndDist: 3,
            unknownBoolean1: false,
            timescale: 1.0,
            Unknown4: 0,
            Unknown: 0,
            unknownFloat1: 0.0,
            unknownFloat2: 0.0,
            velDamageMulti: 1.0,
        });
        this.characterData(client);
        this.sendData(client, "Command.ItemDefinitions", {
            data: {
                itemDefinitions: this._items,
            },
        });
    }
    spawnNpcs(client) {
        for (const npc in this._npcs) {
            if ((0, utils_1.isPosInRadius)(this._npcRenderDistance, client.character.state.position, this._npcs[npc].position) &&
                !client.spawnedEntities.includes(this._npcs[npc])) {
                this.sendData(client, "PlayerUpdate.AddLightweightNpc", {
                    ...this._npcs[npc],
                    profileId: 65,
                });
                client.spawnedEntities.push(this._npcs[npc]);
            }
        }
    }
    POIManager(client) {
        // sends POIChangeMessage or clears it based on player location
        let inPOI = false;
        Z1_POIs.forEach((point) => {
            if ((0, utils_1.isPosInRadius)(point.range, client.character.state.position, point.position)) {
                inPOI = true;
                if (client.currentPOI != point.stringId) {
                    // checks if player already was sent POIChangeMessage
                    this.sendData(client, "POIChangeMessage", {
                        messageStringId: point.stringId,
                        id: point.POIid,
                    });
                    client.currentPOI = point.stringId;
                }
            }
        });
        if (!inPOI && client.currentPOI != 0) {
            // checks if POIChangeMessage was already cleared
            this.sendData(client, "POIChangeMessage", {
                messageStringId: 0,
                id: 115,
            });
            client.currentPOI = 0;
        }
    }
    executeFuncForAllReadyClients(callback) {
        for (const client in this._clients) {
            const clientObj = this._clients[client];
            if (!clientObj.isLoading) {
                callback(clientObj);
            }
        }
    }
    worldRoutineClient(client) {
        this.spawnCharacters(client);
        this.spawnObjects(client);
        this.spawnDoors(client);
        this.spawnProps(client);
        this.spawnNpcs(client);
        this.spawnVehicles(client);
        this.spawnDTOs(client);
        this.removeOutOfDistanceEntities(client);
        this.POIManager(client);
        client.posAtLastRoutine = client.character.state.position;
    }
    worldRoutine(refresh = false) {
        this.executeFuncForAllReadyClients(this.worldRoutineClient.bind(this));
        if (refresh)
            this.worldRoutineTimer.refresh();
    }
    speedTreeDestroy(packet) {
        this.sendDataToAll("DtoStateChange", {
            objectId: packet.data.id,
            modelName: packet.data.name.concat(".Stump"),
            effectId: 0,
            unk3: 0,
            unk4: true,
        });
        const { id: objectId, name } = packet.data;
        this._speedTrees[packet.data.id] = {
            objectId: objectId,
            modelName: name,
        };
        setTimeout(() => {
            this.sendDataToAll("DtoStateChange", {
                objectId: objectId,
                modelName: this._speedTrees[objectId].modelName,
                effectId: 0,
                unk3: 0,
                unk4: true,
            });
            delete this._speedTrees[objectId];
        }, 1800000);
    }
    speedTreeUse(client, packet) {
        const elo = this._speedTrees[packet.data.id];
        if (elo) {
            debug("\x1b[32m", client.character.name + "\x1b[0m", "tried to use destroyed speedTree id:" + "\x1b[32m", packet.data.id);
        }
        else {
            switch (packet.data.name) {
                case "SpeedTree.Blackberry":
                    this.sendData(client, "ClientUpdate.TextAlert", {
                        message: packet.data.name.replace("SpeedTree.", ""),
                    });
                    client.character.resources.water += 200;
                    this.updateResource(client, client.character.characterId, client.character.resources.water, 5, 5);
                    client.character.resources.food += 200;
                    this.updateResource(client, client.character.characterId, client.character.resources.food, 4, 4);
                    break;
                default:
                    this.sendData(client, "ClientUpdate.TextAlert", {
                        message: packet.data.name.replace("SpeedTree.", ""),
                    });
                    break;
            }
            this.speedTreeDestroy(packet);
        }
    }
    setGodMode(client, godMode) {
        client.character.godMode = godMode;
        client.character.characterStates.invincibility = godMode;
        this.sendChatText(client, `GODMODE: ${client.character.godMode ? "ON" : "OFF"}`);
        this.updateCharacterState(client, client.character.characterId, client.character.characterStates, false);
    }
    toggleHiddenMode(client) {
        client.character.isHidden = !client.character.isHidden;
        client.character.characterStates.gmHidden = client.character.isHidden;
        this.updateCharacterState(client, client.character.characterId, client.character.characterStates, false);
    }
    tempGodMode(client, durationMs) {
        if (!client.character.godMode) {
            client.character.godMode = true;
            setTimeout(() => {
                client.character.godMode = false;
            }, durationMs);
        }
    }
    killCharacter(client) {
        const character = client.character;
        if (character.isAlive) {
            debug(character.name + " has died");
            client.character.isRunning = false;
            client.character.characterStates.knockedOut = true;
            this.updateCharacterState(client, client.character.characterId, client.character.characterStates, false);
            if (!client.vehicle.mountedVehicle) {
                this.sendDataToAll("Ragdoll.UpdatePose", {
                    characterId: character.characterId,
                    positionUpdate: {
                        sequenceTime: this.getSequenceTime(),
                        unknown3_int8: 1,
                        stance: 1089,
                        position: character.state.position,
                        orientation: 0,
                        frontTilt: 0,
                        sideTilt: 0,
                        angleChange: 0,
                        verticalSpeed: 0,
                        horizontalSpeed: 0,
                        unknown12_float: [0, 0, 0],
                        rotationRaw: [0, 0, -0, 1],
                        direction: 0,
                        engineRPM: 0,
                    },
                });
            }
            else {
                this.sendDataToAllOthers(client, "PlayerUpdate.RemovePlayerGracefully", {
                    characterId: character.characterId,
                });
            }
            const guid = this.generateGuid();
            const transientId = 1;
            const characterId = this.generateGuid();
            const prop = {
                characterId: characterId,
                worldId: this._worldId,
                guid: guid,
                transientId: transientId,
                modelId: 9,
                position: character.state.position,
                rotation: [0, 0, 0, 0],
                scale: [1, 1, 1, 1],
                positionUpdateType: 1,
            };
            this.sendDataToAll("PlayerUpdate.AddLightweightNpc", prop);
            if (!this._soloMode) {
                this._db?.collection("props").insertOne(prop);
            }
            this._props[characterId] = prop;
        }
        character.isAlive = false;
    }
    playerDamage(client, damage) {
        const character = client.character;
        if (!client.character.godMode &&
            client.character.isAlive &&
            client.character.characterId) {
            if (damage > 99) {
                character.resources.health -= damage;
            }
            if (character.resources.health <= 0) {
                character.resources.health = 0;
                this.killCharacter(client);
            }
            // Character bleeding prototype
            if ((damage >= 4000 && !client.character.isBleeding) ||
                (!client.character.isBleeding &&
                    client.character.resources.health < 2000 &&
                    damage > 100)) {
                const moderateBleeding = 5042;
                const impactSound = 5050;
                if (damage >= 4000) {
                    this.sendDataToAll("PlayerUpdate.EffectPackage", {
                        characterId: client.character.characterId,
                        stringId: 1,
                        effectId: impactSound,
                    });
                }
                this.sendDataToAll("PlayerUpdate.EffectPackage", {
                    characterId: client.character.characterId,
                    stringId: 1,
                    effectId: moderateBleeding,
                });
                if (!client.character.isBleeding) {
                    client.character.isBleeding = true;
                }
            }
            this.updateResource(client, character.characterId, character.resources.health, 48, 1);
        }
    }
    async respawnPlayer(client) {
        client.character.isAlive = true;
        client.character.isRunning = false;
        client.character.resources.health = 10000;
        client.character.resources.food = 10000;
        client.character.resources.water = 10000;
        client.character.resources.stamina = 600;
        client.character.resourcesUpdater.refresh();
        delete client.character.characterStates.knockedOut;
        this.updateCharacterState(client, client.character.characterId, client.character.characterStates, false);
        this.sendData(client, "PlayerUpdate.RespawnReply", {
            characterId: client.character.characterId,
            unk: 1,
        });
        const spawnLocations = localSpawnList;
        const randomSpawnIndex = Math.floor(Math.random() * spawnLocations.length);
        this.sendData(client, "ClientUpdate.UpdateLocation", {
            position: spawnLocations[randomSpawnIndex].position,
        });
        client.character.state.position = spawnLocations[randomSpawnIndex].position;
        this.updateResource(client, client.character.characterId, client.character.resources.health, 48, 1);
        this.updateResource(client, client.character.characterId, client.character.resources.stamina, 6, 6);
        this.updateResource(client, client.character.characterId, client.character.resources.food, 4, 4);
        this.updateResource(client, client.character.characterId, client.character.resources.water, 5, 5);
    }
    explosionDamage(position, npcTriggered) {
        for (const character in this._clients) {
            const characterObj = this._clients[character];
            if (!characterObj.character.godMode) {
                if ((0, utils_1.isPosInRadius)(5, characterObj.character.state.position, position)) {
                    const distance = (0, utils_1.getDistance)(position, characterObj.character.state.position);
                    const damage = 20000 / distance;
                    this.playerDamage(this._clients[character], damage);
                }
            }
        }
        for (const vehicleKey in this._vehicles) {
            const vehicle = this._vehicles[vehicleKey];
            if (!vehicle.isInvulnerable &&
                vehicle.npcData.characterId != npcTriggered) {
                if ((0, utils_1.isPosInRadius)(5, vehicle.npcData.position, position)) {
                    const distance = (0, utils_1.getDistance)(position, vehicle.npcData.position);
                    const damage = 20000 / distance;
                    this.damageVehicle(damage, vehicle);
                }
            }
        }
    }
    damageVehicle(damage, vehicle, loopDamageMs = 0) {
        if (!vehicle.isInvulnerable) {
            let destroyedVehicleEffect;
            let destroyedVehicleModel;
            let minorDamageEffect;
            let majorDamageEffect;
            let criticalDamageEffect;
            switch (vehicle.vehicleType) {
                case "offroader":
                    destroyedVehicleEffect = 135;
                    destroyedVehicleModel = 7226;
                    minorDamageEffect = 182;
                    majorDamageEffect = 181;
                    criticalDamageEffect = 180;
                    break;
                case "pickup":
                    destroyedVehicleEffect = 326;
                    destroyedVehicleModel = 9315;
                    minorDamageEffect = 325;
                    majorDamageEffect = 324;
                    criticalDamageEffect = 323;
                    break;
                case "policecar":
                    destroyedVehicleEffect = 286;
                    destroyedVehicleModel = 9316;
                    minorDamageEffect = 285;
                    majorDamageEffect = 284;
                    criticalDamageEffect = 283;
                    break;
                default:
                    destroyedVehicleEffect = 135;
                    destroyedVehicleModel = 7226;
                    minorDamageEffect = 182;
                    majorDamageEffect = 181;
                    criticalDamageEffect = 180;
                    break;
            }
            vehicle.npcData.resources.health -= damage;
            if (loopDamageMs &&
                vehicle.npcData.resources.health &&
                vehicle.npcData.destroyedState === 3) {
                setTimeout(() => {
                    this.damageVehicle(1000, vehicle, loopDamageMs);
                }, loopDamageMs);
            }
            if (vehicle.npcData.resources.health <= 0) {
                vehicle.npcData.resources.health = 0;
                if (vehicle.passengers.passenger1) {
                    this.dismountVehicle(vehicle.passengers.passenger1, vehicle.npcData.characterId);
                }
                if (vehicle.passengers.passenger2) {
                    this.dismountVehicle(vehicle.passengers.passenger2, vehicle.npcData.characterId);
                }
                if (vehicle.passengers.passenger3) {
                    this.dismountVehicle(vehicle.passengers.passenger3, vehicle.npcData.characterId);
                }
                if (vehicle.passengers.passenger4) {
                    this.dismountVehicle(vehicle.passengers.passenger4, vehicle.npcData.characterId);
                }
                this.sendDataToAll("PlayerUpdate.Destroyed", {
                    characterId: vehicle.npcData.characterId,
                    unknown1: destroyedVehicleEffect,
                    unknown2: destroyedVehicleModel,
                    unknown3: 0,
                    disableWeirdPhysics: false,
                });
                this.explosionDamage(vehicle.npcData.position, vehicle.npcData.characterId);
                vehicle.npcData.destroyedState = 4;
                this.sendDataToAll("PlayerUpdate.RemovePlayerGracefully", {
                    characterId: vehicle.npcData.characterId,
                    timeToDisappear: 13000,
                    stickyEffectId: 156,
                });
                if (vehicle.passengers.passenger1) {
                    const client = this._clients[vehicle.passengers.passenger1];
                    client.vehicle.mountedVehicleType = "0";
                    delete client.vehicle.mountedVehicle;
                    client.vehicle.vehicleState = 0;
                    this.vehicleDelete(client);
                }
            }
            else if (vehicle.npcData.resources.health <= 50000 &&
                vehicle.npcData.resources.health > 35000) {
                if (vehicle.npcData.destroyedState != 1) {
                    vehicle.npcData.destroyedState = 1;
                    this.sendDataToAll("Command.PlayDialogEffect", {
                        characterId: vehicle.npcData.characterId,
                        effectId: minorDamageEffect,
                    });
                    this._vehicles[vehicle.npcData.characterId].destroyedEffect =
                        minorDamageEffect;
                }
            }
            else if (vehicle.npcData.resources.health <= 35000 &&
                vehicle.npcData.resources.health > 20000) {
                if (vehicle.npcData.destroyedState != 2) {
                    vehicle.npcData.destroyedState = 2;
                    this.sendDataToAll("Command.PlayDialogEffect", {
                        characterId: vehicle.npcData.characterId,
                        effectId: majorDamageEffect,
                    });
                    this._vehicles[vehicle.npcData.characterId].destroyedEffect =
                        majorDamageEffect;
                }
            }
            else if (vehicle.npcData.resources.health <= 20000) {
                if (vehicle.npcData.destroyedState != 3) {
                    vehicle.npcData.destroyedState = 3;
                    setTimeout(() => {
                        this.damageVehicle(damage, vehicle, 1000);
                    }, 1000);
                    this.sendDataToAll("Command.PlayDialogEffect", {
                        characterId: vehicle.npcData.characterId,
                        effectId: criticalDamageEffect,
                    });
                    this._vehicles[vehicle.npcData.characterId].destroyedEffect =
                        criticalDamageEffect;
                }
            }
            else if (vehicle.npcData.resources.health > 50000 &&
                vehicle.npcData.destroyedState != 0) {
                vehicle.npcData.destroyedState = 0;
                this.sendDataToAll("Command.PlayDialogEffect", {
                    characterId: vehicle.npcData.characterId,
                    effectId: 0,
                });
                this._vehicles[vehicle.npcData.characterId].destroyedEffect = 0;
            }
            if (vehicle.passengers.passenger1) {
                this.updateResource(vehicle.passengers.passenger1, vehicle.npcData.characterId, vehicle.npcData.resources.health, 561, 1);
            }
            if (vehicle.passengers.passenger2) {
                this.updateResource(vehicle.passengers.passenger2, vehicle.npcData.characterId, vehicle.npcData.resources.health, 561, 1);
            }
            if (vehicle.passengers.passenger3) {
                this.updateResource(vehicle.passengers.passenger3, vehicle.npcData.characterId, vehicle.npcData.resources.health, 561, 1);
            }
            if (vehicle.passengers.passenger4) {
                this.updateResource(vehicle.passengers.passenger4, vehicle.npcData.characterId, vehicle.npcData.resources.health, 561, 1);
            }
        }
    }
    DTOhit(client, packet) {
        if (packet.data.damage > 100000) {
            const entityType = this.getCollisionEntityType(packet.data.objectCharacterId);
            switch (entityType) {
                case 1:
                    const DTO2 = this._destroyables[packet.data.objectCharacterId];
                    this.sendDataToAll("PlayerUpdate.RemovePlayerGracefully", {
                        characterId: packet.data.objectCharacterId,
                        effectId: 242,
                    });
                    for (const object in this._clients) {
                        const clientData = this._clients[object];
                        const objectToRemove = this._destroyables[DTO2.characterId];
                        if (clientData.spawnedDTOs.includes(objectToRemove)) {
                            this._clients[object].spawnedDTOs = this._clients[object].spawnedDTOs.filter((e) => e !== objectToRemove);
                        }
                    }
                    this._destroyablesTimeout[DTO2.characterId] =
                        this._destroyables[DTO2.characterId];
                    delete this._destroyables[DTO2.characterId];
                    this.setDTOrespawnTimeout(DTO2.characterId);
                    break;
                default:
                    break;
            }
        }
    }
    updateResource(client, entityId, value, resource, resourceType) {
        this.sendData(client, "ResourceEvent", {
            eventData: {
                type: 3,
                value: {
                    characterId: entityId,
                    resourceId: resource,
                    resourceType: resourceType,
                    initialValue: value,
                    unknownArray1: [],
                    unknownArray2: [],
                },
            },
        });
    }
    updateCharacterState(client, characterId, object, sendToAll) {
        const updateCharacterStateBody = {
            characterId: characterId,
            states1: object,
            states2: object,
            states3: object,
            states4: object,
            states5: object,
            states6: object,
            states7: object,
        };
        if (!sendToAll) {
            this.sendData(client, "PlayerUpdate.UpdateCharacterState", updateCharacterStateBody);
        }
        else {
            this.sendDataToAll("PlayerUpdate.UpdateCharacterState", updateCharacterStateBody);
        }
    }
    turnOnEngine(vehicleGuid) {
        if (this._vehicles[vehicleGuid].npcData.resources.fuel > 0) {
            this.sendDataToAll("Vehicle.Engine", {
                guid2: vehicleGuid,
                unknownBoolean: true,
            });
            this._vehicles[vehicleGuid].engineOn = true;
            this._vehicles[vehicleGuid].resourcesUpdater = setInterval(() => {
                if (this._vehicles[vehicleGuid].positionUpdate.engineRPM) {
                    const fuelLoss = this._vehicles[vehicleGuid].positionUpdate.engineRPM * 0.005;
                    this._vehicles[vehicleGuid].npcData.resources.fuel -= fuelLoss;
                }
                if (this._vehicles[vehicleGuid].npcData.resources.fuel < 0) {
                    this._vehicles[vehicleGuid].npcData.resources.fuel = 0;
                }
                if (this._vehicles[vehicleGuid].engineOn &&
                    this._vehicles[vehicleGuid].npcData.resources.fuel <= 0) {
                    this.turnOffEngine(vehicleGuid);
                }
                if (this._vehicles[vehicleGuid].passengers.passenger1) {
                    this.updateResource(this._vehicles[vehicleGuid].passengers.passenger1, this._vehicles[vehicleGuid].npcData.characterId, this._vehicles[vehicleGuid].npcData.resources.fuel, 396, 50);
                }
                if (this._vehicles[vehicleGuid].passengers.passenger2) {
                    this.updateResource(this._vehicles[vehicleGuid].passengers.passenger2, this._vehicles[vehicleGuid].npcData.characterId, this._vehicles[vehicleGuid].npcData.resources.fuel, 396, 50);
                }
                if (this._vehicles[vehicleGuid].passengers.passenger3) {
                    this.updateResource(this._vehicles[vehicleGuid].passengers.passenger3, this._vehicles[vehicleGuid].npcData.characterId, this._vehicles[vehicleGuid].npcData.resources.fuel, 396, 50);
                }
                if (this._vehicles[vehicleGuid].passengers.passenger4) {
                    this.updateResource(this._vehicles[vehicleGuid].passengers.passenger4, this._vehicles[vehicleGuid].npcData.characterId, this._vehicles[vehicleGuid].npcData.resources.fuel, 396, 50);
                }
            }, 3000);
        }
    }
    turnOffEngine(vehicleGuid) {
        this._vehicles[vehicleGuid].engineOn = false;
        this.sendDataToAll("Vehicle.Engine", {
            guid2: vehicleGuid,
            unknownBoolean: false,
        });
        clearInterval(this._vehicles[vehicleGuid].resourcesUpdater);
    }
    manageVehicle(client, vehicleGuid) {
        if (this._vehicles[vehicleGuid].manager) {
            this.dropVehicleManager(this._vehicles[vehicleGuid].manager, vehicleGuid);
        }
        this._vehicles[vehicleGuid].isManaged = true;
        this._vehicles[vehicleGuid].manager = client;
        client.managedObjects.push(vehicleGuid);
        this.sendData(client, "PlayerUpdate.ManagedObject", {
            guid: vehicleGuid,
            characterId: client.character.characterId,
        });
    }
    sendManagedObjectResponseControlPacket(client, obj) {
        this.sendData(client, "PlayerUpdate.ManagedObjectResponseControl", obj);
    }
    dropVehicleManager(client, vehicleGuid) {
        this.sendManagedObjectResponseControlPacket(client, {
            control: 0,
            objectCharacterId: vehicleGuid,
        });
        client.managedObjects.splice(client.managedObjects.findIndex((e) => e === vehicleGuid), 1);
        delete this._vehicles[vehicleGuid]?.manager;
    }
    enterVehicle(client, entityData) {
        let allowedAccess;
        let seat;
        let isDriver;
        if (!entityData.seat.seat1) {
            isDriver = 1;
            seat = 0;
            allowedAccess = 1;
            entityData.isLocked = 0;
            client.vehicle.mountedVehicleSeat = 1;
        }
        else if (!entityData.seat.seat2) {
            isDriver = 0;
            seat = 1;
            allowedAccess = 1;
            client.vehicle.mountedVehicleSeat = 2;
        }
        else if (!entityData.seat.seat3) {
            isDriver = 0;
            seat = 2;
            allowedAccess = 1;
            client.vehicle.mountedVehicleSeat = 3;
        }
        else if (!entityData.seat.seat4) {
            isDriver = 0;
            seat = 3;
            allowedAccess = 1;
            client.vehicle.mountedVehicleSeat = 4;
        }
        else {
            allowedAccess = 3;
        }
        if (allowedAccess === 1 && entityData.isLocked != 2) {
            const { characterId: vehicleGuid } = entityData.npcData;
            const { modelId: vehicleModelId } = entityData.npcData;
            switch (vehicleModelId) {
                case 7225:
                    client.vehicle.mountedVehicleType = "offroader";
                    break;
                case 9258:
                    client.vehicle.mountedVehicleType = "pickup";
                    break;
                case 9301:
                    client.vehicle.mountedVehicleType = "policecar";
                    break;
                default:
                    client.vehicle.mountedVehicleType = "offroader";
                    break;
            }
            switch (seat) {
                case 0:
                    this._vehicles[vehicleGuid].seat.seat1 = true;
                    this.manageVehicle(client, vehicleGuid);
                    this._vehicles[vehicleGuid].isLocked = 0;
                    this.turnOnEngine(vehicleGuid);
                    this._vehicles[vehicleGuid].passengers.passenger1 = client;
                    break;
                case 1:
                    this._vehicles[vehicleGuid].seat.seat2 = true;
                    this._vehicles[vehicleGuid].passengers.passenger2 = client;
                    break;
                case 2:
                    this._vehicles[vehicleGuid].seat.seat3 = true;
                    this._vehicles[vehicleGuid].passengers.passenger3 = client;
                    break;
                case 3:
                    this._vehicles[vehicleGuid].seat.seat4 = true;
                    this._vehicles[vehicleGuid].passengers.passenger4 = client;
                    break;
            }
            this.sendDataToAll("Mount.MountResponse", {
                characterId: client.character.characterId,
                guid: vehicleGuid,
                unknownDword1: seat,
                unknownDword3: isDriver,
                characterData: [],
            });
            this.updateResource(client, vehicleGuid, entityData.npcData.resources.fuel, 396, 50);
            this.updateResource(client, vehicleGuid, entityData.npcData.resources.health, 561, 1);
            if (isDriver === 1) {
                this.sendDataToAll("Vehicle.Owner", {
                    guid: vehicleGuid,
                    characterId: client.character.characterId,
                    unknownDword1: 0,
                    vehicleId: entityData.npcData.vehicleId,
                    passengers: [
                        {
                            passengerData: {
                                characterId: client.character.characterId,
                                characterData: {
                                    unknownDword1: 1,
                                    unknownDword2: 1,
                                    unknownDword3: 1,
                                    characterName: client.character.name,
                                    unknownString1: "",
                                },
                                unknownDword1: 1,
                                unknownString1: "",
                            },
                            unknownByte1: 1,
                        },
                    ],
                });
            }
            this.sendData(client, "Vehicle.Occupy", {
                guid: entityData.npcData.characterId,
                characterId: client.character.characterId,
                vehicleId: entityData.npcData.vehicleId,
                unknownDword1: 0,
                unknownArray1: [
                    {
                        unknownDword1: 0,
                        unknownBoolean1: 0,
                    },
                ],
                passengers: [
                    {
                        passengerData: {
                            characterId: client.character.characterId,
                            characterData: {
                                unknownDword1: 0,
                                unknownDword2: 0,
                                unknownDword3: 0,
                                characterName: client.character.name,
                            },
                        },
                        unknownDword1: 0,
                    },
                ],
                unknownArray2: [{}],
                unknownData1: {
                    unknownData1: {
                        unknownArray1: [{}],
                        unknownArray2: [{}],
                    },
                },
            });
            this.sendData(client, "PlayerUpdate.UpdateMutateRights", {
                unknownQword1: "1",
                unknownBoolean1: true,
            });
            client.vehicle.mountedVehicle = vehicleGuid;
            client.character.isRunning = false;
        }
        else if (entityData.isLocked === 2) {
            this.sendData(client, "ClientUpdate.TextAlert", {
                message: "Vehicle is locked",
            });
        }
    }
    dismountVehicle(client, vehicleGuid) {
        const vehicleData = this._vehicles[vehicleGuid];
        if (vehicleData.passengers.passenger1 &&
            vehicleData.passengers.passenger1 != client) {
            this.sendData(vehicleData.passengers.passenger1, "Mount.DismountResponse", {
                characterId: vehicleData.passengers.passenger1.character.characterId,
                guid: vehicleData.npcData.characterId,
            });
        }
        if (vehicleData.passengers.passenger2 &&
            vehicleData.passengers.passenger2 != client) {
            this.sendData(vehicleData.passengers.passenger2, "Mount.DismountResponse", {
                characterId: vehicleData.passengers.passenger2.character.characterId,
                guid: vehicleData.npcData.characterId,
            });
        }
        if (vehicleData.passengers.passenger3 &&
            vehicleData.passengers.passenger3 != client) {
            this.sendData(vehicleData.passengers.passenger3, "Mount.DismountResponse", {
                characterId: vehicleData.passengers.passenger3.character.characterId,
                guid: vehicleData.npcData.characterId,
            });
        }
        if (vehicleData.passengers.passenger4 &&
            vehicleData.passengers.passenger4 != client) {
            this.sendData(vehicleData.passengers.passenger4, "Mount.DismountResponse", {
                characterId: vehicleData.passengers.passenger4.character.characterId,
                guid: vehicleData.npcData.characterId,
            });
        }
        this.sendDataToAll("Mount.DismountResponse", {
            characterId: client.character.characterId,
            guid: vehicleData.npcData.characterId,
        });
        if (vehicleData.passengers.passenger1 &&
            vehicleData.passengers.passenger1 != client) {
            this.sendDataToAll("Mount.MountResponse", {
                characterId: vehicleData.passengers.passenger1.character.characterId,
                guid: vehicleData.npcData.characterId,
                unknownDword1: 0,
                unknownDword3: 1,
                characterData: [],
            });
        }
        if (vehicleData.passengers.passenger2 &&
            vehicleData.passengers.passenger2 != client) {
            this.sendDataToAll("Mount.MountResponse", {
                characterId: vehicleData.passengers.passenger2.character.characterId,
                guid: vehicleData.npcData.characterId,
                unknownDword1: 1,
                unknownDword3: 0,
                characterData: [],
            });
        }
        if (vehicleData.passengers.passenger3 &&
            vehicleData.passengers.passenger3 != client) {
            this.sendDataToAll("Mount.MountResponse", {
                characterId: vehicleData.passengers.passenger3.character.characterId,
                guid: vehicleData.npcData.characterId,
                unknownDword1: 2,
                unknownDword3: 0,
                characterData: [],
            });
        }
        if (vehicleData.passengers.passenger4 &&
            vehicleData.passengers.passenger4 != client) {
            this.sendDataToAll("Mount.MountResponse", {
                characterId: vehicleData.passengers.passenger4.character.characterId,
                guid: vehicleData.npcData.characterId,
                unknownDword1: 3,
                unknownDword3: 0,
                characterData: [],
            });
        }
        this.sendData(client, "Vehicle.Occupy", {
            guid: "",
            characterId: client.character.characterId,
            vehicleId: 0,
            unknownDword1: 1,
            unknownArray1: [
                {
                    unknownDword1: 1,
                    unknownBoolean1: 1,
                },
            ],
            passengers: [
                {
                    passengerData: { characterData: {} },
                },
            ],
            unknownArray2: [{}],
            unknownData1: {
                unknownData1: {
                    unknownArray1: [{}],
                    unknownArray2: [{}],
                },
            },
        });
        client.vehicle.mountedVehicleType = "0";
        delete client.vehicle.mountedVehicle;
        switch (client.vehicle.mountedVehicleSeat) {
            case 1:
                this._vehicles[vehicleGuid].seat.seat1 = false;
                delete this._vehicles[vehicleGuid].passengers.passenger1;
                this.turnOffEngine(vehicleData.npcData.characterId);
                break;
            case 2:
                this._vehicles[vehicleGuid].seat.seat2 = false;
                delete this._vehicles[vehicleGuid].passengers.passenger2;
                break;
            case 3:
                this._vehicles[vehicleGuid].seat.seat3 = false;
                delete this._vehicles[vehicleGuid].passengers.passenger3;
                break;
            case 4:
                this._vehicles[vehicleGuid].seat.seat4 = false;
                delete this._vehicles[vehicleGuid].passengers.passenger4;
                break;
        }
        if (vehicleData.onDismount) {
            vehicleData.onDismount();
        }
    }
    dismissVehicle(vehicleGuid) {
        this.sendDataToAll("PlayerUpdate.RemovePlayerGracefully", {
            characterId: vehicleGuid,
        });
        this.deleteEntity(vehicleGuid, this._vehicles);
    }
    dropPlayerInParachute(client, position) {
        const characterId = this.generateGuid();
        const vehicleData = new vehicle_1.Vehicle(this._worldId, characterId, this.getTransientId(characterId), 9374, position, client.character.state.lookAt);
        this.sendDataToAll("PlayerUpdate.AddLightweightVehicle", vehicleData);
        this.sendData(client, "PlayerUpdate.ManagedObject", {
            guid: vehicleData.npcData.characterId,
            characterId: client.character.characterId,
        });
        vehicleData.isManaged = true;
        vehicleData.isInvulnerable = true;
        this._vehicles[characterId] = vehicleData;
        this.worldRoutine();
        this.sendDataToAll("Mount.MountResponse", {
            characterId: client.character.characterId,
            guid: characterId,
            characterData: [],
        });
        client.vehicle.mountedVehicle = characterId;
        client.managedObjects.push(characterId);
    }
    updatePosition(client, position) {
        client.character.state.position = position;
    }
    spawnCharacters(client) {
        for (const character in this._characters) {
            const characterObj = this._characters[character];
            if ((0, utils_1.isPosInRadius)(this._npcRenderDistance, client.character.state.position, characterObj.state.position) &&
                client.character.characterId != character &&
                !client.spawnedEntities.includes(characterObj) &&
                !characterObj.isHidden) {
                this.sendData(client, "PlayerUpdate.AddLightweightPc", {
                    ...characterObj,
                    transientId: characterObj.transientId,
                    characterFirstName: characterObj.name,
                    position: characterObj.state.position,
                    rotation: characterObj.state.lookAt,
                });
                client.spawnedEntities.push(this._characters[character]);
            }
        }
    }
    spawnVehicles(client) {
        for (const vehicle in this._vehicles) {
            if ((0, utils_1.isPosInRadius)(this._npcRenderDistance, client.character.state.position, this._vehicles[vehicle].npcData.position) &&
                !client.spawnedEntities.includes(this._vehicles[vehicle])) {
                this.sendData(client, "PlayerUpdate.AddLightweightVehicle", this._vehicles[vehicle]);
                if (!this._vehicles[vehicle].isManaged) {
                    this.sendData(client, "PlayerUpdate.ManagedObject", {
                        guid: this._vehicles[vehicle].npcData.characterId,
                        characterId: client.character.characterId,
                    });
                    this._vehicles[vehicle].isManaged = true;
                    this._vehicles[vehicle].manager = client;
                }
                client.spawnedEntities.push(this._vehicles[vehicle]);
            }
        }
    }
    filterOutOfDistance(element, playerPosition) {
        return !(0, utils_1.isPosInRadius)((element.npcRenderDistance || this._npcRenderDistance) + 5, playerPosition, element.position || element.state?.position || element.npcData.position);
    }
    removeOutOfDistanceEntities(client) {
        const objectsToRemove = client.spawnedEntities.filter((e) => this.filterOutOfDistance(e, client.character.state.position));
        client.spawnedEntities = client.spawnedEntities.filter((el) => {
            return !objectsToRemove.includes(el);
        });
        objectsToRemove.forEach((object) => {
            const characterId = object.characterId
                ? object.characterId
                : object.npcData.characterId;
            if (characterId in this._vehicles) {
                if (this._vehicles[characterId].manager === client) {
                    this._vehicles[characterId].isManaged = false;
                    this.dropVehicleManager(client, characterId);
                }
            }
            this.sendData(client, "PlayerUpdate.RemovePlayerGracefully", {
                characterId,
            });
        });
    }
    spawnObjects(client) {
        this.spawnNpcCollection(client, this._objects);
    }
    spawnNpcCollection(client, collection) {
        for (const item in collection) {
            const itemData = collection[item];
            if ((0, utils_1.isPosInRadius)(this._npcRenderDistance, client.character.state.position, itemData.position) &&
                !client.spawnedEntities.includes(itemData)) {
                this.sendData(client, "PlayerUpdate.AddLightweightNpc", itemData);
                client.spawnedEntities.push(itemData);
            }
        }
    }
    spawnDoors(client) {
        this.spawnNpcCollection(client, this._doors);
    }
    spawnProps(client) {
        this.spawnNpcCollection(client, this._props);
    }
    customizeDTO(client) {
        const DTOArray = [];
        for (const object in this._destroyables) {
            const DTO = this._destroyables[object];
            const DTOinstance = {
                objectId: DTO.zoneId,
                unknownString1: "Weapon_Empty.adr",
            };
            DTOArray.push(DTOinstance);
        }
        for (const object in this._props) {
            const DTO = this._props[object];
            const DTOinstance = {
                objectId: DTO.zoneId,
                unknownString1: "Weapon_Empty.adr",
            };
            DTOArray.push(DTOinstance);
        }
        for (const object in this._speedTrees) {
            const DTO = this._speedTrees[object];
            const DTOinstance = {
                objectId: DTO.objectId,
                unknownString1: DTO.modelName.concat(".Stump"),
            };
            DTOArray.push(DTOinstance);
        }
        this.sendData(client, "DtoObjectInitialData", {
            unknownDword1: 1,
            unknownArray1: DTOArray,
            unknownArray2: [{}],
        });
    }
    spawnDTOs(client) {
        for (const DTO in this._destroyables) {
            const DTOObject = this._destroyables[DTO];
            if ((0, utils_1.isPosInRadius)(DTOObject.renderDistance, client.character.state.position, DTOObject.position) &&
                !client.spawnedDTOs.includes(DTOObject)) {
                this.sendData(client, "PlayerUpdate.AddLightweightNpc", DTOObject);
                client.spawnedDTOs.push(DTOObject);
            }
        }
    }
    respawnDTO(DTO) {
        const DTOData = this._destroyablesTimeout[DTO];
        let isColliding = false;
        for (const vehicle in this._vehicles) {
            const vehicleData = this._vehicles[vehicle];
            if ((0, utils_1.isPosInRadius)(5, DTOData.position, vehicleData.npcData.position)) {
                isColliding = true;
            }
        }
        if (!isColliding) {
            this._destroyables[DTO] = this._destroyablesTimeout[DTO];
            delete this._destroyablesTimeout[DTO];
        }
        else {
            this.setDTOrespawnTimeout(DTO);
        }
    }
    setDTOrespawnTimeout(DTO) {
        setTimeout(() => {
            this.respawnDTO(DTO);
        }, 1800000);
    }
    despawnEntity(characterId) {
        this.sendDataToAll("PlayerUpdate.RemovePlayerGracefully", {
            characterId: characterId,
        });
    }
    deleteEntity(characterId, dictionnary) {
        this.sendDataToAll("PlayerUpdate.RemovePlayerGracefully", {
            characterId: characterId,
        });
        delete dictionnary[characterId];
    }
    vehicleDelete(client) {
        if (client.vehicle.mountedVehicle) {
            delete this._vehicles[client.vehicle.mountedVehicle];
        }
    }
    createEntity(modelID, position, rotation, dictionnary) {
        const guid = this.generateGuid();
        const characterId = this.generateGuid();
        dictionnary[characterId] = {
            characterId: characterId,
            guid: guid,
            transientId: 1,
            modelId: modelID,
            position: position,
            rotation: rotation,
            attachedObject: {},
            color: {},
            array5: [{ unknown1: 0 }],
            array17: [{ unknown1: 0 }],
            array18: [{ unknown1: 0 }],
        };
    }
    createAllObjects() {
        const { createAllEntities } = require("./workers/createBaseEntities");
        const { npcs, objects, vehicles, doors, props, destroyable } = createAllEntities(this);
        this._npcs = npcs;
        this._objects = objects;
        this._doors = doors;
        this._vehicles = vehicles;
        this._props = props;
        this._destroyables = destroyable;
        delete require.cache[require.resolve("./workers/createBaseEntities")];
        debug("All entities created");
    }
    data(collectionName) {
        if (this._db) {
            return this._db.collection(collectionName);
        }
    }
    SendZoneDetailsPacket(client, weather) {
        const SendZoneDetails_packet = {
            zoneName: "Z1",
            unknownBoolean1: true,
            zoneType: 4,
            skyData: weather,
            zoneId1: 1,
            zoneId2: 1,
            nameId: 7699,
            unknownBoolean7: true,
        };
        this.sendData(client, "SendZoneDetails", SendZoneDetails_packet);
    }
    SendSkyChangedPacket(client, weather, isGlobal = false) {
        if (isGlobal) {
            this.sendDataToAll("SkyChanged", weather);
            if (client?.character?.name) {
                this.sendGlobalChatText(`User "${client.character.name}" has changed weather.`);
            }
        }
        else {
            this.sendData(client, "SkyChanged", weather);
        }
    }
    async changeWeatherWithTemplate(client, weatherTemplate) {
        const weather = this._soloMode
            ? localSpawnList[weatherTemplate]
            : await this._db
                ?.collection("weathers")
                .findOne({ templateName: weatherTemplate });
        if (weather) {
            this._weather = weather;
            this.SendSkyChangedPacket(client, weather, !this._soloMode);
        }
        else {
            this.sendChatText(client, `"${weatherTemplate}" isn't a weather template`);
            this.sendChatText(client, `Use "/hax weather list" to know all available templates`);
        }
    }
    changeWeather(client, weather) {
        this._weather = weather;
        this.SendSkyChangedPacket(client, weather, !this._soloMode);
    }
    sendSystemMessage(message) {
        this.sendDataToAll("Chat.Chat", {
            unknown2: 0,
            channel: 2,
            characterId1: "0x0000000000000000",
            characterId2: "0x0000000000000000",
            unknown5_0: 0,
            unknown5_1: 0,
            unknown5_2: 0,
            characterName1: "",
            unknown5_3: "",
            unknown6_0: 0,
            unknown6_1: 0,
            unknown6_2: 0,
            characterName2: "",
            unknown6_3: "",
            message: message,
            position: [0, 0, 0, 1],
            unknownGuid: "0x0000000000000000",
            unknown13: 0,
            color1: 0,
            color2: 0,
            unknown15: 0,
            unknown16: false,
        });
    }
    sendChat(client, message, channel) {
        const { character } = client;
        for (const clientKey in this._clients) {
            const targetClient = this._clients[clientKey];
            if ((0, utils_1.isPosInRadius)(350, client.character.state.position, targetClient.character.state.position)) {
                this.sendData(targetClient, "Chat.Chat", {
                    channel: channel,
                    characterName1: character.name,
                    message: message,
                    color1: 1,
                });
            }
        }
    }
    sendGlobalChatText(message, clearChat = false) {
        for (const a in this._clients) {
            this.sendChatText(this._clients[a], message, clearChat);
        }
    }
    sendGlobalTextAlert(message) {
        for (const a in this._clients) {
            this.sendTextAlert(this._clients[a], message);
        }
    }
    sendTextAlert(client, message) {
        this.sendData(client, "ClientUpdate.TextAlert", {
            message: message,
        });
    }
    sendChatText(client, message, clearChat = false) {
        if (clearChat) {
            for (let index = 0; index <= 6; index++) {
                this.sendData(client, "Chat.ChatText", {
                    message: " ",
                    unknownDword1: 0,
                    color: [255, 255, 255, 0],
                    unknownDword2: 13951728,
                    unknownByte3: 0,
                    unknownByte4: 1,
                });
            }
        }
        this.sendData(client, "Chat.ChatText", {
            message: message,
            unknownDword1: 0,
            color: [255, 255, 255, 0],
            unknownDword2: 13951728,
            unknownByte3: 0,
            unknownByte4: 1,
        });
    }
    setCharacterLoadout(client, loadoutId, loadoutTab) {
        for (let i = 0; i < client.character.loadouts.length; i++) {
            const loadout = client.character.loadouts[i];
            if (loadout.loadoutId == loadoutId && loadout.loadoutTab == loadoutTab) {
                this.sendChatText(client, "Setting loadout " + loadoutId);
                debug(JSON.stringify(loadout, null, 2));
                client.character.currentLoadout = loadout.loadoutData;
                client.character.currentLoadoutId = loadoutId;
                client.character.currentLoadoutTab = loadoutTab;
                this.sendData(client, "Loadout.SetCurrentLoadout", {
                    type: 2,
                    unknown1: 0,
                    loadoutId: loadoutId,
                    tabId: loadoutTab,
                    unknown2: 1,
                });
                break;
            }
        }
    }
    sendData(client, packetName, obj) {
        if (packetName != "KeepAlive") {
            debug("send data", packetName);
        }
        const data = this._protocol.pack(packetName, obj);
        if (data) {
            const soeClient = this.getSoeClient(client.soeClientId);
            if (soeClient) {
                this._gatewayServer.sendTunnelData(soeClient, data);
            }
        }
    }
    sendDataToAll(packetName, obj) {
        const data = this._protocol.pack(packetName, obj);
        if (data) {
            for (const a in this._clients) {
                this.sendRawData(this._clients[a], data);
            }
        }
    }
    sendDataToAllOthers(client, packetName, obj) {
        for (const a in this._clients) {
            if (client != this._clients[a]) {
                this.sendData(this._clients[a], packetName, obj);
            }
        }
    }
    sendRawToAll(data) {
        for (const a in this._clients) {
            this.sendRawData(this._clients[a], data);
        }
    }
    sendRawToAllOthers(client, data) {
        for (const a in this._clients) {
            if (client != this._clients[a]) {
                this.sendRawData(this._clients[a], data);
            }
        }
    }
    sendWeaponPacket(client, packetName, obj) {
        const weaponPacket = {
            gameTime: this.getSequenceTime(),
            packetName: packetName,
            packet: obj,
        };
        this.sendData(client, "Weapon.Weapon", {
            weaponPacket: weaponPacket,
        });
    }
    sendRawData(client, data) {
        const soeClient = this.getSoeClient(client.soeClientId);
        if (soeClient) {
            this._gatewayServer.sendTunnelData(soeClient, data);
        }
    }
    stop() {
        debug("Shutting down");
        process.exitCode = 0;
    }
    forceTime(time) {
        this._cycleSpeed = 0.1;
        this._frozeCycle = true;
        this._gameTime = time;
    }
    removeForcedTime() {
        this._cycleSpeed = 0.1;
        this._frozeCycle = false;
        this._gameTime = Date.now();
    }
    getCurrentTime() {
        return Number((Date.now() / 1000).toFixed(0));
    }
    getGameTime() {
        debug("get server time");
        const delta = Date.now() - this._startGameTime;
        return this._frozeCycle
            ? Number(((this._gameTime + delta) / 1000).toFixed(0))
            : Number((this._gameTime / 1000).toFixed(0));
    }
    getServerTime() {
        debug("get server time");
        const delta = Date.now() - this._startTime;
        return this._serverTime + delta;
    }
    getSequenceTime() {
        return Date.now() - this._time;
    }
    getServerTimeTest() {
        debug("get server time");
        const delta = Date.now() - this._startTime;
        return Number((((this._serverTime + delta) * this._timeMultiplier) / 1000).toFixed(0));
    }
    sendGameTimeSync(client) {
        debug("GameTimeSync");
        if (!this._frozeCycle) {
            this.sendData(client, "GameTimeSync", {
                time: (0, utils_1.Int64String)(this.getServerTimeTest()),
                cycleSpeed: Math.round(this._timeMultiplier * 0.97222),
                unknownBoolean: false,
            });
        }
        else if (this._frozeCycle) {
            this.sendData(client, "GameTimeSync", {
                time: (0, utils_1.Int64String)(this.getGameTime()),
                cycleSpeed: 0.1,
                unknownBoolean: false,
            });
        }
    }
    getTransientId(characterId) {
        const generatedTransient = this._transientIdGenerator.next()
            .value;
        this._transientIds[generatedTransient] = characterId;
        return generatedTransient;
    }
    createPositionUpdate(position, rotation) {
        const obj = {
            flags: 4095,
            unknown2_int32: this.getGameTime(),
            unknown3_int8: 0,
            unknown4: 1,
            position: position,
        };
        if (rotation) {
            obj.unknown13_float = rotation;
        }
        return obj;
    }
};
ZoneServer2015 = __decorate([
    healthWorker_1.healthThreadDecorator
], ZoneServer2015);
exports.ZoneServer2015 = ZoneServer2015;
if (process.env.VSCODE_DEBUG === "true" &&
    process.env.CLIENT_SIXTEEN !== "true") {
    const PackageSetting = require("../../../package.json");
    process.env.H1Z1_SERVER_VERSION = PackageSetting.version;
    const zoneServer = new ZoneServer2015(1117, Buffer.from(constants_1.DEFAULT_CRYPTO_KEY, "base64"), process.env.MONGO_URL, 1);
    zoneServer._maxAllowedPing = 9999;
    zoneServer.start();
}
//# sourceMappingURL=zoneserver.js.map