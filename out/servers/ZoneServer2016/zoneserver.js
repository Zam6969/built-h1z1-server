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
exports.ZoneServer2016 = void 0;
const debugName = "ZoneServer", debug = require("debug")(debugName);
const events_1 = require("events");
const gatewayserver_1 = require("../GatewayServer/gatewayserver");
const h1z1protocol_1 = require("../../protocols/h1z1protocol");
const h1emuZoneServer_1 = require("../H1emuServer/h1emuZoneServer");
const dns_1 = require("dns");
const util_1 = require("util");
const zonepackethandlers_1 = require("./zonepackethandlers");
const zoneclient_1 = require("./classes/zoneclient");
const vehicle_1 = require("./entities/vehicle");
const gridcell_1 = require("./classes/gridcell");
const worldobjectmanager_1 = require("./managers/worldobjectmanager");
const enums_1 = require("./models/enums");
const healthWorker_1 = require("../shared/workers/healthWorker");
const weathermanager_1 = require("./managers/weathermanager");
const character_1 = require("./entities/character");
const utils_1 = require("../../utils/utils");
const constants_1 = require("../../utils/constants");
const trapentity_1 = require("./entities/trapentity");
const doorentity_1 = require("./entities/doorentity");
const npc_1 = require("./entities/npc");
const explosiveentity_1 = require("./entities/explosiveentity");
const baselightweightcharacter_1 = require("./entities/baselightweightcharacter");
const temporaryentity_1 = require("./entities/temporaryentity");
const constructiondoor_1 = require("./entities/constructiondoor");
const constructionparententity_1 = require("./entities/constructionparententity");
const constructionchildentity_1 = require("./entities/constructionchildentity");
const worlddatamanager_1 = require("./managers/worlddatamanager");
const Recipes_1 = require("./data/Recipes");
const useoptions_1 = require("./data/useoptions");
const enums_2 = require("../../utils/enums");
const functions_1 = require("../shared/functions");
const hookmanager_1 = require("./managers/hookmanager");
const baseItem_1 = require("./classes/baseItem");
const weapon_1 = require("./classes/weapon");
const baselootableentity_1 = require("./entities/baselootableentity");
const lootableconstructionentity_1 = require("./entities/lootableconstructionentity");
const plantingdiameter_1 = require("./entities/plantingdiameter");
const plant_1 = require("./entities/plant");
const smeltingentity_1 = require("./classes/smeltingentity");
const spawnLocations = require("../../../data/2016/zoneData/Z1_spawnLocations.json"), deprecatedDoors = require("../../../data/2016/sampleData/deprecatedDoors.json"), localWeatherTemplates = require("../../../data/2016/dataSources/weather.json"), itemDefinitions = require("./../../../data/2016/dataSources/ServerItemDefinitions.json"), containerDefinitions = require("./../../../data/2016/dataSources/ContainerDefinitions.json"), profileDefinitions = require("./../../../data/2016/dataSources/ServerProfileDefinitions.json"), projectileDefinitons = require("./../../../data/2016/dataSources/ServerProjectileDefinitions.json"), loadoutSlotItemClasses = require("./../../../data/2016/dataSources/LoadoutSlotItemClasses.json"), equipSlotItemClasses = require("./../../../data/2016/dataSources/EquipSlotItemClasses.json"), Z1_POIs = require("../../../data/2016/zoneData/Z1_POIs"), weaponDefinitions = require("../../../data/2016/dataSources/ServerWeaponDefinitions"), equipmentModelTexturesMapping = require("../../../data/2016/sampleData/equipmentModelTexturesMapping.json");
let ZoneServer2016 = class ZoneServer2016 extends events_1.EventEmitter {
    constructor(serverPort, gatewayKey, mongoAddress = "", worldId, internalServerPort) {
        super();
        this._soloMode = false;
        this._useFairPlay = true;
        this._serverName = process.env.SERVER_NAME || "";
        this._clientProtocol = "ClientProtocol_1080";
        this._dynamicWeatherEnabled = true;
        this._defaultWeatherTemplate = "z1br";
        this._spawnLocations = spawnLocations;
        this._appDataFolder = (0, utils_1.getAppDataFolderPath)();
        this._worldId = 0;
        this._grid = [];
        this._clients = {};
        this._characters = {};
        this._npcs = {};
        this._spawnedItems = {};
        this._plants = {};
        this._doors = {};
        this._explosives = {};
        this._traps = {};
        this._temporaryObjects = {};
        this._vehicles = {};
        this._lootbags = {};
        this._lootableConstruction = {};
        this._constructionFoundations = {};
        this._constructionDoors = {};
        this._constructionSimple = {};
        this._lootableProps = {};
        this._worldLootableConstruction = {};
        this._worldSimpleConstruction = {};
        this._speedTrees = {};
        this._speedTreesCounter = {};
        this._serverTime = this.getCurrentTime();
        this._startTime = 0;
        this._startGameTime = 0;
        this._timeMultiplier = 72;
        this._cycleSpeed = 100;
        this._frozeCycle = false;
        this.tickRate = 2000;
        this.worldRoutineRate = 30000;
        this._transientIds = {};
        this._characterIds = {};
        this._loginServerInfo = {
            address: process.env.LOGINSERVER_IP,
            port: 1110,
        };
        this._charactersRenderDistance = 350;
        this._allowedCommands = process.env.ALLOWED_COMMANDS
            ? JSON.parse(process.env.ALLOWED_COMMANDS)
            : [];
        this._interactionDistance = 3;
        this._pingTimeoutTime = 30000;
        this._ready = false;
        this._itemDefinitions = itemDefinitions;
        this._weaponDefinitions = weaponDefinitions.WEAPON_DEFINITIONS;
        this._firegroupDefinitions = weaponDefinitions.FIRE_GROUP_DEFINITIONS;
        this._firemodeDefinitions = weaponDefinitions.FIRE_MODE_DEFINITIONS;
        this._containerDefinitions = containerDefinitions;
        this._recipes = Recipes_1.recipes;
        this.lastItemGuid = 0x3000000000000000n;
        this._transientIdGenerator = (0, utils_1.generateTransientId)();
        this._packetsStats = {};
        this.worldSaveVersion = 2;
        this.gameVersion = enums_2.GAME_VERSIONS.H1Z1_6dec_2016;
        this._proximityItemsDistance = 2;
        this.pUtilizeHudTimer = (0, util_1.promisify)(this.utilizeHudTimer);
        this.pSetImmediate = (0, util_1.promisify)(setImmediate);
        this.pSetTimeout = (0, util_1.promisify)(setTimeout);
        this._gatewayServer = new gatewayserver_1.GatewayServer(serverPort, gatewayKey);
        this._packetHandlers = new zonepackethandlers_1.zonePacketHandlers();
        this._mongoAddress = mongoAddress;
        this._worldId = worldId || 0;
        this._protocol = new h1z1protocol_1.H1Z1Protocol("ClientProtocol_1080");
        this._weatherTemplates = localWeatherTemplates;
        this.weather = this._weatherTemplates[this._defaultWeatherTemplate];
        this.worldObjectManager = new worldobjectmanager_1.WorldObjectManager();
        this.weatherManager = new weathermanager_1.WeatherManager();
        this.worldDataManager = new worlddatamanager_1.WorldDataManager();
        this.hookManager = new hookmanager_1.HookManager();
        this.enableWorldSaves =
            process.env.ENABLE_SAVES?.toLowerCase() == "false" ? false : true;
        if (!this._mongoAddress) {
            this._soloMode = true;
            this._useFairPlay = false;
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
        this._gatewayServer.on("login", async (client, characterId, loginSessionId, clientProtocol) => {
            if (clientProtocol !== this._clientProtocol) {
                debug(`${client.address} is using the wrong client protocol`);
                this.sendData(client, "LoginFailed", {});
                return;
            }
            debug(`Client logged in from ${client.address}:${client.port} with character id: ${characterId}`);
            const generatedTransient = this.getTransientId(characterId);
            const zoneClient = this.createClient(client.sessionId, client.soeClientId, loginSessionId, characterId, generatedTransient);
            if (!this._soloMode) {
                if (await this.isClientBanned(zoneClient)) {
                    return;
                }
                zoneClient.isAdmin =
                    (await this._db?.collection(enums_2.DB_COLLECTIONS.ADMINS).findOne({
                        sessionId: zoneClient.loginSessionId,
                        serverId: this._worldId,
                    })) != undefined;
            }
            else {
                zoneClient.isAdmin = true;
            }
            if (this._characters[characterId]) {
                this.sendData(client, "LoginFailed", {});
                return;
            }
            this._clients[client.sessionId] = zoneClient;
            this._characters[characterId] = zoneClient.character;
            zoneClient.pingTimer = setTimeout(() => {
                this.timeoutClient(zoneClient);
            }, this._pingTimeoutTime);
            this.emit("login", zoneClient);
        });
        this._gatewayServer.on("disconnect", (client) => {
            this.deleteClient(this._clients[client.sessionId]);
        });
        this._gatewayServer.on("tunneldata", (client, data, flags) => {
            const packet = this._protocol.parse(data, flags);
            if (packet) {
                this.emit("data", this._clients[client.sessionId], packet);
            }
            else {
                debug("zonefailed : ", data);
            }
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
                process.exitCode = 11;
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
                        case "ClientIsAdminRequest": {
                            this.onClientIsAdminRequest(client, packet);
                            break;
                        }
                        case "CharacterExistRequest": {
                            const { characterId, reqId } = packet.data;
                            try {
                                const collection = this._db.collection(enums_2.DB_COLLECTIONS.CHARACTERS);
                                const charactersArray = await collection
                                    .find({
                                    characterId: characterId,
                                    serverId: this._worldId,
                                    status: 1,
                                })
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
                                const collection = this._db.collection(enums_2.DB_COLLECTIONS.CHARACTERS);
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
    onZoneDataEvent(client, packet) {
        if (!client) {
            return;
        }
        client.pingTimer?.refresh();
        if (packet.name != "KeepAlive" &&
            packet.name != "PlayerUpdateUpdatePositionClientToZone" &&
            packet.name != "PlayerUpdateManagedPosition" &&
            packet.name != "ClientUpdate.MonitorTimeDrift") {
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
    async onCharacterCreateRequest(client, packet) {
        const { characterObjStringify, reqId } = packet.data;
        try {
            const characterData = JSON.parse(characterObjStringify), characterModelData = (0, functions_1.getCharacterModelData)(characterData.payload);
            let character = require("../../../data/2016/sampleData/character.json");
            character = {
                ...character,
                serverId: characterData.serverId,
                creationDate: (0, utils_1.toHex)(Date.now()),
                lastLoginDate: (0, utils_1.toHex)(Date.now()),
                characterId: characterData.characterId,
                ownerId: characterData.ownerId,
                characterName: characterData.payload.characterName,
                actorModelId: characterModelData.modelId,
                headActor: characterModelData.headActor,
                hairModel: characterModelData.hairModel,
                gender: characterData.payload.gender,
                status: 1,
                worldSaveVersion: this.worldSaveVersion,
            };
            const collection = this._db.collection(enums_2.DB_COLLECTIONS.CHARACTERS);
            const charactersArray = await collection.findOne({
                characterId: character.characterId,
            });
            if (!charactersArray) {
                await collection.insertOne(character);
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
    async onClientIsAdminRequest(client, packet) {
        const { guid, reqId } = packet.data;
        try {
            const isAdmin = Boolean(await this._db
                ?.collection(enums_2.DB_COLLECTIONS.ADMINS)
                .findOne({ sessionId: guid, serverId: this._worldId }));
            this._h1emuZoneServer.sendData(client, "ClientIsAdminReply", {
                reqId: reqId,
                status: isAdmin,
            });
        }
        catch (error) {
            this._h1emuZoneServer.sendData(client, "ClientIsAdminReply", {
                reqId: reqId,
                status: 0,
            });
        }
    }
    getProximityItems(character) {
        const items = Object.values(this._spawnedItems);
        const proximityItems = { items: [] };
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            if ((0, utils_1.isPosInRadiusWithY)(this._proximityItemsDistance, character.state.position, item.state.position, 1)) {
                const proximityItem = {
                    itemDefinitionId: item.item.itemDefinitionId,
                    associatedCharacterGuid: character.characterId,
                    itemData: item.item, // should change to it use getItemData method later
                };
                proximityItems.items.push(proximityItem);
            }
        }
        for (const a in this._lootableConstruction) {
            const construction = this._lootableConstruction[a];
            if ((0, utils_1.isPosInRadiusWithY)(2, character.state.position, construction.state.position, 1)) {
                if (construction && construction.parentObjectCharacterId) {
                    const parent = construction.getParent(this);
                    if (parent &&
                        parent.isSecured &&
                        character.isHidden != parent.characterId) {
                        continue;
                    }
                }
                const container = construction.getContainer();
                if (container) {
                    Object.values(container.items).forEach((item) => {
                        const proximityItem = {
                            itemDefinitionId: item.itemDefinitionId,
                            associatedCharacterGuid: character.characterId,
                            itemData: construction.pGetItemData(this, item, container.containerDefinitionId),
                        };
                        proximityItems.items.push(proximityItem);
                    });
                }
            }
        }
        for (const a in this._worldLootableConstruction) {
            const construction = this._worldLootableConstruction[a];
            if ((0, utils_1.isPosInRadiusWithY)(2, character.state.position, construction.state.position, 1)) {
                const container = construction.getContainer();
                if (container) {
                    Object.values(container.items).forEach((item) => {
                        const proximityItem = {
                            itemDefinitionId: item.itemDefinitionId,
                            associatedCharacterGuid: character.characterId,
                            itemData: construction.pGetItemData(this, item, container.containerDefinitionId),
                        };
                        proximityItems.items.push(proximityItem);
                    });
                }
            }
        }
        return proximityItems;
    }
    pGetRecipes() {
        // todo: change to per-character recipe lists
        const recipeKeys = Object.keys(this._recipes);
        return Object.values(this._recipes).map((recipe, idx) => {
            const def = this.getItemDefinition(Number(recipeKeys[idx]));
            return {
                recipeId: def.ID,
                itemDefinitionId: def.ID,
                nameId: def.NAME_ID,
                iconId: def.IMAGE_SET_ID,
                unknownDword1: 0,
                descriptionId: def.DESCRIPTION_ID,
                unknownDword2: 1,
                bundleCount: recipe.bundleCount || 1,
                membersOnly: false,
                filterId: recipe.filterId,
                components: recipe.components.map((component) => {
                    const def = this.getItemDefinition(component.itemDefinitionId);
                    return {
                        unknownDword1: 0,
                        nameId: def.NAME_ID,
                        iconId: def.IMAGE_SET_ID,
                        unknownDword2: 0,
                        requiredAmount: component.requiredAmount,
                        unknownQword1: "0x0",
                        unknownDword3: 0,
                        itemDefinitionId: def.ID,
                    };
                }),
            };
        });
    }
    async sendCharacterData(client) {
        if (!this.hookManager.checkHook("OnSendCharacterData", client))
            return;
        if (!(await this.hookManager.checkAsyncHook("OnSendCharacterData", client)))
            return;
        await this.worldDataManager.loadCharacterData(this, client);
        // to help identify broken character saves
        Object.values(client.character._loadout).forEach((item) => {
            if (item.stackCount < 1) {
                debug("\n\n\n");
                console.log(`Deprecated character loadout detected ${client.character.name}`);
                console.log(item);
                debug("\n\n\n");
                item.stackCount;
            }
        });
        Object.values(client.character._containers).forEach((container) => {
            if (container.stackCount < 1) {
                debug("\n\n\n");
                console.log(`Deprecated character containers detected ${client.character.name}`);
                console.log(container);
                debug("\n\n\n");
                container.stackCount = 1;
            }
            Object.values(container.items).forEach((item) => {
                if (item.stackCount < 1) {
                    debug("\n\n\n");
                    console.log(`Deprecated character items detected ${client.character.name}`);
                    console.log(item);
                    item.stackCount = 1;
                    debug("\n\n\n");
                }
            });
        });
        this.sendData(client, "SendSelfToClient", {
            data: client.character.pGetSendSelf(this, client.guid, client),
        });
        client.character.initialized = true;
        this.initializeContainerList(client);
        this._characters[client.character.characterId] = client.character; // character will spawn on other player's screen(s) at this point
        this.hookManager.checkHook("OnSentCharacterData", client);
    }
    /**
     * Caches item definitons so they aren't packed every time a client logs in.
     */
    packItemDefinitions() {
        /*
        this.itemDefinitionsCache = this._protocol.pack("Command.ItemDefinitions", {
          data: {
            itemDefinitions: Object.values(this._itemDefinitions).map(
              (itemDef: any) => {
                return {
                  ID: itemDef.ID,
                  definitionData: {
                    ...itemDef,
                    HUD_IMAGE_SET_ID: itemDef.IMAGE_SET_ID,
                    ITEM_TYPE_1: itemDef.ITEM_TYPE,
                    flags1: {
                      ...itemDef,
                    },
                    flags2: {
                      ...itemDef,
                    },
                    stats: [],
                  },
                };
              }
            ),
          },
        });
        */
        // temp custom logic for external container workaround
        const defs = [];
        Object.values(this._itemDefinitions).forEach((itemDef) => {
            if (itemDef.ID > 5000 || itemDef.ID == enums_1.Items.FANNY_PACK_DEV) {
                // custom h1emu definitons start at 5001
                defs.push({
                    ID: itemDef.ID,
                    definitionData: {
                        ...itemDef,
                        HUD_IMAGE_SET_ID: itemDef.IMAGE_SET_ID,
                        ITEM_TYPE_1: itemDef.ITEM_TYPE,
                        flags1: {
                            ...itemDef,
                        },
                        flags2: {
                            ...itemDef,
                        },
                        stats: [],
                    },
                });
            }
        });
        this.itemDefinitionsCache = this._protocol.pack("Command.ItemDefinitions", {
            data: {
                itemDefinitions: defs,
            },
        });
    }
    /**
     * Caches weapon definitons so they aren't packed every time a client logs in.
     */
    packWeaponDefinitions() {
        this.weaponDefinitionsCache = this._protocol.pack("ReferenceData.WeaponDefinitions", {
            data: {
                definitionsData: {
                    WEAPON_DEFINITIONS: Object.values(weaponDefinitions.WEAPON_DEFINITIONS),
                    FIRE_GROUP_DEFINITIONS: Object.values(weaponDefinitions.FIRE_GROUP_DEFINITIONS),
                    FIRE_MODE_DEFINITIONS: Object.values(weaponDefinitions.FIRE_MODE_DEFINITIONS),
                    PLAYER_STATE_GROUP_DEFINITIONS: Object.values(weaponDefinitions.PLAYER_STATE_GROUP_DEFINITIONS),
                    FIRE_MODE_PROJECTILE_MAPPING_DATA: Object.values(weaponDefinitions.FIRE_MODE_PROJECTILE_MAPPING_DATA),
                    AIM_ASSIST_DEFINITIONS: Object.values(weaponDefinitions.AIM_ASSIST_DEFINITIONS),
                },
            },
        });
    }
    /**
     * Caches projectile definitons so they aren't packed every time a client logs in.
     */
    packProjectileDefinitions() {
        this.projectileDefinitionsCache = this._protocol.pack("ReferenceData.ProjectileDefinitions", {
            definitionsData: projectileDefinitons,
        });
    }
    /**
     * Caches profile definitons so they aren't packed every time a client logs in.
     */
    packProfileDefinitions() {
        this.profileDefinitionsCache = this._protocol.pack("ReferenceData.ProfileDefinitions", {
            data: {
                profiles: profileDefinitions,
            },
        });
    }
    async initializeLoginServerConnection() {
        debug("Starting H1emuZoneServer");
        if (!this._loginServerInfo.address) {
            await this.fetchLoginInfo();
        }
        this._h1emuZoneServer.setLoginInfo(this._loginServerInfo, {
            serverId: this._worldId,
            h1emuVersion: process.env.H1Z1_SERVER_VERSION,
        });
        this._h1emuZoneServer.start();
        await this._db
            ?.collection(enums_2.DB_COLLECTIONS.SERVERS)
            .findOneAndUpdate({ serverId: this._worldId }, { $set: { populationNumber: 0, populationLevel: 0 } });
    }
    async setupServer() {
        this.forceTime(971172000000); // force day time by default - not working for now
        this._frozeCycle = false;
        if (!this._soloMode) {
            await this.worldDataManager.initializeDatabase(this);
        }
        const loadedWorld = await this.worldDataManager.getServerData(this);
        if (loadedWorld) {
            if (loadedWorld.worldSaveVersion !== this.worldSaveVersion) {
                console.log(`World save version mismatch, deleting world data. Current: ${this.worldSaveVersion} Old: ${loadedWorld.worldSaveVersion}`);
                await this.worldDataManager.deleteWorld(this);
                await this.worldDataManager.insertWorld(this);
                await this.worldDataManager.saveWorld(this);
            }
        }
        else {
            await this.worldDataManager.insertWorld(this);
            await this.worldDataManager.saveWorld(this);
        }
        await this.worldDataManager.fetchWorldData(this);
        if (!this._soloMode) {
            this.initializeLoginServerConnection();
        }
        // !!ANYTHING THAT USES / GENERATES ITEMS MUST BE CALLED AFTER WORLD DATA IS LOADED!!
        this.packItemDefinitions();
        this.packWeaponDefinitions();
        this.packProjectileDefinitions();
        this.packProfileDefinitions();
        this.worldObjectManager.createDoors(this);
        this.worldObjectManager.createProps(this);
        this._ready = true;
        console.log(`Server saving ${this.enableWorldSaves ? "enabled" : "disabled"}.`);
        debug("Server ready");
    }
    async start() {
        debug("Starting server");
        debug(`Protocol used : ${this._protocol.protocolName}`);
        if (!this.hookManager.checkHook("OnServerInit"))
            return;
        if (!(await this.hookManager.checkAsyncHook("OnServerInit")))
            return;
        await this.setupServer();
        this._startTime += Date.now();
        this._startGameTime += Date.now();
        if (this._dynamicWeatherEnabled) {
            this._dynamicWeatherWorker = setTimeout(() => {
                if (!this._dynamicWeatherEnabled) {
                    return;
                }
                this.weather = this.weatherManager.dynamicWeather(this._serverTime, this._startTime, this._timeMultiplier);
                this.sendDataToAll("UpdateWeatherData", this.weather);
                this._dynamicWeatherWorker.refresh();
            }, 360000 / this._timeMultiplier);
        }
        this._gatewayServer.start();
        this.worldRoutineTimer = setTimeout(() => this.worldRoutine.bind(this)(), this.worldRoutineRate);
        this.hookManager.checkHook("OnServerReady");
    }
    sendInitData(client) {
        this.sendData(client, "InitializationParameters", {
            ENVIRONMENT: "LIVE",
            unknownString1: "",
            rulesetDefinitions: [
            /*
            {
              unknownDword1: 1,
              unknownDword2: 1,
              ruleset: "Permadeath",
              unknownString2: "",
              rulesets: [
                {
                  ID: 1,
                  DATA: {
                    ID: 1,
                    RULESET_ID: 1,
                    CONTENT_PACK_ID: 112,
                    CONTENT_PACK_ACTION_ID: 1,
                  }
                }
              ]
            },
            {
              unknownDword1: 3,
              unknownDword2: 3,
              ruleset: "Headshots",
              unknownString2: "",
              rulesets: []
            },
            {
              unknownDword1: 4,
              unknownDword2: 4,
              ruleset: "FirstPersonOnly",
              unknownString2: "",
              rulesets: []
            },
            {
              unknownDword1: 5,
              unknownDword2: 5,
              ruleset: "PvE", //  could be "Normal"
              unknownString2: "",
              rulesets: [
                {
                  ID: 3,
                  DATA: {
                    ID: 3,
                    RULESET_ID: 5,
                    CONTENT_PACK_ID: 119,
                    CONTENT_PACK_ACTION_ID: 2,
                  }
                },
              ]
            },
            {
              unknownDword1: 6,
              unknownDword2: 6,
              ruleset: "BattleRoyale",
              unknownString2: "",
              rulesets: [
                
              ]
            },*/
            ],
        });
        this.sendData(client, "SendZoneDetails", {
            zoneName: "Z1",
            zoneType: 4,
            unknownBoolean1: false,
            skyData: this.weather,
            zoneId1: 5,
            zoneId2: 5,
            nameId: 7699,
            unknownBoolean2: true,
            lighting: "Lighting.txt",
            unknownBoolean3: false,
        });
        if (!this.itemDefinitionsCache) {
            this.packItemDefinitions();
        }
        // disabled since it breaks weapon inspect
        // re-enabled for just external container workaround custom definitions
        this.sendRawData(client, this.itemDefinitionsCache);
        if (!this.weaponDefinitionsCache) {
            this.packWeaponDefinitions();
        }
        this.sendRawData(client, this.weaponDefinitionsCache);
        // packet is just broken, idk why
        /*
        this.sendData(client, "ClientBeginZoning", {
          //position: Array.from(client.character.state.position),
          //rotation: Array.from(client.character.state.rotation),
          skyData: this.weather,
        });
        */
        this.sendData(client, "ClientGameSettings", {
            Unknown2: 0,
            interactGlowAndDist: 3,
            unknownBoolean1: true,
            timescale: 1.0,
            enableWeapons: 1,
            Unknown5: 1,
            unknownFloat1: 0.0,
            unknownFloat2: 15,
            damageMultiplier: 11,
        });
        this.sendCharacterData(client);
    }
    divideMapIntoGrid(mapWidth, mapHeight, gridCellSize) {
        const grid = [];
        for (let i = -mapWidth / 2; i < mapWidth / 2; i += gridCellSize) {
            for (let j = -mapHeight / 2; j < mapHeight / 2; j += gridCellSize) {
                const cell = new gridcell_1.GridCell(i, j, gridCellSize, gridCellSize);
                grid.push(cell);
            }
        }
        return grid;
    }
    divideLargeCells(threshold) {
        const grid = this._grid;
        for (let i = 0; i < grid.length; i++) {
            const gridCell = grid[i];
            if (gridCell.height < 250)
                continue;
            if (gridCell.objects.length > threshold) {
                const newGridCellWidth = gridCell.width / 2;
                const newGridCellHeight = gridCell.height / 2;
                // 4 cells made of 1
                const newGridCell1 = new gridcell_1.GridCell(gridCell.position[0], gridCell.position[2], newGridCellWidth, newGridCellHeight);
                const newGridCell2 = new gridcell_1.GridCell(gridCell.position[0] + newGridCellWidth, gridCell.position[2], newGridCellWidth, newGridCellHeight);
                const newGridCell3 = new gridcell_1.GridCell(gridCell.position[0], gridCell.position[2] + newGridCellHeight, newGridCellWidth, newGridCellHeight);
                const newGridCell4 = new gridcell_1.GridCell(gridCell.position[0] + newGridCellWidth, gridCell.position[2] + newGridCellHeight, newGridCellWidth, newGridCellHeight);
                // remove old grid cell
                const objects = this._grid[i].objects;
                this._grid.splice(i, 1);
                i--;
                this._grid.push(newGridCell1);
                this._grid.push(newGridCell2);
                this._grid.push(newGridCell3);
                this._grid.push(newGridCell4);
                objects.forEach((object) => {
                    this.pushToGridCell(object);
                });
            }
        }
    }
    pushToGridCell(obj) {
        if (this._grid.length == 0)
            this._grid = this.divideMapIntoGrid(8000, 8000, 250);
        if (obj instanceof vehicle_1.Vehicle2016 ||
            obj instanceof character_1.Character2016 ||
            (obj instanceof constructionchildentity_1.ConstructionChildEntity &&
                !obj.getParent(this) &&
                !(obj instanceof constructionparententity_1.ConstructionParentEntity)) ||
            (obj instanceof lootableconstructionentity_1.LootableConstructionEntity && !obj.getParent(this)))
            return; // dont push objects that can change its position
        for (let i = 0; i < this._grid.length; i++) {
            const gridCell = this._grid[i];
            if (obj.state.position[0] >= gridCell.position[0] &&
                obj.state.position[0] <= gridCell.position[0] + gridCell.width &&
                obj.state.position[2] >= gridCell.position[2] &&
                obj.state.position[2] <= gridCell.position[2] + gridCell.height) {
                if (gridCell.objects.includes(obj)) {
                    return;
                }
                gridCell.objects.push(obj);
            }
        }
    }
    assignChunkRenderDistance(client) {
        let lowerRenderDistance = false;
        const character = client.character;
        for (let i = 0; i < this._grid.length; i++) {
            const gridCell = this._grid[i];
            if (character.state.position[0] >= gridCell.position[0] &&
                character.state.position[0] <= gridCell.position[0] + gridCell.width &&
                character.state.position[2] >= gridCell.position[2] &&
                character.state.position[2] <= gridCell.position[2] + gridCell.height &&
                gridCell.height < 250) {
                lowerRenderDistance = true;
            }
        }
        client.chunkRenderDistance = lowerRenderDistance ? 300 : 400;
    }
    worldRoutine() {
        if (!this.hookManager.checkHook("OnWorldRoutine"))
            return;
        else {
            if (this._ready) {
                this.plantManager();
                this.npcDespawner();
                this.lootbagDespawner();
                this.itemDespawner();
                this.worldObjectManager.run(this);
                this.setTickRate();
                if (this.enableWorldSaves)
                    this.worldDataManager.run(this);
            }
        }
        this.worldRoutineTimer.refresh();
    }
    setTickRate() {
        const count = utils_1._.size(this._characters);
        if (count >= 60 && count < 80)
            this.tickRate = 2500;
        else if (count >= 80)
            this.tickRate = 3000;
        else
            this.tickRate = 2000;
    }
    deleteClient(client) {
        if (client) {
            if (client.character) {
                client.isLoading = true; // stop anything from acting on character
                clearTimeout(client.character?.resourcesUpdater);
                this.worldDataManager.saveCharacterData(this, client);
                this.dismountVehicle(client);
                client.managedObjects?.forEach((characterId) => {
                    this.dropVehicleManager(client, characterId);
                });
                this.deleteEntity(client.character.characterId, this._characters);
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
    generateDamageRecord(targetCharacterId, damageInfo, oldHealth) {
        const targetEntity = this.getEntity(targetCharacterId), sourceEntity = this.getEntity(damageInfo.entity), targetClient = this.getClientByCharId(targetCharacterId), sourceClient = this.getClientByCharId(damageInfo.entity);
        if (!sourceEntity || !targetEntity)
            return {};
        let sourceName = "Generic", sourcePing = 0, targetName = "Generic", targetPing = 0;
        if (sourceClient && !targetClient) {
            sourceName = sourceClient.character.name || "Unknown";
            sourcePing = sourceClient.avgPing;
        }
        else if (!sourceClient && targetClient) {
            targetName = targetClient.character.name || "Unknown";
            targetPing = targetClient.avgPing;
        }
        else if (sourceClient && targetClient) {
            sourceName = sourceClient.character.name || "Unknown";
            sourcePing = sourceClient.avgPing;
            targetName = targetClient.character.name || "Unknown";
            targetPing = targetClient.avgPing;
        }
        return {
            source: {
                name: sourceName,
                ping: sourcePing,
            },
            target: {
                name: targetName,
                ping: targetPing,
            },
            hitInfo: {
                timestamp: Date.now(),
                weapon: damageInfo.weapon,
                distance: (0, utils_1.getDistance)(sourceEntity.state.position, targetEntity.state.position).toFixed(1),
                hitLocation: damageInfo.hitReport?.hitLocation || "Unknown",
                hitPosition: damageInfo.hitReport?.position || new Float32Array([0, 0, 0, 0]),
                oldHP: oldHealth,
                newHP: oldHealth - damageInfo.damage < 0 ? 0 : oldHealth - damageInfo.damage,
            },
        };
    }
    sendDeathMetrics(client) {
        const clientUpdateDeathMetricsPacket = {
            recipesDiscovered: client.character.metrics.recipesDiscovered,
            zombiesKilled: client.character.metrics.zombiesKilled,
            minutesSurvived: (Date.now() - client.character.metrics.startedSurvivingTP) / 60000,
            wildlifeKilled: client.character.metrics.wildlifeKilled,
        };
        this.sendData(client, "ClientUpdate.DeathMetrics", clientUpdateDeathMetricsPacket);
    }
    killCharacter(client, damageInfo) {
        if (!client.character.isAlive)
            return;
        if (!this.hookManager.checkHook("OnPlayerDeath", client, damageInfo))
            return;
        const character = client.character, sourceClient = this.getClientByCharId(damageInfo.entity);
        client.character.isRespawning = true;
        this.sendDeathMetrics(client);
        debug(character.name + " has died");
        if (sourceClient) {
            if (!this._soloMode) {
                (0, utils_1.logClientActionToMongo)(this._db.collection(enums_2.DB_COLLECTIONS.KILLS), sourceClient, this._worldId, { type: "player", playerKilled: client.character.name });
            }
            client.lastDeathReport = {
                position: client.character.state.position,
                attackerPosition: sourceClient.character.state.position,
                distance: Number((0, utils_1.getDistance)(client.character.state.position, sourceClient.character.state.position).toFixed(2)),
                attacker: sourceClient,
            };
        }
        client.character.isRunning = false;
        character.isAlive = false;
        this.updateCharacterState(client, client.character.characterId, client.character.characterStates, false);
        if (!client.isLoading) {
            this.sendDataToAllWithSpawnedEntity(this._characters, client.character.characterId, "Character.StartMultiStateDeath", {
                characterId: client.character.characterId,
            });
        }
        else {
            this.sendDataToAllOthersWithSpawnedEntity(this._characters, client, client.character.characterId, "Character.StartMultiStateDeath", {
                characterId: client.character.characterId,
            });
        }
        this.clearMovementModifiers(client);
        client.character.dismountContainer(this);
        if (client.vehicle.mountedVehicle) {
            const vehicle = this._vehicles[client.vehicle.mountedVehicle], container = vehicle?.getContainer();
            if (vehicle && container) {
                container.items = {
                    ...container.items,
                    ...client.character.getDeathItems(this),
                };
            }
        }
        else {
            this.worldObjectManager.createLootbag(this, character);
        }
        this.hookManager.checkHook("OnPlayerDied", client, damageInfo);
    }
    async explosionDamage(position, npcTriggered, client) {
        // TODO: REDO THIS WITH AN OnExplosiveDamage method per class
        for (const characterId in this._characters) {
            const character = this._characters[characterId];
            if ((0, utils_1.isPosInRadius)(8, character.state.position, position)) {
                const distance = (0, utils_1.getDistance)(position, character.state.position);
                const damage = 50000 / distance;
                character.damage(this, {
                    entity: npcTriggered,
                    damage: damage,
                });
            }
        }
        for (const vehicleKey in this._vehicles) {
            const vehicle = this._vehicles[vehicleKey];
            if (vehicle.characterId != npcTriggered) {
                if ((0, utils_1.isPosInRadius)(5, vehicle.state.position, position)) {
                    const distance = (0, utils_1.getDistance)(position, vehicle.state.position);
                    const damage = 250000 / distance;
                    await utils_1.Scheduler.wait(150);
                    vehicle.damage(this, { entity: npcTriggered, damage: damage });
                }
            }
        }
        for (const construction in this._constructionSimple) {
            const constructionObject = this._constructionSimple[construction];
            if (constructionObject.itemDefinitionId == enums_1.Items.FOUNDATION_RAMP ||
                constructionObject.itemDefinitionId == enums_1.Items.FOUNDATION_STAIRS)
                continue;
            if ((0, utils_1.isPosInRadius)(constructionObject.damageRange, constructionObject.fixedPosition
                ? constructionObject.fixedPosition
                : constructionObject.state.position, position)) {
                if (this.isConstructionInSecuredArea(constructionObject, "simple")) {
                    if (client) {
                        this.sendBaseSecuredMessage(client);
                    }
                }
                else {
                    this.checkConstructionDamage(constructionObject.characterId, 50000, this._constructionSimple, position, constructionObject.fixedPosition
                        ? constructionObject.fixedPosition
                        : constructionObject.state.position);
                }
            }
        }
        for (const construction in this._constructionDoors) {
            const constructionObject = this._constructionDoors[construction];
            if ((0, utils_1.isPosInRadius)(constructionObject.damageRange, constructionObject.fixedPosition
                ? constructionObject.fixedPosition
                : constructionObject.state.position, position)) {
                if (this.isConstructionInSecuredArea(constructionObject, "door")) {
                    if (client) {
                        this.sendBaseSecuredMessage(client);
                    }
                }
                else {
                    this.checkConstructionDamage(constructionObject.characterId, 50000, this._constructionDoors, position, constructionObject.fixedPosition
                        ? constructionObject.fixedPosition
                        : constructionObject.state.position);
                }
            }
        }
        for (const construction in this._constructionFoundations) {
            const constructionObject = this._constructionFoundations[construction];
            if ((0, utils_1.isPosInRadius)(constructionObject.damageRange, constructionObject.state.position, position)) {
                const allowed = [enums_1.Items.SHACK, enums_1.Items.SHACK_SMALL, enums_1.Items.SHACK_BASIC];
                if (allowed.includes(constructionObject.itemDefinitionId)) {
                    this.checkConstructionDamage(constructionObject.characterId, 50000, this._constructionFoundations, position, constructionObject.state.position);
                }
            }
        }
        for (const construction in this._lootableConstruction) {
            const constructionObject = this._lootableConstruction[construction];
            if ((0, utils_1.isPosInRadius)(2, constructionObject.state.position, position)) {
                const parent = constructionObject.getParent(this);
                if (parent && parent.isSecured) {
                    if (client) {
                        this.sendBaseSecuredMessage(client);
                    }
                    continue;
                }
                this.checkConstructionDamage(constructionObject.characterId, 50000, this._lootableConstruction, position, constructionObject.state.position);
            }
        }
        for (const construction in this._worldLootableConstruction) {
            const constructionObject = this._worldLootableConstruction[construction];
            if ((0, utils_1.isPosInRadius)(2, constructionObject.state.position, position)) {
                this.checkConstructionDamage(constructionObject.characterId, 50000, this._worldLootableConstruction, position, constructionObject.state.position);
            }
        }
        for (const explosive in this._explosives) {
            const explosiveObj = this._explosives[explosive];
            if (explosiveObj.characterId != npcTriggered) {
                if ((0, utils_1.getDistance)(position, explosiveObj.state.position) < 2) {
                    await utils_1.Scheduler.wait(200);
                    if (this._spawnedItems[explosiveObj.characterId]) {
                        const object = this._spawnedItems[explosiveObj.characterId];
                        this.deleteEntity(explosiveObj.characterId, this._spawnedItems);
                        delete this.worldObjectManager._spawnedLootObjects[object.spawnerId];
                    }
                    if (!explosiveObj.detonated)
                        explosiveObj.detonate(this);
                }
            }
        }
    }
    isConstructionInSecuredArea(construction, type) {
        switch (type) {
            case "simple":
                for (const a in this._constructionFoundations) {
                    const foundation = this._constructionFoundations[a];
                    // Linked to #1160
                    if (!foundation) {
                        return;
                    }
                    if (this._constructionFoundations[foundation.parentObjectCharacterId]) {
                        if (foundation.isSecured &&
                            foundation.isInside(construction.state.position))
                            return true;
                        else
                            return false;
                    }
                    if (foundation.isSecured &&
                        foundation.isInside(construction.state.position))
                        return true;
                }
            case "door":
                if (construction.itemDefinitionId == enums_1.Items.METAL_GATE)
                    return false;
                for (const a in this._constructionFoundations) {
                    const foundation = this._constructionFoundations[a];
                    if (this._constructionFoundations[foundation.parentObjectCharacterId]) {
                        if (foundation.isSecured &&
                            foundation.isInside(construction.state.position))
                            return true;
                        else
                            return false;
                    }
                    if (foundation.isSecured &&
                        foundation.isInside(construction.state.position))
                        return true;
                }
        }
        return false;
    }
    sendBaseSecuredMessage(client) {
        this.sendAlert(client, "You must destroy the base's gate before affecting interior structures.");
    }
    checkConstructionDamage(constructionCharId, damage, dictionary, position, entityPosition) {
        const constructionObject = dictionary[constructionCharId];
        const distance = (0, utils_1.getDistance)(entityPosition, position);
        constructionObject.damage(this, {
            entity: "",
            damage: distance < 4 ? damage : damage / Math.sqrt(distance),
        });
        this.updateResourceToAllWithSpawnedEntity(constructionObject.characterId, constructionObject.health, enums_1.ResourceIds.CONSTRUCTION_CONDITION, enums_1.ResourceTypes.CONDITION, dictionary);
        this.sendDataToAllWithSpawnedEntity(
        // play burning effect & remove it after 15s
        dictionary, constructionCharId, "Command.PlayDialogEffect", {
            characterId: constructionCharId,
            effectId: 1214,
        });
        setTimeout(() => {
            this.sendDataToAllWithSpawnedEntity(dictionary, constructionCharId, "Command.PlayDialogEffect", {
                characterId: constructionCharId,
                effectId: 0,
            });
        }, 15000);
        if (constructionObject.health > 0)
            return;
        constructionObject.destroy(this, 3000);
    }
    createProjectileNpc(client, data) {
        const iD = client.character.getEquippedWeapon().itemDefinitionId;
        if (iD == enums_1.Items.WEAPON_BOW_MAKESHIFT ||
            iD == enums_1.Items.WEAPON_BOW_RECURVE ||
            iD == enums_1.Items.WEAPON_CROSSBOW ||
            iD == enums_1.Items.WEAPON_BOW_WOOD) {
            this.worldObjectManager.createLootEntity(this, this.generateItem(enums_1.Items.AMMO_ARROW), data.position, data.rotation);
        }
    }
    async respawnPlayer(client) {
        if (!this.hookManager.checkHook("OnPlayerRespawn", client))
            return;
        if (!(await this.hookManager.checkAsyncHook("OnPlayerRespawn", client)))
            return;
        if (client.vehicle.mountedVehicle) {
            this.dismountVehicle(client);
        }
        client.isLoading = true;
        client.character.resetMetrics();
        client.character.isAlive = true;
        client.character.isRunning = false;
        client.character.isRespawning = false;
        client.character._resources[enums_1.ResourceIds.HEALTH] = 10000;
        client.character._resources[enums_1.ResourceIds.HUNGER] = 10000;
        client.character._resources[enums_1.ResourceIds.HYDRATION] = 10000;
        client.character._resources[enums_1.ResourceIds.STAMINA] = 600;
        client.character._resources[enums_1.ResourceIds.BLEEDING] = -40;
        client.character.healingTicks = 0;
        client.character.healingMaxTicks = 0;
        client.character.resourcesUpdater?.refresh();
        this.updateCharacterState(client, client.character.characterId, client.character.characterStates, true);
        const randomSpawnIndex = Math.floor(Math.random() * this._spawnLocations.length);
        if (client.character.initialized) {
            client.managedObjects?.forEach((characterId) => {
                this.dropVehicleManager(client, characterId);
            });
            this.sendData(client, "Character.RespawnReply", {
                characterId: client.character.characterId,
                status: 1,
            });
            this.sendData(client, "ClientUpdate.UpdateLocation", {
                position: this._spawnLocations[randomSpawnIndex].position,
            });
        }
        this.clearInventory(client);
        client.character.equipLoadout(this);
        client.character.state.position =
            this._spawnLocations[randomSpawnIndex].position;
        this.updateResource(client, client.character.characterId, client.character._resources[enums_1.ResourceIds.HEALTH], enums_1.ResourceIds.HEALTH);
        this.updateResource(client, client.character.characterId, client.character._resources[enums_1.ResourceIds.STAMINA], enums_1.ResourceIds.STAMINA);
        this.updateResource(client, client.character.characterId, client.character._resources[enums_1.ResourceIds.HUNGER], enums_1.ResourceIds.HUNGER);
        this.updateResource(client, client.character.characterId, client.character._resources[enums_1.ResourceIds.HYDRATION], enums_1.ResourceIds.HYDRATION);
        this.updateResource(client, client.character.characterId, client.character._resources[enums_1.ResourceIds.BLEEDING], enums_1.ResourceIds.BLEEDING);
        // fixes characters showing up as dead if they respawn close to other characters
        if (client.character.initialized) {
            this.sendDataToAllOthersWithSpawnedEntity(this._characters, client, client.character.characterId, "Character.RemovePlayer", {
                characterId: client.character.characterId,
            });
            const vehicleId = client.vehicle.mountedVehicle, vehicle = vehicleId ? this._vehicles[vehicleId] : false;
            setTimeout(() => {
                if (!client?.character)
                    return;
                this.sendDataToAllOthersWithSpawnedEntity(this._characters, client, client.character.characterId, "AddLightweightPc", {
                    ...client.character.pGetLightweight(),
                    identity: {
                        characterName: client.character.name,
                    },
                    mountGuid: vehicleId || "",
                    mountSeatId: vehicle
                        ? vehicle.getCharacterSeat(client.character.characterId)
                        : 0,
                    mountRelatedDword1: vehicle ? 1 : 0,
                });
            }, 2000);
        }
        this.hookManager.checkHook("OnPlayerRespawned", client);
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
        let allowDes = false;
        let count = 1;
        if (elo) {
            debug("\x1b[32m", client.character.name + "\x1b[0m", "tried to use destroyed speedTree id:" + "\x1b[32m", packet.data.id);
        }
        else {
            let itemDefId = 0;
            switch (packet.data.name) {
                case "SpeedTree.Blackberry":
                    itemDefId = enums_1.Items.BLACKBERRY;
                    if ((0, utils_1.randomIntFromInterval)(1, 10) == 1) {
                        client.character.lootItem(this, this.generateItem(enums_1.Items.WEAPON_BRANCH));
                    }
                    allowDes = true;
                    count = (0, utils_1.randomIntFromInterval)(1, 2);
                    break;
                case "SpeedTree.DevilClub":
                case "SpeedTree.VineMaple":
                    itemDefId = enums_1.Items.WOOD_STICK;
                    allowDes = true;
                    count = (0, utils_1.randomIntFromInterval)(1, 2);
                    break;
                case "SpeedTree.RedMaple":
                case "SpeedTree.WesternRedCedar":
                case "SpeedTree.GreenMaple":
                case "SpeedTree.GreenMapleDead":
                case "SpeedTree.WesternCedarSapling":
                case "SpeedTree.SaplingMaple":
                case "SpeedTree.WhiteBirch":
                case "SpeedTree.RedCedar":
                case "SpeedTree.PaperBirch":
                case "SpeedTree.OregonOak":
                    if (!this._speedTreesCounter[packet.data.id]) {
                        this._speedTreesCounter[packet.data.id] = {
                            hitPoints: (0, utils_1.randomIntFromInterval)(12, 19),
                        }; // add a new tree key with random level of hitpoints
                    }
                    else {
                        if (this._speedTreesCounter[packet.data.id].hitPoints-- == 0) {
                            allowDes = true;
                            delete this._speedTreesCounter[packet.data.id]; // If out of health destroy tree and delete its key
                            itemDefId = enums_1.Items.WOOD_LOG;
                            count = (0, utils_1.randomIntFromInterval)(2, 6);
                        }
                    }
                    break;
                default: // boulders (do nothing);
                    return;
            }
            if (itemDefId) {
                client.character.lootContainerItem(this, this.generateItem(itemDefId, count));
            }
            if (allowDes) {
                this.speedTreeDestroy(packet);
            }
        }
    }
    speedFairPlayCheck(client, sequenceTime, position) {
        if (client.isAdmin || !this._useFairPlay)
            return;
        const speed = ((0, utils_1.getDistance)(client.oldPos.position, position) /
            1000 /
            (sequenceTime - client.oldPos.time)) *
            3600000;
        const verticalSpeed = ((0, utils_1.getDistance)(new Float32Array([0, client.oldPos.position[1], 0]), new Float32Array([0, position[1], 0])) /
            1000 /
            (sequenceTime - client.oldPos.time)) *
            3600000;
        if (speed > 28 && (verticalSpeed < 40 || verticalSpeed == Infinity)) {
            client.speedWarnsNumber += 1;
        }
        else if (client.speedWarnsNumber != 0) {
            client.speedWarnsNumber -= 1;
        }
        if (client.speedWarnsNumber > 50) {
            this.kickPlayer(client);
            client.speedWarnsNumber = 0;
            if (!this._soloMode) {
                (0, utils_1.logClientActionToMongo)(this._db?.collection(enums_2.DB_COLLECTIONS.FAIRPLAY), client, this._worldId, { type: "SpeedHack" });
            }
            this.sendAlertToAll(`FairPlay: kicking ${client.character.name}`);
        }
        client.oldPos = { position: position, time: sequenceTime };
    }
    hitMissFairPlayCheck(client, hit, hitLocation) {
        if (!this._useFairPlay ||
            client.character.getEquippedWeapon().itemDefinitionId ==
                enums_1.Items.WEAPON_SHOTGUN)
            return;
        if (hit) {
            client.pvpStats.shotsHit += 1;
            switch (hitLocation.toLowerCase()) {
                case "head":
                case "glasses":
                case "neck":
                    client.pvpStats.head += 1;
                    break;
                case "spineupper":
                case "spinelower":
                case "spinemiddle":
                    client.pvpStats.spine += 1;
                    break;
                case "l_hip":
                case "r_hip":
                case "l_knee":
                case "r_knee":
                case "l_ankle":
                case "r_ankle":
                    client.pvpStats.legs += 1;
                    break;
                case "l_elbow":
                case "r_elbow":
                case "r_shoulder":
                case "l_shoulder":
                case "r_wrist":
                case "l_wrist":
                    client.pvpStats.hands += 1;
                    break;
                default:
                    break;
            }
            const hitRatio = (100 * client.pvpStats.shotsHit) / client.pvpStats.shotsFired;
            if (client.pvpStats.shotsFired > 10 && hitRatio > 80) {
                if (!this._soloMode) {
                    (0, utils_1.logClientActionToMongo)(this._db?.collection(enums_2.DB_COLLECTIONS.FAIRPLAY), client, this._worldId, {
                        type: "exceeds hit/miss ratio",
                        hitRatio,
                        totalShotsFired: client.pvpStats.shotsFired,
                    });
                }
                this.sendChatTextToAdmins(`FairPlay: ${client.character.name} exceeds hit/miss ratio (${hitRatio.toFixed(4)}% of ${client.pvpStats.shotsFired} shots fired)`, false);
            }
        }
        else {
            client.pvpStats.shotsFired += 1;
        }
    }
    updateResource(client, entityId, value, resourceId, resourceType // most resources have the same id and type
    ) {
        this.sendData(client, "ResourceEvent", {
            eventData: {
                type: 3,
                value: {
                    characterId: entityId,
                    resourceId: resourceId,
                    resourceType: resourceType ? resourceType : resourceId,
                    initialValue: value >= 0 ? value : 0,
                },
            },
        });
    }
    updateResourceToAllWithSpawnedEntity(entityId, value, resourceId, resourceType, dictionary) {
        this.sendDataToAllWithSpawnedEntity(dictionary, entityId, "ResourceEvent", {
            eventData: {
                type: 3,
                value: {
                    characterId: entityId,
                    resourceId: resourceId,
                    resourceType: resourceType,
                    initialValue: value >= 0 ? value : 0,
                },
            },
        });
    }
    getEntityType(entityKey) {
        switch (true) {
            case !!this._npcs[entityKey]:
                return enums_1.EntityTypes.NPC;
            case !!this._vehicles[entityKey]:
                return enums_1.EntityTypes.VEHICLE;
            case !!this._characters[entityKey]:
                return enums_1.EntityTypes.PLAYER;
            case !!this._spawnedItems[entityKey]:
                return enums_1.EntityTypes.OBJECT;
            case !!this._doors[entityKey]:
                return enums_1.EntityTypes.DOOR;
            case !!this._explosives[entityKey]:
                return enums_1.EntityTypes.EXPLOSIVE;
            case !!this._constructionFoundations[entityKey]:
                return enums_1.EntityTypes.CONSTRUCTION_FOUNDATION;
            case !!this._constructionDoors[entityKey]:
                return enums_1.EntityTypes.CONSTRUCTION_DOOR;
            case !!this._constructionSimple[entityKey]:
                return enums_1.EntityTypes.CONSTRUCTION_SIMPLE;
            case !!this._lootableConstruction[entityKey]:
                return enums_1.EntityTypes.LOOTABLE_CONSTRUCTION;
            case !!this._lootableProps[entityKey]:
                return enums_1.EntityTypes.LOOTABLE_PROP;
            case !!this._worldLootableConstruction[entityKey]:
                return enums_1.EntityTypes.WORLD_LOOTABLE_CONSTRUCTION;
            case !!this._worldSimpleConstruction[entityKey]:
                return enums_1.EntityTypes.WORLD_CONSTRUCTION_SIMPLE;
            case !!this._plants[entityKey]:
                return enums_1.EntityTypes.PLANT;
            default:
                return enums_1.EntityTypes.INVALID;
        }
    }
    getLootableEntity(entityKey) {
        return (this._lootbags[entityKey] ||
            this._vehicles[entityKey] ||
            this._lootableConstruction[entityKey] ||
            this._worldLootableConstruction[entityKey] ||
            this._lootableProps[entityKey] ||
            undefined);
    }
    getConstructionEntity(entityKey) {
        return (this._constructionFoundations[entityKey] ||
            this._constructionSimple[entityKey] ||
            this._lootableConstruction[entityKey] ||
            this._constructionDoors[entityKey] ||
            this._worldLootableConstruction[entityKey] ||
            undefined);
    }
    getConstructionDictionary(entityKey) {
        switch (true) {
            case !!this._constructionFoundations[entityKey]:
                return this._constructionFoundations;
            case !!this._constructionSimple[entityKey]:
                return this._constructionSimple;
            case !!this._lootableConstruction[entityKey]:
                return this._lootableConstruction;
            case !!this._constructionDoors[entityKey]:
                return this._constructionDoors;
            case !!this._worldLootableConstruction[entityKey]:
                return this._worldLootableConstruction;
            default:
                return;
        }
    }
    getEntity(entityKey) {
        return (this._npcs[entityKey] ||
            this._vehicles[entityKey] ||
            this._characters[entityKey] ||
            this._spawnedItems[entityKey] ||
            this._doors[entityKey] ||
            this._explosives[entityKey] ||
            this._constructionFoundations[entityKey] ||
            this._constructionDoors[entityKey] ||
            this._constructionSimple[entityKey] ||
            this._lootbags[entityKey] ||
            this._lootableConstruction[entityKey] ||
            this._lootableProps[entityKey] ||
            this._worldLootableConstruction[entityKey] ||
            this._worldSimpleConstruction[entityKey] ||
            this._plants[entityKey] ||
            undefined);
    }
    damageItem(client, item, damage) {
        item.currentDurability -= damage;
        if (item.currentDurability <= 0) {
            this.removeInventoryItem(client, item);
            if (this.isWeapon(item.itemDefinitionId)) {
                client.character.lootContainerItem(this, this.generateItem(enums_1.Items.BROKEN_METAL_ITEM));
            }
            return;
        }
        this.updateLoadoutItem(client, item);
    }
    getClientByCharId(characterId) {
        for (const a in this._clients) {
            const c = this._clients[a];
            if (c.character.characterId === characterId) {
                return c;
            }
        }
    }
    getClientByNameOrLoginSession(name) {
        let similar = "";
        const targetClient = Object.values(this._clients).find((c) => {
            const clientName = c.character.name?.toLowerCase().replaceAll(" ", "_");
            if (!clientName)
                return;
            if (clientName == name.toLowerCase() || c.loginSessionId == name) {
                return c;
            }
            else if ((0, utils_1.getDifference)(name.toLowerCase(), clientName) <= 3 &&
                (0, utils_1.getDifference)(name.toLowerCase(), clientName) != 0)
                similar = clientName;
        });
        return targetClient ? targetClient : similar ? similar : undefined;
    }
    checkHelmet(characterId, damage, helmetDamageDivder = 1) {
        // TODO: REDO THIS
        const c = this.getClientByCharId(characterId);
        if (!c || !c.character.hasHelmet(this)) {
            return damage;
        }
        damage *= 0.75;
        this.damageItem(c, c.character._loadout[enums_1.LoadoutSlots.HEAD], damage / helmetDamageDivder);
        return damage;
    }
    checkArmor(characterId, damage, kevlarDamageDivider = 4) {
        // TODO: REDO THIS
        const c = this.getClientByCharId(characterId), slot = c?.character._loadout[enums_1.LoadoutSlots.ARMOR], itemDef = this.getItemDefinition(slot?.itemDefinitionId);
        if (!c || !slot || !slot.itemDefinitionId || !itemDef) {
            return damage;
        }
        if (itemDef.DESCRIPTION_ID == 12073) {
            damage *= 0.5; // was 0.8
            this.damageItem(c, c.character._loadout[enums_1.LoadoutSlots.ARMOR], damage / kevlarDamageDivider);
        }
        else if (itemDef.DESCRIPTION_ID == 11151) {
            damage *= 0.7; // was 0.9
            this.damageItem(c, c.character._loadout[enums_1.LoadoutSlots.ARMOR], damage / kevlarDamageDivider);
        }
        return damage;
    }
    sendHitmarker(client, hitLocation = "", hasHelmet, hasArmor, hasHelmetBefore, hasArmorBefore) {
        let isHeadshot = false;
        switch (hitLocation) {
            case "HEAD":
            case "GLASSES":
            case "NECK":
                isHeadshot = true;
                break;
        }
        this.sendData(client, "Ui.ConfirmHit", {
            hitType: {
                isAlly: 0,
                isHeadshot: isHeadshot,
                damagedArmor: (isHeadshot && hasHelmetBefore && hasHelmet) ||
                    (!isHeadshot && hasArmorBefore && hasArmor)
                    ? 1
                    : 0,
                crackedArmor: isHeadshot && hasHelmetBefore && !hasHelmet
                    ? 1
                    : 0 || (!isHeadshot && hasArmorBefore && !hasArmor)
                        ? 1
                        : 0,
            },
        });
    }
    getWeaponHitEffect(itemDefinitionId) {
        switch (itemDefinitionId) {
            case enums_1.Items.WEAPON_SHOTGUN:
                return 1302;
            case enums_1.Items.WEAPON_308:
                return 5414;
            default:
                return 1165;
        }
    }
    getProjectileDamage(itemDefinitionId, sourcePos, targetPos) {
        switch (itemDefinitionId) {
            case enums_1.Items.WEAPON_AR15:
            case enums_1.Items.WEAPON_1911:
                return 2500;
            case enums_1.Items.WEAPON_M9:
                return 1800;
            case enums_1.Items.WEAPON_R380:
                return 1500;
            case enums_1.Items.WEAPON_SHOTGUN:
                return (0, utils_1.calculateDamageDistFallOff)((0, utils_1.getDistance)(sourcePos, targetPos), 1200, // 1 pellet (was 1667)
                0.5);
            case enums_1.Items.WEAPON_AK47:
                return 2900;
            case enums_1.Items.WEAPON_308:
                return 8000;
            case enums_1.Items.WEAPON_MAGNUM:
                return 3000;
            case enums_1.Items.WEAPON_BOW_MAKESHIFT:
                return 2500;
            case enums_1.Items.WEAPON_BOW_RECURVE:
                return 2500;
            case enums_1.Items.WEAPON_BOW_WOOD:
                return 2500;
            case enums_1.Items.WEAPON_CROSSBOW:
                return 2500;
            default:
                return 1000;
        }
    }
    registerHit(client, packet) {
        if (!client.character.isAlive)
            return;
        const entity = this.getEntity(packet.hitReport.characterId);
        if (!entity)
            return;
        entity.OnProjectileHit(this, {
            entity: client.character.characterId,
            // this could cause issues if a player switches their weapon before a projectile hits or a client desyncs
            weapon: client.character.getEquippedWeapon().itemDefinitionId,
            damage: this.getProjectileDamage(client.character.getEquippedWeapon().itemDefinitionId, client.character.state.position, entity.state.position),
            hitReport: packet.hitReport,
        });
    }
    setGodMode(client, godMode) {
        client.character.godMode = godMode;
        client.character.characterStates.invincibility = godMode;
        this.updateCharacterState(client, client.character.characterId, client.character.characterStates, false);
    }
    /*toggleHiddenMode(client: Client) {
      client.character.isHidden = !client.character.isHidden;
      client.character.characterStates.gmHidden = client.character.isHidden;
      this.updateCharacterState(
        client,
        client.character.characterId,
        client.character.characterStates,
        false
      );
    }*/
    tempGodMode(client, durationMs) {
        if (!client.character.godMode) {
            this.setGodMode(client, true);
            client.character.tempGodMode = true;
            setTimeout(() => {
                this.setGodMode(client, false);
                client.character.tempGodMode = false;
            }, durationMs);
        }
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
            this.sendData(client, "Character.UpdateCharacterState", updateCharacterStateBody);
        }
        else {
            this.sendDataToAllOthersWithSpawnedEntity(this._characters, client, client.character.characterId, "Character.UpdateCharacterState", updateCharacterStateBody);
        }
    }
    customizeDTO(client) {
        const DTOArray = [];
        for (const object in this._lootableProps) {
            const prop = this._lootableProps[object];
            const propInstance = {
                objectId: prop.spawnerId,
                unknownString1: "Weapon_Empty.adr",
            };
            DTOArray.push(propInstance);
        }
        for (const object in this._speedTrees) {
            const DTO = this._speedTrees[object];
            const DTOinstance = {
                objectId: DTO.objectId,
                unknownString1: DTO.modelName.concat(".Stump"),
            };
            DTOArray.push(DTOinstance);
        }
        deprecatedDoors.forEach((door) => {
            const DTOinstance = {
                objectId: door,
                unknownString1: "Weapon_Empty.adr",
            };
            DTOArray.push(DTOinstance);
        });
        this.sendData(client, "DtoObjectInitialData", {
            unknownDword1: 1,
            unknownArray1: DTOArray,
            unknownArray2: [{}],
        });
    }
    sendWeatherUpdatePacket(client, weather, broadcast = false) {
        if (!this._soloMode) {
            this.sendDataToAll("UpdateWeatherData", weather);
            if (broadcast && client?.character?.name) {
                this.sendGlobalChatText(`User "${client.character.name}" has changed weather.`);
            }
        }
        else {
            this.sendData(client, "UpdateWeatherData", weather);
        }
    }
    forceTime(time) {
        this._cycleSpeed = 0.1;
        this._frozeCycle = true;
        this._gameTime = time;
    }
    removeForcedTime() {
        this._cycleSpeed = 100;
        this._frozeCycle = false;
        this._gameTime = Date.now();
    }
    constructionShouldHideEntity(client, entity) {
        if (!(entity instanceof lootableconstructionentity_1.LootableConstructionEntity)) {
            return false;
        }
        const parent = entity.getParent(this);
        if (!parent)
            return false;
        const parentSecured = parent.isSecured, hasVisitPermission = parent.getHasPermission(this, client.character.characterId, enums_1.ConstructionPermissionIds.VISIT), isInside = parent.isInside(entity.state.position);
        return parentSecured && isInside && !hasVisitPermission;
        // TODO: check if character is in secured shelter / shack
    }
    shouldRemoveEntity(client, entity) {
        return (entity && // in case if entity is undefined somehow
            !(entity instanceof vehicle_1.Vehicle2016) &&
            (this.filterOutOfDistance(entity, client.character.state.position) ||
                this.constructionShouldHideEntity(client, entity)));
    }
    removeOutOfDistanceEntities(client) {
        // does not include vehicles
        const objectsToRemove = client.spawnedEntities.filter((e) => this.shouldRemoveEntity(client, e));
        client.spawnedEntities = client.spawnedEntities.filter((el) => {
            return !objectsToRemove.includes(el);
        });
        objectsToRemove.forEach((object) => {
            this.sendData(client, "Character.RemovePlayer", {
                characterId: object.characterId,
            });
        });
    }
    despawnEntity(characterId) {
        this.sendDataToAll("Character.RemovePlayer", {
            characterId: characterId,
        });
    }
    deleteEntity(characterId, dictionary, effectId, timeToDisappear) {
        this.sendDataToAllWithSpawnedEntity(dictionary, characterId, "Character.RemovePlayer", {
            characterId: characterId,
            unknownWord1: effectId ? 1 : 0,
            effectId: effectId ? effectId : 0,
            timeToDisappear: timeToDisappear ? timeToDisappear : 0,
            effectDelay: timeToDisappear ? timeToDisappear : 0,
        });
        this._grid.forEach((cell) => {
            if (cell.objects.includes(dictionary[characterId])) {
                cell.objects.splice(cell.objects.indexOf(dictionary[characterId]), 1);
            }
        });
        delete dictionary[characterId];
        delete this._transientIds[this._characterIds[characterId]];
        delete this._characterIds[characterId];
    }
    sendManagedObjectResponseControlPacket(client, obj) {
        this.sendData(client, "ClientUpdate.ManagedObjectResponseControl", obj);
    }
    addLightweightNpc(client, entity, nameId = 0) {
        this.sendData(client, "AddLightweightNpc", {
            ...entity.pGetLightweight(),
            nameId,
        });
    }
    addSimpleNpc(client, entity) {
        this.sendData(client, "AddSimpleNpc", entity.pGetSimpleNpc());
    }
    checkFoundationPermission(client, foundation) {
        // under foundation check
        if (foundation.itemDefinitionId == enums_1.Items.FOUNDATION ||
            foundation.itemDefinitionId == enums_1.Items.FOUNDATION_EXPANSION) {
            if ((0, utils_1.isPosInRadiusWithY)(foundation.itemDefinitionId == enums_1.Items.FOUNDATION ? 6.46 : 4.9, client.character.state.position, new Float32Array([
                foundation.state.position[0],
                foundation.itemDefinitionId == enums_1.Items.FOUNDATION_EXPANSION
                    ? foundation.state.position[1] - 2.5
                    : foundation.state.position[1],
                foundation.state.position[2],
                1,
            ]), 2))
                this.tpPlayerOutsideFoundation(client, foundation, true);
        }
        if (!foundation.isSecured)
            return false;
        let allowed = false;
        const permissions = foundation.permissions[client.character.characterId];
        if (permissions && permissions.visit)
            allowed = true;
        if (foundation.itemDefinitionId == enums_1.Items.SHACK ||
            foundation.itemDefinitionId == enums_1.Items.SHACK_SMALL ||
            foundation.itemDefinitionId == enums_1.Items.SHACK_BASIC) {
            if (foundation.isInside(client.character.state.position)) {
                if (allowed) {
                    this.constructionHidePlayer(client, foundation.characterId, true);
                    return true;
                }
                else if (!client.isAdmin || !client.isDebugMode) {
                    this.tpPlayerOutsideFoundation(client, foundation);
                }
            }
        }
        if (allowed)
            return false;
        if (foundation.isInside(client.character.state.position) &&
            (!client.isAdmin || !client.isDebugMode)) {
            this.tpPlayerOutsideFoundation(client, foundation);
            return false;
        }
        return false;
    }
    checkConstructionChildEntityPermission(client, construction) {
        const allowedIds = [
            enums_1.Items.SHELTER,
            enums_1.Items.SHELTER_LARGE,
            enums_1.Items.SHELTER_UPPER,
            enums_1.Items.SHELTER_UPPER_LARGE,
        ];
        if (!allowedIds.includes(construction.itemDefinitionId))
            return false;
        let allowed = false;
        if (!construction.isSecured)
            return false;
        let foundation;
        if (this._constructionFoundations[construction.parentObjectCharacterId]) {
            foundation =
                this._constructionFoundations[construction.parentObjectCharacterId];
        }
        else if (this._constructionSimple[construction.parentObjectCharacterId] &&
            this._constructionFoundations[this._constructionSimple[construction.parentObjectCharacterId]
                .parentObjectCharacterId]) {
            foundation =
                this._constructionFoundations[this._constructionSimple[construction.parentObjectCharacterId]
                    .parentObjectCharacterId];
        }
        else {
            for (const a in this._constructionFoundations) {
                const b = this._constructionFoundations[a];
                if (!b.isInside(construction.state.position))
                    continue;
                foundation = b;
            }
        }
        if (!foundation)
            return false;
        const permissions = foundation.permissions[client.character.characterId];
        if (permissions && permissions.visit)
            allowed = true;
        if (construction.isInside(client.character.state.position)) {
            if (allowed) {
                this.constructionHidePlayer(client, construction.characterId, true);
                return true;
            }
            else if (!client.isAdmin || !client.isDebugMode) {
                this.tpPlayerOutsideFoundation(client, foundation);
                return false;
            }
        }
        return false;
    }
    constructionHidePlayer(client, constructionGuid, state) {
        if (state) {
            if (!client.character.isHidden) {
                client.character.isHidden = constructionGuid;
                for (const a in this._clients) {
                    const iteratedClient = this._clients[a];
                    if (iteratedClient.spawnedEntities.includes(client.character) &&
                        iteratedClient.character.isHidden != client.character.isHidden) {
                        this.sendData(iteratedClient, "Character.RemovePlayer", {
                            characterId: client.character.characterId,
                        });
                        iteratedClient.spawnedEntities.splice(iteratedClient.spawnedEntities.indexOf(client.character), 1);
                    }
                }
            }
            else
                return;
        }
        else if (client.character.isHidden)
            client.character.isHidden = "";
    }
    tpPlayerOutsideFoundation(client, foundation, tpUp = false) {
        const currentAngle = Math.atan2(client.character.state.position[2] - foundation.state.position[2], client.character.state.position[0] - foundation.state.position[0]);
        if (tpUp) {
            this.sendChatText(client, "Construction: Stuck under foundation");
            const foundationY = foundation.state.position[1], yOffset = foundation.itemDefinitionId == enums_1.Items.FOUNDATION ? 2.2 : 0.1;
            this.sendData(client, "ClientUpdate.UpdateLocation", {
                position: [
                    client.character.state.position[0],
                    foundationY + yOffset,
                    client.character.state.position[2],
                    1,
                ],
                triggerLoadingScreen: false,
            });
            return;
        }
        let protectedRadius;
        switch (foundation.itemDefinitionId) {
            case enums_1.Items.FOUNDATION:
                protectedRadius = 14;
                break;
            case enums_1.Items.FOUNDATION_EXPANSION:
                protectedRadius = 9.2;
                break;
            case enums_1.Items.GROUND_TAMPER:
                protectedRadius = 16;
                break;
            default:
                protectedRadius = 14;
        }
        const distance = protectedRadius -
            (0, utils_1.getDistance)(foundation.state.position, client.character.state.position);
        const newPos = (0, utils_1.movePoint)(client.character.state.position, currentAngle, distance);
        this.sendChatText(client, "Construction: no visitor permission");
        if (client.vehicle.mountedVehicle) {
            this.dismountVehicle(client);
        }
        this.sendData(client, "ClientUpdate.UpdateLocation", {
            position: [
                newPos[0],
                client.character.state.position[1] + 1,
                newPos[2],
                1,
            ],
            triggerLoadingScreen: false,
        });
    }
    /*private npcManager(client: Client) {
      for (const characterId in this._npcs) {
        const npc = this._npcs[characterId];
        // npc clientside spawner
        if (
          isPosInRadius(
            npc.npcRenderDistance,
            client.character.state.position,
            npc.state.position
          )
        ) {
          if (!client.spawnedEntities.includes(npc)) {
            this.addLightweightNpc(client, npc);
            npc.updateEquipment(this); // TODO: maybe we can already add the equipment to the npc?
            client.spawnedEntities.push(npc);
          }
        } else {
          const index = client.spawnedEntities.indexOf(npc);
          if (index > -1) {
            this.sendData(client, "Character.RemovePlayer", {
              characterId: npc.characterId,
            });
            client.spawnedEntities.splice(index, 1);
          }
        }
      }
    }*/
    npcDespawner() {
        for (const characterId in this._npcs) {
            const npc = this._npcs[characterId];
            // dead npc despawner
            if (npc.flags.knockedOut &&
                Date.now() - npc.deathTime >=
                    this.worldObjectManager.deadNpcDespawnTimer) {
                this.deleteEntity(npc.characterId, this._npcs);
            }
        }
    }
    plantManager() {
        const date = new Date().getTime();
        for (const characterId in this._temporaryObjects) {
            const object = this._temporaryObjects[characterId];
            if (object instanceof plantingdiameter_1.PlantingDiameter) {
                if (object.disappearTimestamp < date &&
                    Object.values(object.seedSlots).length === 0) {
                    this.deleteEntity(object.characterId, this._temporaryObjects);
                }
                else if (object.disappearTimestamp < date)
                    object.disappearTimestamp = date + 86400000;
                if (object.fertilizedTimestamp < date)
                    object.isFertilized = false;
                Object.values(object.seedSlots).forEach((plant) => {
                    if (plant.nextStateTime < date)
                        plant.grow(this);
                });
            }
        }
    }
    spawnConstructionFreeplace(client, parentEntity) {
        for (const entity of Object.values(parentEntity.freeplaceEntities)) {
            if (entity instanceof constructionchildentity_1.ConstructionChildEntity) {
                this.spawnSimpleConstruction(client, entity);
            }
            else if (entity instanceof constructiondoor_1.ConstructionDoor) {
                this.spawnConstructionDoor(client, entity);
            }
            else if (entity instanceof lootableconstructionentity_1.LootableConstructionEntity &&
                !this.constructionShouldHideEntity(client, entity)) {
                this.spawnLootableConstruction(client, entity);
            }
        }
    }
    spawnConstructionParent(client, entity) {
        if (!client.spawnedEntities.includes(entity)) {
            this.addLightweightNpc(client, entity, this.getItemDefinition(entity.itemDefinitionId)?.NAME_ID);
            this.sendData(client, "Replication.NpcComponent", {
                transientId: entity.transientId,
                nameId: entity.nameId,
            });
            client.spawnedEntities.push(entity);
            if (entity.itemDefinitionId == enums_1.Items.SHACK ||
                entity.itemDefinitionId == enums_1.Items.SHACK_SMALL ||
                entity.itemDefinitionId == enums_1.Items.SHACK_BASIC) {
                this.updateResource(client, entity.characterId, entity.health, enums_1.ResourceIds.CONSTRUCTION_CONDITION, enums_1.ResourceTypes.CONDITION);
            }
        }
        // slotted construction spawning
        this.spawnConstructionTree(client, entity);
        // freeplace construction spawning
        this.spawnConstructionFreeplace(client, entity);
    }
    spawnConstructionDoor(client, entity) {
        if (client.spawnedEntities.includes(entity))
            return;
        this.addLightweightNpc(client, entity, this.getItemDefinition(entity.itemDefinitionId)?.NAME_ID);
        this.sendData(client, "Replication.InteractionComponent", {
            transientId: entity.transientId,
        });
        this.sendData(client, "Replication.NpcComponent", {
            transientId: entity.transientId,
            nameId: entity.nameId,
        });
        client.spawnedEntities.push(entity);
        this.updateResource(client, entity.characterId, entity.health, enums_1.ResourceIds.CONSTRUCTION_CONDITION, enums_1.ResourceTypes.CONDITION);
        if (entity.isOpen) {
            this.sendData(client, "PlayerUpdatePosition", {
                transientId: entity.transientId,
                positionUpdate: {
                    sequenceTime: 0,
                    unknown3_int8: 0,
                    position: entity.state.position,
                    orientation: entity.openAngle,
                },
            });
        }
    }
    spawnSimpleConstruction(client, entity, spawnTree = true) {
        if (!client.spawnedEntities.includes(entity)) {
            this.addLightweightNpc(client, entity, this.getItemDefinition(entity.itemDefinitionId)?.NAME_ID);
            this.sendData(client, "Replication.NpcComponent", {
                transientId: entity.transientId,
                nameId: entity.nameId,
            });
            client.spawnedEntities.push(entity);
            this.updateResource(client, entity.characterId, entity.health, enums_1.ResourceIds.CONSTRUCTION_CONDITION, enums_1.ResourceTypes.CONDITION);
        }
        if (!spawnTree)
            return;
        // slotted construction spawning
        this.spawnConstructionTree(client, entity);
        // freeplace construction spawning
        this.spawnConstructionFreeplace(client, entity);
    }
    spawnLootableConstruction(client, entity) {
        if (client.spawnedEntities.includes(entity))
            return;
        this.addLightweightNpc(client, entity, this.getItemDefinition(entity.itemDefinitionId)?.NAME_ID);
        this.sendData(client, "Replication.InteractionComponent", {
            transientId: entity.transientId,
        });
        this.sendData(client, "Replication.NpcComponent", {
            transientId: entity.transientId,
            nameId: entity.nameId,
        });
        this.updateResource(client, entity.characterId, entity.health, enums_1.ResourceIds.CONSTRUCTION_CONDITION, enums_1.ResourceTypes.CONDITION);
        client.spawnedEntities.push(entity);
    }
    spawnConstructionTree(client, parentEntity) {
        for (const slotMap of parentEntity.getOccupiedSlotMaps()) {
            for (const entity of Object.values(slotMap)) {
                if ((0, utils_1.isPosInRadius)(entity.npcRenderDistance
                    ? entity.npcRenderDistance
                    : this._charactersRenderDistance, client.character.state.position, entity.state.position)) {
                    if (entity instanceof constructionchildentity_1.ConstructionChildEntity) {
                        this.spawnSimpleConstruction(client, entity);
                    }
                    else if (entity instanceof constructiondoor_1.ConstructionDoor) {
                        this.spawnConstructionDoor(client, entity);
                    }
                }
            }
        }
    }
    constructionManager(client) {
        let hide = false;
        for (const characterId in this._constructionFoundations) {
            const npc = this._constructionFoundations[characterId];
            if (this.checkFoundationPermission(client, npc))
                hide = true;
        }
        for (const characterId in this._constructionSimple) {
            const npc = this._constructionSimple[characterId];
            if (this.checkConstructionChildEntityPermission(client, npc))
                hide = true;
        }
        if (!hide && client.character.isHidden) {
            client.character.isHidden = "";
            this.spawnCharacterToOtherClients(client.character);
        }
    }
    /**
     * Manages the spawning of WORLD parented free-place construction entities, such as storage containers placed directly on the ground.
     *
     */
    worldConstructionManager(client) {
        for (const characterId in this._worldSimpleConstruction) {
            const entity = this._worldSimpleConstruction[characterId];
            if ((0, utils_1.isPosInRadius)(entity.npcRenderDistance, client.character.state.position, entity.state.position)) {
                this.spawnSimpleConstruction(client, entity, false);
            }
        }
        for (const characterId in this._worldLootableConstruction) {
            const entity = this._worldLootableConstruction[characterId];
            if ((0, utils_1.isPosInRadius)(entity.npcRenderDistance, client.character.state.position, entity.state.position)) {
                this.spawnLootableConstruction(client, entity);
            }
        }
    }
    spawnCharacters(client) {
        for (const c in this._clients) {
            const characterObj = this._clients[c].character;
            if (client.character.characterId != characterObj.characterId &&
                characterObj.isReady &&
                (0, utils_1.isPosInRadius)(characterObj.npcRenderDistance || this._charactersRenderDistance, client.character.state.position, characterObj.state.position) &&
                !client.spawnedEntities.includes(characterObj) &&
                characterObj.isAlive &&
                !characterObj.isSpectator &&
                (characterObj.isHidden == client.character.isHidden ||
                    client.character.isSpectator) &&
                client.banType != "hiddenplayers") {
                const vehicleId = this._clients[c].vehicle.mountedVehicle, vehicle = vehicleId ? this._vehicles[vehicleId] : false;
                this.sendData(client, "AddLightweightPc", {
                    ...characterObj.pGetLightweight(),
                    mountGuid: vehicleId || "",
                    mountSeatId: vehicle
                        ? vehicle.getCharacterSeat(characterObj.characterId)
                        : 0,
                    mountRelatedDword1: vehicle ? 1 : 0,
                });
                client.spawnedEntities.push(this._characters[characterObj.characterId]);
            }
        }
    }
    spawnCharacterToOtherClients(character) {
        for (const a in this._clients) {
            const c = this._clients[a];
            if ((0, utils_1.isPosInRadius)(character.npcRenderDistance || this._charactersRenderDistance, character.state.position, c.character.state.position) &&
                !c.spawnedEntities.includes(character) &&
                character != c.character) {
                this.sendData(c, "AddLightweightPc", {
                    ...character.pGetLightweight(),
                    mountGuid: "",
                    mountSeatId: 0,
                    mountRelatedDword1: 0,
                });
                c.spawnedEntities.push(character);
            }
        }
    }
    itemDespawner() {
        for (const characterId in this._spawnedItems) {
            const itemObject = this._spawnedItems[characterId];
            if (!itemObject)
                return;
            // dropped item despawner
            const despawnTime = itemObject.spawnerId == -1
                ? this.worldObjectManager.itemDespawnTimer
                : this.worldObjectManager.lootDespawnTimer;
            if (Date.now() - itemObject.creationTime >= despawnTime) {
                this.deleteEntity(itemObject.characterId, this._spawnedItems);
                if (itemObject.spawnerId != -1)
                    delete this.worldObjectManager._spawnedLootObjects[itemObject.spawnerId];
                this.sendCompositeEffectToAllWithSpawnedEntity(this._spawnedItems, itemObject, this.getItemDefinition(itemObject.item.itemDefinitionId)
                    .PICKUP_EFFECT ?? 5151);
            }
        }
    }
    lootbagDespawner() {
        for (const characterId in this._lootbags) {
            // lootbag despawner
            const lootbag = this._lootbags[characterId];
            if (Date.now() - lootbag.creationTime >=
                1800000 // 30 minutes for now
            ) {
                this.deleteEntity(lootbag.characterId, this._lootbags);
            }
        }
    }
    spawnGridObjects(client) {
        const position = client.character.state.position;
        for (const gridCell of this._grid) {
            if (!(0, utils_1.isPosInRadius)(client.chunkRenderDistance, gridCell.position, position))
                continue;
            for (const object of gridCell.objects) {
                if (!(0, utils_1.isPosInRadius)(object.npcRenderDistance ||
                    this._charactersRenderDistance, position, object.state.position)) {
                    continue;
                }
                if (object instanceof constructionparententity_1.ConstructionParentEntity) {
                    this.spawnConstructionParent(client, object);
                    continue;
                }
                if (client.spawnedEntities.includes(object))
                    continue;
                client.spawnedEntities.push(object);
                if (object instanceof baselightweightcharacter_1.BaseLightweightCharacter) {
                    this.addLightweightNpc(client, object);
                    if (typeof object.OnInteractionString !== "undefined") {
                        this.sendData(client, "Replication.InteractionComponent", {
                            transientId: object.transientId,
                        });
                        this.sendData(client, "Replication.NpcComponent", {
                            transientId: object.transientId,
                            nameId: object.nameId,
                        });
                    }
                    if (object instanceof doorentity_1.DoorEntity) {
                        if (object.isOpen) {
                            this.sendData(client, "PlayerUpdatePosition", {
                                transientId: object.transientId,
                                positionUpdate: {
                                    sequenceTime: 0,
                                    unknown3_int8: 0,
                                    position: object.state.position,
                                    orientation: object.openAngle,
                                },
                            });
                        }
                        continue;
                    }
                    if (object instanceof npc_1.Npc) {
                        object.updateEquipment(this);
                        continue;
                    }
                }
                else if (object instanceof trapentity_1.TrapEntity ||
                    object instanceof temporaryentity_1.TemporaryEntity) {
                    this.addSimpleNpc(client, object);
                }
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
    logStats() {
        console.log(JSON.stringify(this._packetsStats));
    }
    _sendData(client, packetName, obj, unbuffered) {
        if (this._packetsStats[packetName])
            this._packetsStats[packetName]++;
        else
            this._packetsStats[packetName] = 1;
        switch (packetName) {
            case "KeepAlive":
            case "PlayerUpdatePosition":
            case "GameTimeSync":
            case "Synchronization":
            case "Vehicle.StateData":
                break;
            default:
                debug("send data", packetName);
        }
        const data = this._protocol.pack(packetName, obj);
        if (data) {
            const soeClient = this.getSoeClient(client.soeClientId);
            if (soeClient) {
                if (unbuffered) {
                    this._gatewayServer.sendUnbufferedTunnelData(soeClient, data);
                }
                else {
                    this._gatewayServer.sendTunnelData(soeClient, data);
                }
            }
        }
    }
    sendUnbufferedData(client, packetName, obj) {
        this._sendData(client, packetName, obj, true);
    }
    sendData(client, packetName, obj) {
        this._sendData(client, packetName, obj, false);
    }
    sendWeaponData(client, packetName, obj) {
        this.sendData(client, "Weapon.Weapon", {
            weaponPacket: {
                packetName: packetName,
                gameTime: this.getGameTime(),
                packet: obj,
            },
        });
    }
    sendRemoteWeaponData(client, transientId, packetName, obj) {
        this.sendData(client, "Weapon.Weapon", {
            weaponPacket: {
                packetName: "Weapon.RemoteWeapon",
                gameTime: this.getGameTime(),
                remoteWeaponPacket: {
                    packetName: packetName,
                    transientId: transientId,
                    packet: obj,
                },
            },
        });
    }
    sendRemoteWeaponDataToAllOthers(client, transientId, packetName, obj) {
        this.sendDataToAllOthersWithSpawnedEntity(this._characters, client, client.character.characterId, "Weapon.Weapon", {
            weaponPacket: {
                packetName: "Weapon.RemoteWeapon",
                gameTime: this.getGameTime(),
                remoteWeaponPacket: {
                    packetName: packetName,
                    transientId: transientId,
                    packet: obj,
                },
            },
        });
    }
    sendRemoteWeaponUpdateData(client, transientId, weaponGuid, packetName, obj) {
        this.sendData(client, "Weapon.Weapon", {
            weaponPacket: {
                packetName: "Weapon.RemoteWeapon",
                gameTime: this.getGameTime(),
                remoteWeaponPacket: {
                    packetName: "RemoteWeapon.Update",
                    transientId: transientId,
                    remoteWeaponUpdatePacket: {
                        packetName: packetName,
                        weaponGuid: weaponGuid,
                        packet: obj,
                    },
                },
            },
        });
    }
    sendRemoteWeaponUpdateDataToAllOthers(client, transientId, weaponGuid, packetName, obj) {
        this.sendDataToAllOthersWithSpawnedEntity(this._characters, client, client.character.characterId, "Weapon.Weapon", {
            weaponPacket: {
                packetName: "Weapon.RemoteWeapon",
                gameTime: this.getGameTime(),
                remoteWeaponPacket: {
                    packetName: "RemoteWeapon.Update",
                    transientId: transientId,
                    remoteWeaponUpdatePacket: {
                        packetName: packetName,
                        weaponGuid: weaponGuid,
                        packet: obj,
                    },
                },
            },
        });
    }
    sendAlert(client, message) {
        this._sendData(client, "ClientUpdate.TextAlert", {
            message: message,
        }, false);
    }
    sendAlertToAll(message) {
        this._sendDataToAll("ClientUpdate.TextAlert", {
            message: message,
        }, false);
    }
    sendChat(client, message) {
        if (!this._soloMode) {
            this.sendDataToAll("Chat.ChatText", {
                message: `${client.character.name}: ${message}`,
                unknownDword1: 0,
                color: [255, 255, 255, 0],
                unknownDword2: 13951728,
                unknownByte3: 0,
                unknownByte4: 1,
            });
        }
        else {
            this.sendData(client, "Chat.ChatText", {
                message: `${client.character.name}: ${message}`,
                unknownDword1: 0,
                color: [255, 255, 255, 0],
                unknownDword2: 13951728,
                unknownByte3: 0,
                unknownByte4: 1,
            });
        }
    }
    sendChatToAllInRange(client, message, range) {
        this.sendDataToAllInRange(range, client.character.state.position, "Chat.ChatText", {
            message: `${client.character.name}: ${message}`,
            unknownDword1: 0,
            color: [255, 255, 255, 0],
            unknownDword2: 13951728,
            unknownByte3: 0,
            unknownByte4: 1,
        });
    }
    sendChatToAllWithRadio(client, message) {
        for (const a in this._clients) {
            const c = this._clients[a];
            if (!c.character._loadout[enums_1.LoadoutSlots.RADIO])
                return;
            if (c.character._loadout[enums_1.LoadoutSlots.RADIO].itemDefinitionId !=
                enums_1.Items.EMERGENCY_RADIO ||
                !c.radio)
                return;
            this.sendData(c, "Chat.ChatText", {
                message: `[RADIO: ${client.character.name}]: ${message}`,
                unknownDword1: 0,
                color: [255, 255, 255, 0],
                unknownDword2: 13951728,
                unknownByte3: 0,
                unknownByte4: 1,
            });
        }
    }
    createClient(sessionId, soeClientId, loginSessionId, characterId, generatedTransient) {
        const client = new zoneclient_1.ZoneClient2016(sessionId, soeClientId, loginSessionId, characterId, generatedTransient, this);
        return client;
    }
    async isClientBanned(client) {
        const address = this.getSoeClient(client.soeClientId)?.address;
        const addressBanned = await this._db
            ?.collection(enums_2.DB_COLLECTIONS.BANNED)
            .findOne({ IP: address, active: true });
        const idBanned = await this._db
            ?.collection(enums_2.DB_COLLECTIONS.BANNED)
            .findOne({ loginSessionId: client.loginSessionId, active: true });
        if (addressBanned?.expirationDate < Date.now() ||
            idBanned?.expirationDate < Date.now()) {
            client.banType = addressBanned
                ? addressBanned.banType
                : idBanned?.banType;
            this.enforceBan(client);
            return true;
        }
        return false;
    }
    banClient(client, reason, banType, adminName, timestamp) {
        const object = {
            name: client.character.name || "",
            banType: banType,
            banReason: reason ? reason : "no reason",
            loginSessionId: client.loginSessionId,
            IP: this.getSoeClient(client.soeClientId)?.address || "",
            HWID: client.HWID,
            adminName: adminName ? adminName : "",
            expirationDate: 0,
            active: true,
            unBanAdminName: "",
        };
        if (timestamp) {
            object.expirationDate = timestamp;
        }
        this._db?.collection(enums_2.DB_COLLECTIONS.BANNED).insertOne(object);
        if (banType === "normal") {
            if (timestamp) {
                this.sendAlert(client, reason
                    ? `YOU HAVE BEEN BANNED FROM THE SERVER UNTIL ${this.getDateString(timestamp)}. REASON: ${reason}`
                    : `YOU HAVE BEEN BANNED FROM THE SERVER UNTIL: ${this.getDateString(timestamp)}`);
            }
            else {
                this.sendAlert(client, reason
                    ? `YOU HAVE BEEN PERMAMENTLY BANNED FROM THE SERVER REASON: ${reason}`
                    : "YOU HAVE BEEN BANNED FROM THE SERVER.");
                this.sendAlertToAll(reason
                    ? `${client.character.name} has been Banned from the server! Reason: ${reason}`
                    : `${client.character.name} has been Banned from the server!`);
            }
            setTimeout(() => {
                this.kickPlayer(client);
            }, 3000);
        }
        else {
            client.banType = banType;
            this.enforceBan(client);
        }
    }
    enforceBan(client) {
        switch (client.banType) {
            case "normal":
                this.kickPlayer(client);
                return;
            case "hiddenplayers":
                const objectsToRemove = client.spawnedEntities.filter((e) => e && // in case if entity is undefined somehow
                    !e.vehicleId && // ignore vehicles
                    !e.item);
                client.spawnedEntities = client.spawnedEntities.filter((el) => {
                    return !objectsToRemove.includes(el);
                });
                objectsToRemove.forEach((object) => {
                    this.sendData(client, "Character.RemovePlayer", {
                        characterId: object.characterId,
                    });
                });
                break;
            case "rick":
                this.sendData(client, "ClientExitLaunchUrl", {
                    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                });
                this.sendData(client, "LoginFailed", {});
                this.deleteClient(client);
                setTimeout(() => {
                    if (!client)
                        return;
                    this.deleteClient(client);
                }, 1000);
                break;
        }
    }
    kickPlayer(client) {
        this.sendData(client, "CharacterSelectSessionResponse", {
            status: 1,
            sessionId: client.loginSessionId,
        });
        setTimeout(() => {
            if (!client)
                return;
            this.deleteClient(client);
        }, 1000);
    }
    getDateString(timestamp) {
        const months = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
        ];
        const date = new Date(timestamp);
        return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
    }
    getCurrentTime() {
        return Number((Date.now() / 1000).toFixed(0));
    }
    getGameTime() {
        //debug("get server time");
        const delta = Date.now() - this._startGameTime;
        return this._frozeCycle
            ? Number(((this._gameTime + delta) / 1000).toFixed(0))
            : Number((this._gameTime / 1000).toFixed(0));
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
    sendRawToAllOthersWithSpawnedCharacter(client, entityCharacterId = "", data) {
        for (const a in this._clients) {
            if (client != this._clients[a] &&
                this._clients[a].spawnedEntities.includes(this._characters[entityCharacterId])) {
                this.sendRawData(this._clients[a], data);
            }
        }
    }
    //#region ********************VEHICLE********************
    vehicleManager(client) {
        for (const key in this._vehicles) {
            const vehicle = this._vehicles[key];
            //if (vehicle.vehicleId == VehicleIds.SPECTATE) continue; //ignore spectator cam // shouldnt be needed anymore
            if (
            // vehicle spawning / managed object assignment logic
            (0, utils_1.isPosInRadius)(vehicle.npcRenderDistance || this._charactersRenderDistance, client.character.state.position, vehicle.state.position)) {
                if (!client.spawnedEntities.includes(vehicle)) {
                    this.sendData(client, "AddLightweightVehicle", {
                        ...vehicle.pGetLightweightVehicle(),
                        unknownGuid1: this.generateGuid(),
                    });
                    this.sendData(client, "Replication.InteractionComponent", {
                        transientId: vehicle.transientId,
                    });
                    this.sendData(client, "Replication.NpcComponent", {
                        transientId: vehicle.transientId,
                        nameId: vehicle.nameId,
                    });
                    this.sendData(client, "Vehicle.OwnerPassengerList", {
                        characterId: client.character.characterId,
                        passengers: vehicle.pGetPassengers(this),
                    });
                    client.spawnedEntities.push(vehicle);
                }
                if (!vehicle.isManaged) {
                    // assigns management to first client within radius
                    this.assignManagedObject(client, vehicle);
                }
            }
            else if (!(0, utils_1.isPosInRadius)(this._charactersRenderDistance, client.character.state.position, vehicle.state.position)) {
                // vehicle despawning / managed object drop logic
                const index = client.spawnedEntities.indexOf(vehicle);
                if (index > -1) {
                    if (vehicle.isManaged) {
                        this.dropManagedObject(client, vehicle);
                    }
                    this.sendData(client, "Character.RemovePlayer", {
                        characterId: vehicle.characterId,
                    });
                    client.spawnedEntities.splice(index, 1);
                }
            }
        }
    }
    assignManagedObject(client, vehicle) {
        // todo: vehicle seat swap managed object assignment logic
        debug("\n\n\n\n\n\n\n\n\n\n assign managed object");
        this.sendData(client, "Character.ManagedObject", {
            objectCharacterId: vehicle.characterId,
            characterId: client.character.characterId,
        });
        this.sendData(client, "ClientUpdate.ManagedObjectResponseControl", {
            control: true,
            objectCharacterId: vehicle.characterId,
        });
        client.managedObjects.push(vehicle.characterId);
        vehicle.isManaged = true;
    }
    dropManagedObject(client, vehicle, keepManaged = false) {
        const index = client.managedObjects.indexOf(vehicle.characterId);
        if (index > -1) {
            // todo: vehicle seat swap managed object drop logic
            debug("\n\n\n\n\n\n\n\n\n\n drop managed object");
            /*this.sendData(client, "ClientUpdate.ManagedObjectResponseControl", {
              control: true,
              objectCharacterId: vehicle.characterId,
            });*/ // dont work :/
            // workaround for managed object issue
            if (client.vehicle.mountedVehicle == vehicle.characterId) {
                this.sendData(client, "Mount.DismountResponse", {
                    characterId: client.character.characterId,
                });
                vehicle.droppedManagedClient = client;
            }
            this.sendData(client, "Character.RemovePlayer", {
                characterId: vehicle.characterId,
            });
            this.sendData(client, "AddLightweightVehicle", {
                ...vehicle.pGetLightweightVehicle(),
                unknownGuid1: this.generateGuid(),
            });
            client.managedObjects.splice(index, 1);
            // blocks vehicleManager from taking over management during a takeover
            if (!keepManaged)
                vehicle.isManaged = false;
        }
    }
    takeoverManagedObject(newClient, vehicle) {
        const index = newClient.managedObjects.indexOf(vehicle.characterId);
        if (index === -1) {
            // if object is already managed by client, do nothing
            debug("\n\n\n\n\n\n\n\n\n\n takeover managed object");
            for (const characterId in this._clients) {
                const oldClient = this._clients[characterId];
                const idx = oldClient.managedObjects.indexOf(vehicle.characterId);
                if (idx > -1) {
                    this.dropManagedObject(oldClient, vehicle, true);
                    break;
                }
            }
            this.assignManagedObject(newClient, vehicle);
        }
    }
    sendCompositeEffectToAllWithSpawnedEntity(dictionary, object, effectId) {
        this.sendDataToAllWithSpawnedEntity(dictionary, object.characterId, "Character.PlayWorldCompositeEffect", {
            characterId: object.characterId,
            effectId: effectId,
            position: object.state.position,
        });
    }
    sendCompositeEffectToAllInRange(range, characterId, position, effectId) {
        this.sendDataToAllInRange(range, position, "Character.PlayWorldCompositeEffect", {
            characterId: characterId,
            effectId: effectId,
            position: position,
        });
    }
    /*sendEffectToAllWithSpawnedEntity( idk whats wrong with it, sometimes works and sometimes doesnt
      characterId: string,
      effectId: number,
      dictionary: any,
    ) {
        this.sendDataToAllWithSpawnedEntity(
            dictionary,
            characterId,
            "Command.PlayDialogEffect",
            {
                characterId: characterId,
                effectId: effectId,
            }
        );
      
    }*/
    sendDataToAllWithSpawnedEntity(dictionary, entityCharacterId = "", packetName, obj) {
        if (!entityCharacterId)
            return;
        for (const a in this._clients) {
            if (this._clients[a].spawnedEntities.includes(dictionary[entityCharacterId]) ||
                this._clients[a].character.characterId == entityCharacterId) {
                this.sendData(this._clients[a], packetName, obj);
            }
        }
    }
    sendDataToAllInRange(range, position, packetName, obj) {
        for (const a in this._clients) {
            if ((0, utils_1.isPosInRadius)(range, this._clients[a].character.state.position, position)) {
                this.sendData(this._clients[a], packetName, obj);
            }
        }
    }
    sendDataToAllOthersWithSpawnedEntity(dictionary, client, entityCharacterId = "", packetName, obj) {
        if (!entityCharacterId)
            return;
        for (const a in this._clients) {
            if (client != this._clients[a] &&
                this._clients[a].spawnedEntities.includes(dictionary[entityCharacterId])) {
                this.sendData(this._clients[a], packetName, obj);
            }
        }
    }
    sendConstructionData(client) {
        const unknownArray1 = [46, 45, 47, 48, 49, 50, 12, 7, 15], unknownArray2 = [...unknownArray1, 5, 10, 44, 57, 27, 2, 55, 56];
        this.sendData(client, "Construction.Unknown", {
            unknownArray1: unknownArray1.map((value) => {
                return { unknownDword1: value };
            }),
            /* this array affects certain items placed on direct
            ground ex. punji sticks, furnace, flare, etc
            */
            unknownArray2: unknownArray2.map((value) => {
                return { unknownDword1: value };
            }),
        });
    }
    placement(client, itemDefinitionId, modelId, position, rotation, parentObjectCharacterId, BuildingSlot) {
        const item = client.character.getItemById(itemDefinitionId);
        if (!item) {
            this.sendData(client, "Construction.PlacementFinalizeResponse", {
                status: 1,
                unknownString1: "",
            });
            return;
        }
        const allowedItems = [enums_1.Items.IED, enums_1.Items.LANDMINE, enums_1.Items.SNARE];
        // for construction entities that don't have a parentObjectCharacterId from the client
        let freeplaceParentCharacterId = "";
        for (const a in this._constructionFoundations) {
            const foundation = this._constructionFoundations[a];
            let allowBuild = false;
            const permissions = foundation.permissions[client.character.characterId];
            if (permissions && permissions.build)
                allowBuild = true;
            if ((0, utils_1.isPosInRadius)(foundation.actorModelId === 9180 ? 5 : 30, position, foundation.state.position) &&
                allowBuild === false &&
                !allowedItems.includes(itemDefinitionId)) {
                this.placementError(client, enums_1.ConstructionErrors.BUILD_PERMISSION);
                this.sendData(client, "Construction.PlacementFinalizeResponse", {
                    status: 0,
                    unknownString1: "",
                });
                return;
            }
            // for construction entities that don't have a parentObjectCharacterId from the client
            if (!Number(parentObjectCharacterId) && foundation.isInside(position)) {
                freeplaceParentCharacterId = foundation.characterId;
                // check if object is inside a shelter
                Object.values(foundation.occupiedShelterSlots).forEach((shelter) => {
                    if (shelter.isInside(position)) {
                        freeplaceParentCharacterId = shelter.characterId;
                    }
                });
            }
        }
        // block building in cities
        const allowedPoiPlacement = [
            enums_1.Items.LANDMINE,
            enums_1.Items.IED,
            enums_1.Items.PUNJI_STICKS,
            enums_1.Items.SNARE,
        ];
        if (!allowedPoiPlacement.includes(itemDefinitionId)) {
            let isInPoi = false;
            let useRange = true;
            Z1_POIs.forEach((point) => {
                if (point.bounds) {
                    useRange = false;
                    point.bounds.forEach((bound) => {
                        if ((0, utils_1.isInsideSquare)([position[0], position[2]], bound)) {
                            isInPoi = true;
                            return;
                        }
                    });
                }
                if (useRange && (0, utils_1.isPosInRadius)(point.range, position, point.position))
                    isInPoi = true;
            });
            if (isInPoi) {
                this.sendData(client, "Construction.PlacementFinalizeResponse", {
                    status: 0,
                    unknownString1: "",
                });
                this.sendAlert(client, "You may not place this object this close to a town or point of interest.");
                return;
            }
        }
        if (!this.handleConstructionPlacement(client, itemDefinitionId, modelId, position, rotation, parentObjectCharacterId, BuildingSlot, freeplaceParentCharacterId)) {
            this.sendData(client, "Construction.PlacementFinalizeResponse", {
                status: 0,
                unknownString1: "",
            });
            return;
        }
        this.removeInventoryItem(client, item);
        this.sendData(client, "Construction.PlacementFinalizeResponse", {
            status: 1,
            unknownString1: "",
        });
        this.constructionManager(client);
    }
    handleConstructionPlacement(client, itemDefinitionId, modelId, position, rotation, parentObjectCharacterId, BuildingSlot, freeplaceParentCharacterId) {
        switch (itemDefinitionId) {
            case enums_1.Items.SNARE:
            case enums_1.Items.PUNJI_STICKS:
                return this.placeTrap(itemDefinitionId, modelId, position, rotation);
            case enums_1.Items.FLARE:
                return this.placeTemporaryEntity(modelId, position, (0, utils_1.eul2quat)(rotation), 900000);
            case enums_1.Items.IED:
            case enums_1.Items.LANDMINE:
                return this.placeExplosiveEntity(itemDefinitionId, modelId, position, (0, utils_1.eul2quat)(rotation));
            case enums_1.Items.METAL_GATE:
            case enums_1.Items.DOOR_BASIC:
            case enums_1.Items.DOOR_WOOD:
            case enums_1.Items.DOOR_METAL:
                return this.placeConstructionDoor(client, itemDefinitionId, modelId, parentObjectCharacterId, BuildingSlot);
            case enums_1.Items.GROUND_TAMPER:
            case enums_1.Items.SHACK_BASIC:
            case enums_1.Items.SHACK:
            case enums_1.Items.FOUNDATION:
            case enums_1.Items.SHACK_SMALL:
            case enums_1.Items.FOUNDATION_EXPANSION:
                return this.placeConstructionFoundation(client, itemDefinitionId, modelId, position, rotation, parentObjectCharacterId, BuildingSlot);
            case enums_1.Items.FOUNDATION_RAMP:
                return this.placeConstructionRamp(client, itemDefinitionId, modelId, parentObjectCharacterId, BuildingSlot);
            case enums_1.Items.FOUNDATION_STAIRS:
                return this.placeConstructionStairs(client, itemDefinitionId, modelId, rotation, parentObjectCharacterId, BuildingSlot);
            case enums_1.Items.STORAGE_BOX:
                return this.placeLootableConstruction(client, itemDefinitionId, modelId, position, (0, utils_1.eul2quat)(rotation), freeplaceParentCharacterId);
            case enums_1.Items.FURNACE:
            case enums_1.Items.BARBEQUE:
            case enums_1.Items.CAMPFIRE:
                return this.placeSmeltingEntity(client, itemDefinitionId, modelId, position, (0, utils_1.eul2quat)(rotation), freeplaceParentCharacterId);
            case enums_1.Items.DEW_COLLECTOR:
            case enums_1.Items.ANIMAL_TRAP:
                return this.placeCollectingEntity(client, itemDefinitionId, modelId, position, (0, utils_1.eul2quat)(rotation), freeplaceParentCharacterId);
            case enums_1.Items.METAL_WALL:
            case enums_1.Items.METAL_WALL_UPPER:
            case enums_1.Items.METAL_DOORWAY:
                return this.placeConstructionWall(client, itemDefinitionId, modelId, parentObjectCharacterId, BuildingSlot);
            case enums_1.Items.SHELTER:
            case enums_1.Items.SHELTER_LARGE:
            case enums_1.Items.SHELTER_UPPER:
            case enums_1.Items.SHELTER_UPPER_LARGE:
            case enums_1.Items.STRUCTURE_STAIRS:
            case enums_1.Items.STRUCTURE_STAIRS_UPPER:
            case enums_1.Items.LOOKOUT_TOWER:
                return this.placeConstructionShelter(client, itemDefinitionId, modelId, rotation, parentObjectCharacterId, BuildingSlot);
            case enums_1.Items.GROUND_TILLER:
                return this.placePlantingDiameter(modelId, position, rotation);
            case enums_1.Items.SEED_WHEAT:
            case enums_1.Items.SEED_CORN:
                return this.placePlantOnDiameter(modelId, position, rotation, BuildingSlot, parentObjectCharacterId, itemDefinitionId);
            default:
                //this.placementError(client, ConstructionErrors.UNKNOWN_CONSTRUCTION);
                // need to add all valid construction eventually
                const characterId = this.generateGuid(), transientId = 1, // dont think its needed
                construction = new constructionchildentity_1.ConstructionChildEntity(characterId, transientId, modelId, position, rotation, this, itemDefinitionId, freeplaceParentCharacterId || "", "");
                const parent = construction.getParent(this);
                if (parent) {
                    this._constructionSimple[characterId] = construction;
                    parent.addFreeplaceConstruction(construction);
                }
                else {
                    this._worldSimpleConstruction[characterId] = construction;
                }
                this.executeFuncForAllReadyClientsInRange((client) => {
                    this.spawnSimpleConstruction(client, construction);
                }, construction);
                return true;
        }
    }
    placeConstructionShelter(client, itemDefinitionId, modelId, rotation, parentObjectCharacterId, BuildingSlot) {
        const parent = this._constructionFoundations[parentObjectCharacterId] ||
            this._constructionSimple[parentObjectCharacterId];
        if (!Number(parentObjectCharacterId) || !parent) {
            this.placementError(client, enums_1.ConstructionErrors.UNKNOWN_PARENT);
            return false;
        }
        if (parent instanceof constructionparententity_1.ConstructionParentEntity) {
            BuildingSlot = parent.getAdjustedShelterSlotId(BuildingSlot);
        }
        if (parent &&
            parent.isSlotOccupied(parent.occupiedShelterSlots, (0, utils_1.getConstructionSlotId)(BuildingSlot))) {
            this.placementError(client, enums_1.ConstructionErrors.OVERLAP);
            return false;
        }
        if (!parent.isShelterSlotValid(BuildingSlot, itemDefinitionId)) {
            this.placementError(client, enums_1.ConstructionErrors.UNKNOWN_SLOT);
            return false;
        }
        const position = parent.getSlotPosition(BuildingSlot, parent.shelterSlots);
        if (!position) {
            this.placementError(client, enums_1.ConstructionErrors.UNKNOWN_SLOT);
            return false;
        }
        const characterId = this.generateGuid(), transientId = 1, // dont think its needed
        shelter = new constructionchildentity_1.ConstructionChildEntity(characterId, transientId, modelId, position, rotation, this, itemDefinitionId, parentObjectCharacterId, BuildingSlot);
        this._constructionSimple[characterId] = shelter;
        parent.setShelterSlot(this, shelter);
        this.executeFuncForAllReadyClientsInRange((client) => {
            this.spawnSimpleConstruction(client, shelter);
        }, shelter);
        return true;
    }
    placeConstructionWall(client, itemDefinitionId, modelId, parentObjectCharacterId, BuildingSlot) {
        const parent = this._constructionFoundations[parentObjectCharacterId] ||
            this._constructionSimple[parentObjectCharacterId];
        if (!Number(parentObjectCharacterId) || !parent) {
            this.placementError(client, enums_1.ConstructionErrors.UNKNOWN_PARENT);
            return false;
        }
        if (!parent.isWallSlotValid(BuildingSlot, itemDefinitionId)) {
            this.placementError(client, enums_1.ConstructionErrors.UNKNOWN_SLOT);
            return false;
        }
        let position, rotation;
        if (itemDefinitionId == enums_1.Items.METAL_WALL_UPPER) {
            if (parent &&
                parent.isSlotOccupied(parent.occupiedUpperWallSlots, (0, utils_1.getConstructionSlotId)(BuildingSlot))) {
                this.placementError(client, enums_1.ConstructionErrors.OVERLAP);
                return false;
            }
            (position = parent.getSlotPosition(BuildingSlot, parent.upperWallSlots)),
                (rotation = parent.getSlotRotation(BuildingSlot, parent.upperWallSlots));
        }
        else {
            if (parent &&
                parent.isSlotOccupied(parent.occupiedWallSlots, (0, utils_1.getConstructionSlotId)(BuildingSlot))) {
                this.placementError(client, enums_1.ConstructionErrors.OVERLAP);
                return false;
            }
            (position = parent.getSlotPosition(BuildingSlot, parent.wallSlots)),
                (rotation = parent.getSlotRotation(BuildingSlot, parent.wallSlots));
        }
        if (!position || !rotation) {
            this.placementError(client, enums_1.ConstructionErrors.UNKNOWN_SLOT);
            return false;
        }
        const characterId = this.generateGuid(), transientId = 1, // dont think its needed
        wall = new constructionchildentity_1.ConstructionChildEntity(characterId, transientId, modelId, position, rotation, this, itemDefinitionId, parentObjectCharacterId, BuildingSlot);
        parent.setWallSlot(this, wall);
        this._constructionSimple[characterId] = wall;
        this.executeFuncForAllReadyClientsInRange((client) => {
            this.spawnSimpleConstruction(client, wall);
        }, wall);
        return true;
    }
    placeConstructionRamp(client, itemDefinitionId, modelId, parentObjectCharacterId, BuildingSlot) {
        const parentFoundation = this._constructionFoundations[parentObjectCharacterId];
        if (!Number(parentObjectCharacterId) || !parentFoundation) {
            this.placementError(client, enums_1.ConstructionErrors.UNKNOWN_PARENT);
            return false;
        }
        if (parentFoundation &&
            parentFoundation.isSlotOccupied(parentFoundation.occupiedRampSlots, (0, utils_1.getConstructionSlotId)(BuildingSlot))) {
            this.placementError(client, enums_1.ConstructionErrors.OVERLAP);
            return false;
        }
        if (!parentFoundation.isRampSlotValid(BuildingSlot, itemDefinitionId)) {
            this.placementError(client, enums_1.ConstructionErrors.UNKNOWN_SLOT);
            return false;
        }
        const position = parentFoundation.getSlotPosition(BuildingSlot, parentFoundation.rampSlots), rotation = parentFoundation.getSlotRotation(BuildingSlot, parentFoundation.rampSlots);
        if (!position || !rotation) {
            this.placementError(client, enums_1.ConstructionErrors.UNKNOWN_SLOT);
            return false;
        }
        const characterId = this.generateGuid(), transientId = 1, // dont think its needed
        ramp = new constructionchildentity_1.ConstructionChildEntity(characterId, transientId, modelId, position, rotation, this, itemDefinitionId, parentObjectCharacterId, BuildingSlot);
        parentFoundation.setRampSlot(ramp);
        this._constructionSimple[characterId] = ramp;
        this.executeFuncForAllReadyClientsInRange((client) => {
            this.spawnSimpleConstruction(client, ramp);
        }, ramp);
        return true;
    }
    placeConstructionStairs(client, itemDefinitionId, modelId, rotation, parentObjectCharacterId, BuildingSlot) {
        const parentFoundation = this._constructionFoundations[parentObjectCharacterId];
        if (!Number(parentObjectCharacterId) || !parentFoundation) {
            this.placementError(client, enums_1.ConstructionErrors.UNKNOWN_PARENT);
            return false;
        }
        if (parentFoundation &&
            parentFoundation.isSlotOccupied(parentFoundation.occupiedRampSlots, (0, utils_1.getConstructionSlotId)(BuildingSlot))) {
            this.placementError(client, enums_1.ConstructionErrors.OVERLAP);
            return false;
        }
        if (!parentFoundation.isRampSlotValid(BuildingSlot, itemDefinitionId)) {
            this.placementError(client, enums_1.ConstructionErrors.UNKNOWN_SLOT);
            return false;
        }
        const position = parentFoundation.getSlotPosition(BuildingSlot, parentFoundation.rampSlots);
        if (!position) {
            this.placementError(client, enums_1.ConstructionErrors.UNKNOWN_SLOT);
            return false;
        }
        // rotation is not slot-locked yet
        const characterId = this.generateGuid(), transientId = 1, // dont think its needed
        stairs = new constructionchildentity_1.ConstructionChildEntity(characterId, transientId, modelId, position, new Float32Array([rotation[0], 0, 0]), this, itemDefinitionId, parentObjectCharacterId, BuildingSlot);
        parentFoundation.setRampSlot(stairs);
        this._constructionSimple[characterId] = stairs;
        this.executeFuncForAllReadyClientsInRange((client) => {
            this.spawnSimpleConstruction(client, stairs);
        }, stairs);
        return true;
    }
    placeConstructionDoor(client, itemDefinitionId, modelId, parentObjectCharacterId, BuildingSlot) {
        const parent = this._constructionFoundations[parentObjectCharacterId] ||
            this._constructionSimple[parentObjectCharacterId];
        if (!Number(parentObjectCharacterId) || !parent) {
            this.placementError(client, enums_1.ConstructionErrors.UNKNOWN_PARENT);
            return false;
        }
        if (parent &&
            parent.isSlotOccupied(parent.occupiedWallSlots, (0, utils_1.getConstructionSlotId)(BuildingSlot))) {
            this.placementError(client, enums_1.ConstructionErrors.OVERLAP);
            return false;
        }
        if (!parent.isWallSlotValid(BuildingSlot, itemDefinitionId)) {
            this.placementError(client, enums_1.ConstructionErrors.UNKNOWN_SLOT);
            return false;
        }
        const position = parent.getSlotPosition(BuildingSlot, parent.wallSlots), rotation = parent.getSlotRotation(BuildingSlot, parent.wallSlots);
        if (!position || !rotation) {
            this.placementError(client, enums_1.ConstructionErrors.UNKNOWN_SLOT);
            return false;
        }
        const characterId = this.generateGuid(), transientId = this.getTransientId(characterId), door = new constructiondoor_1.ConstructionDoor(characterId, transientId, modelId, position, rotation, this, itemDefinitionId, client.character.characterId, parentObjectCharacterId, BuildingSlot);
        parent.setWallSlot(this, door);
        this._constructionDoors[characterId] = door;
        this.executeFuncForAllReadyClientsInRange((client) => {
            this.spawnConstructionDoor(client, door);
        }, door);
        return true;
    }
    placeConstructionFoundation(client, itemDefinitionId, modelId, position, rotation, parentObjectCharacterId, BuildingSlot) {
        if (itemDefinitionId == enums_1.Items.FOUNDATION_EXPANSION &&
            (!parentObjectCharacterId || !BuildingSlot)) {
            // prevent expansions from being placed without a deck if client check is bypassed
            return false;
        }
        if (BuildingSlot &&
            this._constructionFoundations[parentObjectCharacterId]
                ?.occupiedExpansionSlots[(0, utils_1.getConstructionSlotId)(BuildingSlot)]) {
            this.placementError(client, enums_1.ConstructionErrors.OVERLAP);
            return false;
        }
        const parentFoundation = this._constructionFoundations[parentObjectCharacterId];
        if (Number(parentObjectCharacterId) && !parentFoundation) {
            this.placementError(client, enums_1.ConstructionErrors.UNKNOWN_PARENT);
            return false;
        }
        if (parentFoundation && BuildingSlot) {
            if (parentFoundation &&
                parentFoundation.isSlotOccupied(parentFoundation.occupiedExpansionSlots, (0, utils_1.getConstructionSlotId)(BuildingSlot))) {
                this.placementError(client, enums_1.ConstructionErrors.OVERLAP);
                return false;
            }
            if (!parentFoundation.isExpansionSlotValid(BuildingSlot, itemDefinitionId)) {
                this.placementError(client, enums_1.ConstructionErrors.UNKNOWN_SLOT);
                return false;
            }
            const pos = parentFoundation.getSlotPosition(BuildingSlot || "", parentFoundation.expansionSlots), rot = parentFoundation.getSlotRotation(BuildingSlot || "", parentFoundation.expansionSlots);
            if (!pos || !rot) {
                this.placementError(client, enums_1.ConstructionErrors.UNKNOWN_SLOT);
                return false;
            }
            position = pos;
            rotation = rot;
        }
        const characterId = this.generateGuid(), transientId = this.getTransientId(characterId), npc = new constructionparententity_1.ConstructionParentEntity(characterId, transientId, modelId, position, rotation, this, itemDefinitionId, client.character.characterId, client.character.name || "", parentObjectCharacterId, BuildingSlot);
        if (parentFoundation && BuildingSlot) {
            parentFoundation.setExpansionSlot(npc);
            npc.permissions = parentFoundation.permissions;
        }
        this._constructionFoundations[characterId] = npc;
        this.executeFuncForAllReadyClientsInRange((client) => {
            this.spawnConstructionParent(client, npc);
        }, npc);
        return true;
    }
    placeTemporaryEntity(modelId, position, rotation, time) {
        const characterId = this.generateGuid(), transientId = 1, // dont think its needed
        npc = new temporaryentity_1.TemporaryEntity(characterId, transientId, modelId, position, rotation, this);
        npc.setDespawnTimer(this, time);
        this._temporaryObjects[characterId] = npc;
        return true;
    }
    placeTrap(itemDefinitionId, modelId, position, rotation) {
        const characterId = this.generateGuid(), transientId = 1, // dont think its needed here
        npc = new trapentity_1.TrapEntity(characterId, transientId, modelId, position, new Float32Array([0, rotation[0], 0]), this, itemDefinitionId);
        npc.arm(this);
        this._traps[characterId] = npc;
        return true;
    }
    placeExplosiveEntity(itemDefinitionId, modelId, position, rotation) {
        const characterId = this.generateGuid(), transientId = 1, // dont think its needed
        npc = new explosiveentity_1.ExplosiveEntity(characterId, transientId, modelId, position, rotation, this, itemDefinitionId);
        if (npc.isLandmine()) {
            npc.arm(this);
        }
        this._explosives[characterId] = npc;
        return true;
    }
    // used by multiple construction classes that don't extend each other
    undoPlacementInteractionString(entity, client) {
        this.sendData(client, "Command.InteractionString", {
            guid: entity.characterId,
            stringId: enums_1.StringIds.UNDO_PLACEMENT,
        });
    }
    placeLootableConstruction(client, itemDefinitionId, modelId, position, rotation, parentObjectCharacterId) {
        const characterId = this.generateGuid(), transientId = this.getTransientId(characterId);
        const obj = new lootableconstructionentity_1.LootableConstructionEntity(characterId, transientId, modelId, position, rotation, this, itemDefinitionId, parentObjectCharacterId || "", "");
        const parent = obj.getParent(this);
        if (parent) {
            this._lootableConstruction[characterId] = obj;
            parent.addFreeplaceConstruction(obj);
        }
        else {
            this._worldLootableConstruction[characterId] = obj;
        }
        obj.equipLoadout(this);
        this.executeFuncForAllReadyClientsInRange((client) => {
            this.spawnLootableConstruction(client, obj);
        }, obj);
        return true;
    }
    placeSmeltingEntity(client, itemDefinitionId, modelId, position, rotation, parentObjectCharacterId) {
        const characterId = this.generateGuid(), transientId = this.getTransientId(characterId);
        const obj = new lootableconstructionentity_1.LootableConstructionEntity(characterId, transientId, modelId, position, rotation, this, itemDefinitionId, parentObjectCharacterId || "", "SmeltingEntity");
        const parent = obj.getParent(this);
        if (parent) {
            this._lootableConstruction[characterId] = obj;
            parent.addFreeplaceConstruction(obj);
        }
        else {
            this._worldLootableConstruction[characterId] = obj;
        }
        obj.equipLoadout(this);
        this.executeFuncForAllReadyClientsInRange((client) => {
            this.spawnLootableConstruction(client, obj);
        }, obj);
        return true;
    }
    placeCollectingEntity(client, itemDefinitionId, modelId, position, rotation, parentObjectCharacterId) {
        const characterId = this.generateGuid(), transientId = this.getTransientId(characterId);
        const obj = new lootableconstructionentity_1.LootableConstructionEntity(characterId, transientId, modelId, position, rotation, this, itemDefinitionId, parentObjectCharacterId || "", "CollectingEntity");
        const parent = obj.getParent(this);
        if (parent) {
            this._lootableConstruction[characterId] = obj;
            parent.addFreeplaceConstruction(obj);
        }
        else {
            this._worldLootableConstruction[characterId] = obj;
        }
        obj.equipLoadout(this);
        this.executeFuncForAllReadyClientsInRange((client) => {
            this.spawnLootableConstruction(client, obj);
        }, obj);
        return true;
    }
    placePlantingDiameter(modelId, position, rotation) {
        const characterId = this.generateGuid(), transientId = 1;
        const obj = new plantingdiameter_1.PlantingDiameter(characterId, transientId, modelId, position, (0, utils_1.eul2quat)(rotation), this);
        this._temporaryObjects[characterId] = obj;
        return true;
    }
    placePlantOnDiameter(modelId, position, rotation, slot, parentObjectCharacterId, itemDefinitionId) {
        const item = this.generateItem(itemDefinitionId);
        if (!item)
            return false;
        const characterId = this.generateGuid(), transientId = this.getTransientId(characterId);
        if (!this._temporaryObjects[parentObjectCharacterId])
            return false;
        const parent = this._temporaryObjects[parentObjectCharacterId];
        if (parent.seedSlots[slot]) {
            return false;
        }
        const obj = new plant_1.Plant(characterId, transientId, modelId, position, (0, utils_1.eul2quat)(rotation), this, 0, item, parentObjectCharacterId, slot);
        parent.seedSlots[slot] = obj;
        this._plants[characterId] = obj;
        return true;
    }
    mountVehicle(client, vehicleGuid) {
        const vehicle = this._vehicles[vehicleGuid];
        if (!vehicle)
            return;
        if (client.hudTimer != null) {
            clearTimeout(client.hudTimer);
            client.hudTimer = null;
        }
        client.character.isRunning = false; // maybe some async stuff make this useless need to test that
        client.vehicle.mountedVehicle = vehicle.characterId;
        const seatId = vehicle.getNextSeatId(this), seat = vehicle.seats[seatId], passenger = this._characters[seat];
        if (seatId < 0)
            return; // no available seats in vehicle
        if (passenger) {
            // dismount the driver
            const client = this.getClientByCharId(passenger.characterId);
            !client || this.dismountVehicle(client);
        }
        vehicle.seats[seatId] = client.character.characterId;
        if (seatId === "0") {
            this.takeoverManagedObject(client, vehicle);
            if (vehicle._resources[enums_1.ResourceIds.FUEL] > 0) {
                this.sendDataToAllWithSpawnedEntity(this._vehicles, vehicleGuid, "Vehicle.Engine", {
                    guid2: vehicleGuid,
                    engineOn: true,
                });
                this._vehicles[vehicleGuid].engineOn = true;
                if (!this._vehicles[vehicleGuid].resourcesUpdater) {
                    this._vehicles[vehicleGuid].resourcesUpdater = setTimeout(() => {
                        if (!this._vehicles[vehicleGuid]) {
                            return;
                        }
                        if (!this._vehicles[vehicleGuid].engineOn) {
                            delete this._vehicles[vehicleGuid].resourcesUpdater;
                            return;
                        }
                        if (this._vehicles[vehicleGuid].engineRPM) {
                            const fuelLoss = this._vehicles[vehicleGuid].engineRPM * 0.003;
                            this._vehicles[vehicleGuid]._resources[enums_1.ResourceIds.FUEL] -=
                                fuelLoss;
                        }
                        if (this._vehicles[vehicleGuid]._resources[enums_1.ResourceIds.FUEL] < 0) {
                            this._vehicles[vehicleGuid]._resources[enums_1.ResourceIds.FUEL] = 0;
                        }
                        if (this._vehicles[vehicleGuid].engineOn &&
                            this._vehicles[vehicleGuid]._resources[enums_1.ResourceIds.FUEL] <= 0) {
                            this.sendDataToAllWithSpawnedEntity(this._vehicles, vehicleGuid, "Vehicle.Engine", {
                                guid2: vehicleGuid,
                                engineOn: false,
                            });
                        }
                        this.updateResourceToAllWithSpawnedEntity(vehicle.characterId, vehicle._resources[enums_1.ResourceIds.FUEL], enums_1.ResourceIds.FUEL, enums_1.ResourceTypes.FUEL, this._vehicles);
                        this._vehicles[vehicleGuid].resourcesUpdater.refresh();
                    }, 3000);
                }
            }
            this.sendDataToAllWithSpawnedEntity(this._characters, client.character.characterId, "Vehicle.Owner", {
                guid: vehicle.characterId,
                characterId: client.character.characterId,
                unknownDword1: 0,
                vehicleId: vehicle.vehicleId,
                passengers: [
                    {
                        characterId: client.character.characterId,
                        identity: {
                            characterName: client.character.name,
                        },
                        unknownString1: "",
                        unknownByte1: 1,
                    },
                ],
            });
            if (vehicle.getContainer()) {
                client.character.mountContainer(this, vehicle);
            }
        }
        this.sendDataToAllWithSpawnedEntity(this._vehicles, vehicleGuid, "Mount.MountResponse", {
            // mounts character
            characterId: client.character.characterId,
            vehicleGuid: vehicle.characterId,
            seatId: Number(seatId),
            isDriver: seatId === "0" ? 1 : 0,
            identity: {},
        });
        // this is broken for some reason
        /*this.initializeContainerList(client, vehicle);
    
        if (seatId === "0") {
          const inventory = Object.values(vehicle._containers)[0];
          this.sendData(client, "Vehicle.InventoryItems", {
            characterId: vehicle.characterId,
            itemsData: {
              items: Object.values(inventory).map((item) => {
                return vehicle.pGetItemData(
                  this,
                  item,
                  inventory.containerDefinitionId
                );
              }),
              unknownDword1: inventory.containerDefinitionId,
            },
          });
          /*
          this.sendData(client, "AccessedCharacter.BeginCharacterAccess", {
            objectCharacterId: vehicle.characterId,
            containerGuid: inventory?.itemGuid,
            unknownBool1: false,
            itemsData: {
              items: Object.values(inventory).map((item) => {
                return vehicle.pGetItemData(
                  item,
                  inventory.containerDefinitionId
                )
              }),
              unknownDword1: inventory.containerDefinitionId,
            },
          });
          */
        //}
        this.sendData(client, "Vehicle.Occupy", {
            guid: vehicle.characterId,
            characterId: client.character.characterId,
            vehicleId: vehicle.vehicleId,
            clearLoadout: 0,
            unknownArray1: [
                {
                    unknownDword1: 0,
                    unknownBoolean1: 0,
                },
            ],
            passengers: [
                {
                    characterId: client.character.characterId,
                    identity: {
                        characterName: client.character.name,
                    },
                },
            ],
            unknownArray2: [{}],
        });
    }
    dismountVehicle(client) {
        if (!client.vehicle.mountedVehicle)
            return;
        const vehicle = this._vehicles[client.vehicle.mountedVehicle];
        if (!vehicle) {
            // return if vehicle doesnt exist
            this.sendData(client, "Mount.DismountResponse", {
                characterId: client.character.characterId,
            });
            return;
        }
        const seatId = vehicle.getCharacterSeat(client.character.characterId);
        client.character.vehicleExitDate = new Date().getTime();
        if (!seatId)
            return;
        if (vehicle.vehicleId == enums_1.VehicleIds.SPECTATE) {
            this.sendData(client, "Mount.DismountResponse", {
                characterId: client.character.characterId,
            });
            this.deleteEntity(vehicle.characterId, this._vehicles);
            return;
        }
        vehicle.seats[seatId] = "";
        this.sendDataToAllWithSpawnedEntity(this._vehicles, client.vehicle.mountedVehicle, "Mount.DismountResponse", {
            characterId: client.character.characterId,
        });
        if (seatId === "0") {
            this.sendDataToAllWithSpawnedEntity(this._vehicles, client.vehicle.mountedVehicle, "Vehicle.Engine", {
                // stops engine
                guid2: client.vehicle.mountedVehicle,
                engineOn: false,
            });
            vehicle.engineOn = false;
        }
        client.vehicle.mountedVehicle = "";
        this.sendData(client, "Vehicle.Occupy", {
            guid: "",
            characterId: client.character.characterId,
            vehicleId: 0,
            clearLoadout: 1,
            unknownArray1: [
                {
                    unknownDword1: 0,
                    unknownBoolean1: 0,
                },
            ],
            passengers: [],
            unknownArray2: [],
        });
        this.sendDataToAllWithSpawnedEntity(this._characters, client.character.characterId, "Vehicle.Owner", {
            guid: vehicle.characterId,
            characterId: client.character.characterId,
            unknownDword1: 0,
            vehicleId: 0,
            passengers: [
                {
                    characterId: client.character.characterId,
                    identity: {
                        characterName: client.character.name,
                    },
                    unknownString1: "",
                    unknownByte1: 1,
                },
            ],
        });
        client.character.dismountContainer(this);
    }
    changeSeat(client, packet) {
        if (!client.vehicle.mountedVehicle)
            return;
        const vehicle = this._vehicles[client.vehicle.mountedVehicle];
        if (!vehicle)
            return;
        const seatCount = vehicle.getSeatCount(), oldSeatId = vehicle.getCharacterSeat(client.character.characterId);
        const seatId = packet.data.seatId, seat = vehicle.seats[seatId], passenger = this._characters[seat];
        if (seatId < seatCount &&
            (!vehicle.seats[seatId] || !passenger?.isAlive) &&
            oldSeatId) {
            if (passenger && !passenger?.isAlive) {
                const client = this.getClientByCharId(passenger.characterId);
                !client || this.dismountVehicle(client);
            }
            this.sendDataToAllWithSpawnedEntity(this._vehicles, client.vehicle.mountedVehicle, "Mount.SeatChangeResponse", {
                characterId: client.character.characterId,
                vehicleGuid: vehicle.characterId,
                identity: {},
                seatId: packet.data.seatId,
                unknownDword2: packet.data.seatId === 0 ? 1 : 0, // if set to 1 the select character will have drive access
            });
            vehicle.seats[oldSeatId] = "";
            vehicle.seats[packet.data.seatId] = client.character.characterId;
            if (oldSeatId === "0") {
                this.sendDataToAllWithSpawnedEntity(this._vehicles, client.vehicle.mountedVehicle, "Vehicle.Engine", {
                    // stops engine
                    guid2: client.vehicle.mountedVehicle,
                    engineOn: false,
                });
                client.character.dismountContainer(this);
            }
            if (packet.data.seatId === 0) {
                this.takeoverManagedObject(client, vehicle);
                this.sendDataToAllWithSpawnedEntity(this._vehicles, client.vehicle.mountedVehicle, "Vehicle.Engine", {
                    // stops engine
                    guid2: client.vehicle.mountedVehicle,
                    engineOn: true,
                });
                if (vehicle.getContainer()) {
                    client.character.mountContainer(this, vehicle);
                }
            }
        }
    }
    //#endregion
    startTimer(client, stringId, time) {
        this.sendData(client, "ClientUpdate.StartTimer", {
            stringId: stringId,
            time: time,
        });
    }
    reloadInterrupt(client, weaponItem) {
        if (!weaponItem.weapon?.reloadTimer)
            return;
        client.character.clearReloadTimeout();
        this.sendWeaponData(client, "Weapon.Reload", {
            weaponGuid: weaponItem.itemGuid,
            unknownDword1: weaponItem.weapon.ammoCount,
            ammoCount: weaponItem.weapon.ammoCount,
            unknownDword3: weaponItem.weapon.ammoCount,
            currentReloadCount: (0, utils_1.toHex)(++weaponItem.weapon.currentReloadCount),
        });
        this.sendRemoteWeaponUpdateDataToAllOthers(client, client.character.transientId, weaponItem.itemGuid, "Update.ReloadInterrupt", {});
    }
    combatLog(client) {
        if (!client.character.getCombatLog().length) {
            this.sendChatText(client, "No combatlog info available");
            return;
        }
        const combatlog = client.character.getCombatLog();
        this.sendChatText(client, "---------------------------------COMBATLOG:--------------------------------");
        this.sendChatText(client, `TIME | SOURCE | TARGET | WEAPON | DISTANCE | HITLOCATION | HITPOSITION | OLD HP | NEW HP | PING | ENEMY PING`);
        combatlog.forEach((e) => {
            const time = `${((Date.now() - e.hitInfo.timestamp) / 1000).toFixed(1)}s`, source = e.source.name == client.character.name
                ? "YOU"
                : e.source.name || "undefined", target = e.target.name == client.character.name
                ? "YOU"
                : e.target.name || "undefined", hitPosition = `[${e.hitInfo.hitPosition[0].toFixed(0)}, ${e.hitInfo.hitPosition[1].toFixed(0)}, ${e.hitInfo.hitPosition[2].toFixed(0)}]`, oldHp = (e.hitInfo.oldHP / 100).toFixed(1), newHp = (e.hitInfo.newHP / 100).toFixed(1), ping = `${e.source.name == client.character.name ? e.source.ping : e.target.ping}ms`, enemyPing = `${e.source.name == client.character.name ? e.target.ping : e.source.ping}ms`;
            this.sendChatText(client, `${time} ${source} ${target} ${this.getItemDefinition(e.hitInfo.weapon).MODEL_NAME || "N/A"} ${e.hitInfo.distance}m ${e.hitInfo.hitLocation} ${hitPosition} ${oldHp} ${newHp} ${ping} ${enemyPing}`);
        });
        this.sendChatText(client, "---------------------------------------------------------------------------------");
    }
    //#region ********************INVENTORY********************   } }
    addItem(client, item, containerDefinitionId, character = client.character) {
        if (client.character.characterId == character.characterId &&
            !client.character.initialized)
            return;
        this.sendData(client, "ClientUpdate.ItemAdd", {
            characterId: client.character.characterId,
            data: character.pGetItemData(this, item, containerDefinitionId),
        });
    }
    equipContainerItem(client, item, slotId) {
        // equips an existing item from a container
        if (client.character._containers[slotId] &&
            utils_1._.size(client.character._containers[slotId].items) != 0) {
            this.sendChatText(client, "[ERROR] Container must be empty to unequip!");
            return;
        }
        const oldLoadoutItem = client.character._loadout[slotId], container = client.character.getItemContainer(item.itemGuid);
        if ((!oldLoadoutItem || !oldLoadoutItem.itemDefinitionId) && !container) {
            this.containerError(client, enums_1.ContainerErrors.UNKNOWN_CONTAINER);
            return;
        }
        if (!this.removeContainerItem(client.character, item, container, 1)) {
            this.containerError(client, enums_1.ContainerErrors.NO_ITEM_IN_SLOT);
            return;
        }
        if (oldLoadoutItem?.itemDefinitionId) {
            // if target loadoutSlot is occupied
            if (oldLoadoutItem.itemGuid == item.itemGuid) {
                this.sendChatText(client, "[ERROR] Item is already equipped!");
                return;
            }
            if (!this.removeLoadoutItem(client, oldLoadoutItem.slotId)) {
                this.containerError(client, enums_1.ContainerErrors.NO_ITEM_IN_SLOT);
                return;
            }
            client.character.lootContainerItem(this, oldLoadoutItem, undefined, false);
        }
        client.character.equipItem(this, item, true, slotId);
    }
    generateRandomEquipmentsFromAnEntity(entity, slots, excludedModels = []) {
        slots.forEach((slot) => {
            entity._equipment[slot] = this.generateRandomEquipmentForSlot(slot, entity.gender, excludedModels);
        });
    }
    generateRandomEquipmentForSlot(slotId, gender, excludedModels = []) {
        const models = equipmentModelTexturesMapping[slotId];
        if (excludedModels.length) {
            for (const model in models) {
                if (excludedModels.includes(model)) {
                    delete models[model];
                }
            }
        }
        const model = (0, utils_1.getRandomKeyFromAnObject)(models);
        const skins = equipmentModelTexturesMapping[slotId][model];
        let skin;
        if (skins) {
            skin = (0, utils_1.getRandomFromArray)(skins);
        }
        else {
            skin = "";
        }
        return {
            modelName: model.replace("<gender>", gender == 1 ? "Male" : "Female"),
            slotId,
            textureAlias: skin,
            guid: (0, utils_1.toBigHex)(this.generateItemGuid()),
        };
    }
    /**
     * Gets the item definition for a given itemDefinitionId
     * @param itemDefinitionId The id of the itemdefinition to retrieve.
     */
    getItemDefinition(itemDefinitionId) {
        if (!itemDefinitionId)
            return;
        return this._itemDefinitions[itemDefinitionId];
    }
    /**
     * Gets the weapon definition for a given weaponDefinitionId.
     * @param weaponDefinitionId The id of the weapondefinition to retrieve.
     */
    getWeaponDefinition(weaponDefinitionId) {
        if (!weaponDefinitionId)
            return;
        return this._weaponDefinitions[weaponDefinitionId]?.DATA;
    }
    /**
     * Gets the firegroup definition for a given firegroupId.
     * @param firegroupId The id of the firegroupDefinition to retrieve.
     */
    getFiregroupDefinition(firegroupId) {
        return this._firegroupDefinitions[firegroupId]?.DATA;
    }
    /**
     * Gets the firemode definition for a given firemodeId.
     * @param firemodeId The id of the firemodeDefinition to retrieve.
     */
    getFiremodeDefinition(firemodeId) {
        return this._firemodeDefinitions[firemodeId]?.DATA.DATA;
    }
    /**
     * Gets the ammoId for a given weapon.
     * @param itemDefinitionId The itemDefinitionId of the weapon.
     */
    getWeaponAmmoId(itemDefinitionId) {
        const itemDefinition = this.getItemDefinition(itemDefinitionId), weaponDefinition = this.getWeaponDefinition(itemDefinition?.PARAM1), firegroupDefinition = this.getFiregroupDefinition(weaponDefinition?.FIRE_GROUPS[0]?.FIRE_GROUP_ID), firemodeDefinition = this.getFiremodeDefinition(firegroupDefinition?.FIRE_MODES[0]?.FIRE_MODE_ID);
        return firemodeDefinition?.AMMO_ITEM_ID || 0;
    }
    /**
     * Gets the reload time in ms for a given weapon.
     * @param itemDefinitionId The itemDefinitionId of the weapon.
     */
    getWeaponReloadTime(itemDefinitionId) {
        const itemDefinition = this.getItemDefinition(itemDefinitionId), weaponDefinition = this.getWeaponDefinition(itemDefinition?.PARAM1), firegroupDefinition = this.getFiregroupDefinition(weaponDefinition?.FIRE_GROUPS[0]?.FIRE_GROUP_ID), firemodeDefinition = this.getFiremodeDefinition(firegroupDefinition?.FIRE_MODES[0]?.FIRE_MODE_ID);
        return firemodeDefinition?.RELOAD_TIME_MS || 0;
    }
    /**
     * Gets the clip size for a given weapon.
     * @param itemDefinitionId The itemDefinitionId of the weapon.
     */
    getWeaponClipSize(itemDefinitionId) {
        const itemDefinition = this.getItemDefinition(itemDefinitionId), weaponDefinition = this.getWeaponDefinition(itemDefinition?.PARAM1);
        return weaponDefinition.AMMO_SLOTS[0]?.CLIP_SIZE || 0;
    }
    /**
     * Gets the maximum amount of ammo a clip can hold for a given weapon.
     * @param itemDefinitionId The itemDefinitionId of the weapon.
     */
    getWeaponMaxAmmo(itemDefinitionId) {
        const itemDefinition = this.getItemDefinition(itemDefinitionId), weaponDefinition = this.getWeaponDefinition(itemDefinition?.PARAM1);
        return weaponDefinition.AMMO_SLOTS[0]?.CLIP_SIZE || 0;
    }
    /**
     * Gets the container definition for a given containerDefinitionId.
     * @param containerDefinitionId The id of the container definition to retrieve.
     */
    getContainerDefinition(containerDefinitionId) {
        if (this._containerDefinitions[containerDefinitionId]) {
            return this._containerDefinitions[containerDefinitionId];
        }
        else {
            debug(`Tried to get containerDefinition for invalid containerDefinitionId ${containerDefinitionId}`);
            return this._containerDefinitions[119];
        }
    }
    /**
     * Generates and returns an unused itemGuid.
     */
    generateItemGuid() {
        return ++this.lastItemGuid;
    }
    generateItem(itemDefinitionId, count = 1) {
        if (!this.getItemDefinition(itemDefinitionId)) {
            debug(`[ERROR] GenerateItem: Invalid item definition: ${itemDefinitionId}`);
            return;
        }
        const generatedGuid = (0, utils_1.toBigHex)(this.generateItemGuid());
        let durability = 2000;
        switch (true) {
            case this.isWeapon(itemDefinitionId):
                durability = 2000;
                break;
            case this.isArmor(itemDefinitionId):
                durability = 1000;
                break;
            case this.isHelmet(itemDefinitionId):
                durability = 100;
                break;
        }
        const itemData = new baseItem_1.BaseItem(itemDefinitionId, generatedGuid, durability, count);
        if (this.isWeapon(itemDefinitionId)) {
            itemData.weapon = new weapon_1.Weapon(itemData);
        }
        return itemData;
    }
    isWeapon(itemDefinitionId) {
        return this.getItemDefinition(itemDefinitionId)?.ITEM_TYPE == 20;
    }
    isContainer(itemDefinitionId) {
        return this.getItemDefinition(itemDefinitionId)?.ITEM_TYPE == 34;
    }
    isArmor(itemDefinitionId) {
        return (this.getItemDefinition(itemDefinitionId)?.DESCRIPTION_ID == 12073 ||
            this.getItemDefinition(itemDefinitionId)?.DESCRIPTION_ID == 11151);
    }
    isHelmet(itemDefinitionId) {
        return (this.getItemDefinition(itemDefinitionId)?.DESCRIPTION_ID == 9945 ||
            this.getItemDefinition(itemDefinitionId)?.DESCRIPTION_ID == 12994 ||
            this.getItemDefinition(itemDefinitionId)?.DESCRIPTION_ID == 9114 ||
            this.getItemDefinition(itemDefinitionId)?.DESCRIPTION_ID == 9945);
    }
    isStackable(itemDefinitionId) {
        return this.getItemDefinition(itemDefinitionId)?.MAX_STACK_SIZE > 1
            ? true
            : false;
    }
    validateEquipmentSlot(itemDefinitionId, equipmentSlotId) {
        // only for weapons at the moment
        if (!this.getItemDefinition(itemDefinitionId)?.FLAG_CAN_EQUIP)
            return false;
        return !!equipSlotItemClasses.find((slot) => slot.ITEM_CLASS ===
            this.getItemDefinition(itemDefinitionId).ITEM_CLASS &&
            equipmentSlotId === slot.EQUIP_SLOT_ID);
    }
    /**
     * Validates that a given itemDefinitionId can be equipped in a given loadout slot.
     * @param itemDefId The definition ID of an item to validate.
     * @param loadoutSlotId The loadoutSlotId to have the item validated for.
     * @returns Returns true/false if the item can go in a specified loadout slot.
     */
    validateLoadoutSlot(itemDefinitionId, loadoutSlotId, loadoutId) {
        if (!this.getItemDefinition(itemDefinitionId)?.FLAG_CAN_EQUIP)
            return false;
        return !!loadoutSlotItemClasses.find((slot) => slot.ITEM_CLASS ==
            this.getItemDefinition(itemDefinitionId).ITEM_CLASS &&
            loadoutSlotId == slot.SLOT &&
            slot.LOADOUT_ID == loadoutId);
    }
    /**
     * Gets the first loadout slot that a specified item is able to go into.
     * @param itemDefId The definition ID of an item to check.
     * @param loadoutId Optional: The loadoutId of the entity to get the slot for, default LoadoutIds.CHARACTER.
     * @returns Returns the ID of the first loadout slot that an item can go into (occupied or not).
     */
    getLoadoutSlot(itemDefId, loadoutId = enums_1.LoadoutIds.CHARACTER) {
        const itemDef = this.getItemDefinition(itemDefId), loadoutSlotItemClass = loadoutSlotItemClasses.find((slot) => slot.ITEM_CLASS == itemDef.ITEM_CLASS && loadoutId == slot.LOADOUT_ID);
        return loadoutSlotItemClass?.SLOT || 0;
    }
    switchLoadoutSlot(client, loadoutItem) {
        const oldLoadoutSlot = client.character.currentLoadoutSlot;
        this.reloadInterrupt(client, client.character._loadout[oldLoadoutSlot]);
        // remove passive equip
        this.clearEquipmentSlot(client, client.character.getActiveEquipmentSlot(loadoutItem));
        client.character.currentLoadoutSlot = loadoutItem.slotId;
        client.character.equipItem(this, loadoutItem, true, loadoutItem.slotId);
        // equip passive slot
        client.character.equipItem(this, client.character._loadout[oldLoadoutSlot], true, oldLoadoutSlot);
        if (loadoutItem.weapon)
            loadoutItem.weapon.currentReloadCount = 0;
    }
    /**
     * Clears a client's equipmentSlot.
     * @param client The client to have their equipment slot cleared.
     * @param equipmentSlotId The equipment slot to clear.
     * @returns Returns true if the slot was cleared, false if the slot is invalid.
     */
    clearEquipmentSlot(client, equipmentSlotId) {
        if (!equipmentSlotId)
            return false;
        delete client.character._equipment[equipmentSlotId];
        if (client.character.initialized) {
            this.sendDataToAllWithSpawnedEntity(this._characters, client.character.characterId, "Equipment.UnsetCharacterEquipmentSlot", {
                characterData: {
                    characterId: client.character.characterId,
                },
                slotId: equipmentSlotId,
            });
        }
        if (equipmentSlotId === enums_1.EquipSlots.RHAND) {
            client.character.currentLoadoutSlot = enums_1.LoadoutSlots.FISTS;
            client.character.equipItem(this, client.character._loadout[enums_1.LoadoutSlots.FISTS]); //equip fists
        }
        return true;
    }
    /**
     * Removes an item from the loadout.
     * @param client The client to have their items removed.
     * @param loadoutSlotId The loadout slot containing the item to remove.
     * @returns Returns true if the item was successfully removed, false if there was an error.
     */
    removeLoadoutItem(client, loadoutSlotId) {
        const item = client.character._loadout[loadoutSlotId], itemDefId = item?.itemDefinitionId; // save before item gets deleted
        if (!item || !itemDefId)
            return false;
        if (this.isWeapon(item.itemDefinitionId)) {
            this.sendRemoteWeaponDataToAllOthers(client, client.character.transientId, "RemoteWeapon.RemoveWeapon", {
                guid: item.itemGuid,
            });
        }
        this.deleteItem(client, item.itemGuid);
        delete client.character._loadout[loadoutSlotId];
        client.character.updateLoadout(this);
        this.clearEquipmentSlot(client, client.character.getActiveEquipmentSlot(item));
        this.checkConveys(client);
        if (this.getItemDefinition(itemDefId).ITEM_TYPE === 34) {
            delete client.character._containers[loadoutSlotId];
            this.initializeContainerList(client);
        }
        return true;
    }
    /**
     * Returns a client object by either the characterId of the passed character, or the mountedCharacterId if the passed character is a BaseLootableEntity.
     * @param character Either a Character or BaseLootableEntity to retrieve it's accessing client.
     * @returns Returns client or undefined.
     */
    getClientByContainerAccessor(character) {
        let client = this.getClientByCharId(character.characterId);
        if (!client && character instanceof baselootableentity_1.BaseLootableEntity) {
            client = this.getClientByCharId(character.mountedCharacter || "");
        }
        return client;
    }
    /**
     * Removes items from a specific item stack in a container.
     * @param client The client to have their items removed.
     * @param item The item object.
     * @param container The container that has the item stack in it.
     * @param requiredCount Optional: The number of items to remove from the stack, default 1.
     * @returns Returns true if the items were successfully removed, false if there was an error.
     */
    removeContainerItem(character, item, container, count) {
        if (item)
            item.debugFlag = "removeContainerItem";
        const client = this.getClientByContainerAccessor(character);
        if (!container || !item)
            return false;
        if (!count)
            count = item.stackCount;
        if (item.stackCount == count) {
            delete container.items[item.itemGuid];
            if (client)
                this.deleteItem(client, item.itemGuid);
        }
        else if (item.stackCount > count) {
            item.stackCount -= count;
            if (client)
                this.updateContainerItem(client, item, container);
        }
        else {
            // if count > removeItem.stackCount
            return false;
        }
        if (client)
            this.updateContainer(client, container);
        return true;
    }
    /**
     * Removes items from an specific item stack in the inventory, including containers and loadout.
     * @param client The client to have their items removed.
     * @param item The item object.
     * @param requiredCount Optional: The number of items to remove from the stack, default 1.
     * @returns Returns true if the items were successfully removed, false if there was an error.
     */
    removeInventoryItem(client, item, count = 1) {
        item.debugFlag = "removeInventoryItem";
        if (count > item.stackCount) {
            console.error(`RemoveInventoryItem: Not enough items in stack! Count ${count} > Stackcount ${item.stackCount}`);
            count = item.stackCount;
        }
        // external container
        if (client.character.mountedContainer &&
            client.character.mountedContainer.getContainer()?.items[item.itemGuid]) {
            return this.removeContainerItem(client.character, item, client.character.mountedContainer.getContainer(), count);
        }
        if (client.character._loadout[item.slotId]?.itemGuid == item.itemGuid) {
            return this.removeLoadoutItem(client, item.slotId);
        }
        else {
            return this.removeContainerItem(client.character, item, client.character.getItemContainer(item.itemGuid), count);
        }
    }
    /**
     * Removes a specified amount of an item across all inventory containers /
     * loadout (LOADOUT DISABLED FOR NOW).
     * @param client The client to have its items removed.
     * @param itemDefinitionId The itemDefinitionId of the item(s) to be removed.
     * @param requiredCount Optional: The number of items to remove, default 1.
     * @returns Returns true if all items were successfully removed, false if there was an error.
     */
    removeInventoryItems(client, itemDefinitionId, requiredCount = 1) {
        const loadoutSlotId = 0; //this.getActiveLoadoutSlot(client, itemDefinitionId);
        // loadout disabled for now
        if (client.character._loadout[loadoutSlotId]?.itemDefinitionId ==
            itemDefinitionId) {
            // todo: check multiple loadout slots for items
            return this.removeLoadoutItem(client, loadoutSlotId);
        }
        else {
            const removeItems = [];
            for (const container of Object.values(client.character._containers)) {
                if (!requiredCount)
                    break;
                for (const item of Object.values(container.items)) {
                    if (item.itemDefinitionId == itemDefinitionId) {
                        if (item.stackCount >= requiredCount) {
                            removeItems.push({ container, item, count: requiredCount });
                            requiredCount = 0;
                            break;
                        }
                        else {
                            removeItems.push({ container, item, count: item.stackCount });
                            requiredCount -= item.stackCount;
                        }
                    }
                }
            }
            if (requiredCount) {
                // inventory doesn't have enough items
                return false;
            }
            for (const itemStack of Object.values(removeItems)) {
                if (!this.removeContainerItem(client.character, itemStack.item, itemStack.container, itemStack.count)) {
                    return false;
                }
            }
            return true;
        }
    }
    /**
     * Removes a single item type from the inventory and spawns it on the ground
     * @param client The client to have its item dropped.
     * @param item The item object.
     * @param count Optional: The number of items to drop on the ground, default 1.
     */
    dropItem(client, item, count = 1) {
        item.debugFlag = "dropItem";
        if (!item) {
            this.containerError(client, enums_1.ContainerErrors.NO_ITEM_IN_SLOT);
            return;
        }
        let dropItem;
        if (item.stackCount == count) {
            dropItem = item;
        }
        else if (item.stackCount > count) {
            dropItem = this.generateItem(item.itemDefinitionId, count);
        }
        else {
            return;
        }
        if (!this.removeInventoryItem(client, item, count))
            return;
        this.sendData(client, "Character.DroppedIemNotification", {
            characterId: client.character.characterId,
            itemDefId: item.itemDefinitionId,
            count: count,
        });
        this.worldObjectManager.createLootEntity(this, dropItem, client.character.state.position, new Float32Array([0, Number(Math.random() * 10 - 5), 0, 1]));
    }
    pickupItem(client, guid) {
        const object = this._spawnedItems[guid], item = object.item;
        if (!item) {
            this.sendChatText(client, `[ERROR] Invalid item`);
            return;
        }
        this.sendCompositeEffectToAllWithSpawnedEntity(this._spawnedItems, object, this.getItemDefinition(item.itemDefinitionId).PICKUP_EFFECT ?? 5151);
        client.character.lootItem(this, item);
        if (item.itemDefinitionId === enums_1.Items.FUEL_BIOFUEL ||
            item.itemDefinitionId === enums_1.Items.FUEL_ETHANOL) {
            this.deleteEntity(object.characterId, this._explosives);
        }
        this.deleteEntity(guid, this._spawnedItems);
        delete this.worldObjectManager._spawnedLootObjects[object.spawnerId];
    }
    deleteItem(client, itemGuid) {
        if (!client.character.initialized)
            return;
        this.sendData(client, "ClientUpdate.ItemDelete", {
            characterId: client.character.characterId,
            itemGuid: itemGuid,
        });
    }
    initializeContainerList(client, character = client.character) {
        this.sendData(client, "Container.InitEquippedContainers", {
            ignore: character.characterId,
            characterId: character.characterId,
            containers: character.pGetContainers(this),
        });
    }
    updateContainer(client, container) {
        if (!container || !client.character.initialized)
            return;
        this.sendData(client, "Container.UpdateEquippedContainer", {
            ignore: client.character.characterId,
            characterId: client.character.characterId,
            containerData: client.character.pGetContainerData(this, container),
        });
    }
    addContainerItem(character, item, container, count, sendUpdate = true) {
        if (!item)
            return;
        const itemDefId = item.itemDefinitionId, client = this.getClientByCharId(character.characterId);
        container.items[item.itemGuid] = {
            ...item,
            slotId: Object.keys(container.items).length,
            containerGuid: container.itemGuid,
            stackCount: count,
        };
        if (!client)
            return;
        this.addItem(client, container.items[item.itemGuid], container.containerDefinitionId);
        this.updateContainer(client, container);
        if (sendUpdate && client.character.initialized) {
            this.sendData(client, "Reward.AddNonRewardItem", {
                itemDefId: itemDefId,
                iconId: this.getItemDefinition(itemDefId).IMAGE_SET_ID,
                count: count,
            });
        }
    }
    updateLoadoutItem(client, item) {
        this.sendData(client, "ClientUpdate.ItemUpdate", {
            characterId: client.character.characterId,
            data: client.character.pGetItemData(this, item, 101),
        });
        //this.updateLoadout(client.character);
    }
    addContainerItemExternal(characterId, item, container, count) {
        if (!item)
            return;
        let addItem = false;
        let itemAssigned = false;
        const client = this.getClientByCharId(characterId);
        Object.values(container.items).forEach((containerItem) => {
            // item stacking
            if (itemAssigned)
                return;
            if (containerItem.itemDefinitionId == item.itemDefinitionId) {
                const addedValue = containerItem.stackCount + item.stackCount;
                if (addedValue >
                    this.getItemDefinition(item.itemDefinitionId).MAX_STACK_SIZE) {
                    containerItem.stackCount = this.getItemDefinition(item.itemDefinitionId).MAX_STACK_SIZE;
                    container.items[item.itemGuid] = {
                        ...item,
                        slotId: Object.keys(container.items).length,
                        containerGuid: container.itemGuid,
                        stackCount: addedValue -
                            this.getItemDefinition(item.itemDefinitionId).MAX_STACK_SIZE,
                    };
                    addItem = true;
                    itemAssigned = true;
                    if (!client)
                        return;
                    this.updateContainerItem(client, containerItem, container);
                }
                else {
                    containerItem.stackCount = addedValue;
                    itemAssigned = true;
                    if (!client)
                        return;
                    this.updateContainerItem(client, containerItem, container);
                }
            }
        });
        if (!itemAssigned) {
            container.items[item.itemGuid] = {
                ...item,
                slotId: Object.keys(container.items).length,
                containerGuid: container.itemGuid,
                stackCount: count,
            };
        }
        if (!client)
            return;
        if (addItem || !itemAssigned) {
            this.addItem(client, container.items[item.itemGuid], container.containerDefinitionId);
        }
        this.updateContainer(client, container);
    }
    updateContainerItem(client, item, container) {
        if (!container || !client.character.initialized)
            return;
        this.sendData(client, "ClientUpdate.ItemUpdate", {
            characterId: client.character.characterId,
            data: client.character.pGetItemData(this, item, container.containerDefinitionId),
        });
        this.updateContainer(client, container);
    }
    /**
     * Clears all items from a character's inventory.
     * @param client The client that'll have it's character's inventory cleared.
     */
    clearInventory(client) {
        for (const item of Object.values(client.character._loadout)) {
            if (client.character._containers[item.slotId]) {
                const container = client.character._containers[item.slotId];
                for (const item of Object.values(container.items)) {
                    this.removeInventoryItem(client, item, item.stackCount);
                }
            }
            if (item.slotId != enums_1.LoadoutSlots.FISTS && item.itemDefinitionId) {
                this.removeInventoryItem(client, item, item.stackCount);
            }
        }
    }
    isAdminItem(itemDefinitionId) {
        switch (itemDefinitionId) {
            case enums_1.Items.WEAPON_REMOVER:
            case enums_1.Items.FANNY_PACK_DEV:
                return true;
            default:
                return false;
        }
    }
    useConsumable(client, item) {
        const itemDef = this.getItemDefinition(item.itemDefinitionId);
        if (!itemDef)
            return;
        let doReturn = true;
        let drinkCount = 0;
        let eatCount = 0;
        let staminaCount = 0;
        let givetrash = 0;
        let healCount = 0;
        let bandagingCount = 0;
        let timeout = 0;
        for (const a in useoptions_1.UseOptions) {
            if (useoptions_1.UseOptions[a].itemDef == item.itemDefinitionId &&
                (useoptions_1.UseOptions[a].type == enums_1.ItemUseOptions.EAT ||
                    useoptions_1.UseOptions[a].type == enums_1.ItemUseOptions.DRINK ||
                    useoptions_1.UseOptions[a].type == enums_1.ItemUseOptions.USE_MEDICAL)) {
                const useOption = useoptions_1.UseOptions[a];
                doReturn = false;
                timeout = useOption.timeout;
                if (useOption.drinkCount)
                    drinkCount = useOption.drinkCount;
                if (useOption.eatCount)
                    eatCount = useOption.eatCount;
                if (useOption.staminaCount)
                    staminaCount = useOption.staminaCount;
                if (useOption.givetrash)
                    givetrash = useOption.givetrash;
                if (useOption.healCount)
                    healCount = useOption.healCount;
                if (useOption.bandagingCount)
                    bandagingCount = useOption.bandagingCount;
            }
        }
        if (doReturn) {
            this.sendChatText(client, "[ERROR] consumable not mapped to item Definition " +
                item.itemDefinitionId);
            return;
        }
        this.utilizeHudTimer(client, itemDef.NAME_ID, timeout, () => {
            this.useComsumablePass(client, item, eatCount, drinkCount, staminaCount, givetrash, healCount, bandagingCount);
        });
    }
    igniteOption(client, item) {
        const itemDef = this.getItemDefinition(item.itemDefinitionId);
        if (!itemDef)
            return;
        let timeout = 0;
        let doReturn = true;
        for (const a in useoptions_1.UseOptions) {
            if (useoptions_1.UseOptions[a].itemDef == item.itemDefinitionId &&
                useoptions_1.UseOptions[a].type == enums_1.ItemUseOptions.IGNITE) {
                const useOption = useoptions_1.UseOptions[a];
                doReturn = false;
                timeout = useOption.timeout;
            }
        }
        if (doReturn) {
            this.sendChatText(client, "[ERROR] use option not mapped to item Definition " +
                item.itemDefinitionId);
            return;
        }
        this.utilizeHudTimer(client, itemDef.NAME_ID, timeout, () => {
            this.igniteoptionPass(client);
        });
    }
    fillPass(client, item) {
        if (client.character.characterStates.inWater) {
            if (!this.removeInventoryItem(client, item))
                return;
            client.character.lootContainerItem(this, this.generateItem(1368)); // give dirty water
        }
        else {
            this.sendAlert(client, "There is no water source nearby");
        }
    }
    sniffPass(client, item) {
        if (!this.removeInventoryItem(client, item))
            return;
        this.applyMovementModifier(client, enums_1.MovementModifiers.SWIZZLE);
    }
    fertilizePlants(client, item) {
        if (!this.removeInventoryItem(client, item))
            return;
        for (const characterId in this._temporaryObjects) {
            const object = this._temporaryObjects[characterId];
            if (object instanceof plantingdiameter_1.PlantingDiameter &&
                (0, utils_1.isPosInRadius)(1, object.state.position, client.character.state.position)) {
                object.isFertilized = true;
                object.fertilizedTimestamp = new Date().getTime() + 86400000; // + 1 day
                Object.values(object.seedSlots).forEach((plant) => {
                    if (plant.isFertilized)
                        return;
                    plant.isFertilized = true;
                    const roz = (plant.nextStateTime - new Date().getTime()) / 2;
                    plant.nextStateTime = new Date().getTime() + roz;
                    this.sendDataToAllWithSpawnedEntity(
                    // play burning effect & remove it after 15s
                    this._plants, plant.characterId, "Command.PlayDialogEffect", {
                        characterId: plant.characterId,
                        effectId: 5056,
                    });
                });
                return;
            }
        }
    }
    useItem(client, item) {
        const itemDef = this.getItemDefinition(item.itemDefinitionId);
        if (!itemDef)
            return;
        const nameId = itemDef.NAME_ID;
        let timeout = 0;
        let useoption = "";
        let doReturn = true;
        for (const a in useoptions_1.UseOptions) {
            if (useoptions_1.UseOptions[a].itemDef == item.itemDefinitionId &&
                useoptions_1.UseOptions[a].type == enums_1.ItemUseOptions.USE) {
                const useOption = useoptions_1.UseOptions[a];
                doReturn = false;
                timeout = useOption.timeout;
            }
        }
        if (doReturn) {
            this.sendChatText(client, "[ERROR] use option not mapped to item Definition " +
                item.itemDefinitionId);
            return;
        }
        switch (item.itemDefinitionId) {
            case enums_1.Items.WATER_EMPTY:
                useoption = "fill";
                break;
            case enums_1.Items.SWIZZLE:
                useoption = "sniff";
                timeout = 3000;
                break;
            case enums_1.Items.FERTILIZER:
                this.utilizeHudTimer(client, nameId, timeout, () => {
                    this.fertilizePlants(client, item);
                });
                return;
            default:
                this.sendChatText(client, "[ERROR] No use option mapped to item Definition " +
                    item.itemDefinitionId);
        }
        switch (useoption) {
            case "fill": // empty bottle
                this.utilizeHudTimer(client, nameId, timeout, () => {
                    this.fillPass(client, item);
                });
                break;
            case "sniff": // swizzle
                this.utilizeHudTimer(client, nameId, timeout, () => {
                    this.sniffPass(client, item);
                });
                break;
            default:
                return;
        }
    }
    sliceItem(client, item) {
        const itemDef = this.getItemDefinition(item.itemDefinitionId);
        if (!itemDef)
            return;
        const nameId = itemDef.NAME_ID;
        let timeout = 0;
        let doReturn = true;
        for (const a in useoptions_1.UseOptions) {
            if (useoptions_1.UseOptions[a].itemDef == item.itemDefinitionId &&
                useoptions_1.UseOptions[a].type == enums_1.ItemUseOptions.SLICE) {
                const useOption = useoptions_1.UseOptions[a];
                doReturn = false;
                timeout = useOption.timeout;
            }
        }
        if (doReturn) {
            this.sendChatText(client, "[ERROR] use option not mapped to item Definition " +
                item.itemDefinitionId);
            return;
        }
        this.utilizeHudTimer(client, nameId, timeout, () => {
            this.slicePass(client, item);
        });
    }
    refuelVehicle(client, item, vehicleGuid) {
        const itemDef = this.getItemDefinition(item.itemDefinitionId);
        if (!itemDef)
            return;
        const nameId = itemDef.NAME_ID;
        let fuelValue = 0;
        let timeout = 0;
        let doReturn = true;
        for (const a in useoptions_1.UseOptions) {
            if (useoptions_1.UseOptions[a].itemDef == item.itemDefinitionId &&
                useoptions_1.UseOptions[a].type == enums_1.ItemUseOptions.REFUEL) {
                const useOption = useoptions_1.UseOptions[a];
                doReturn = false;
                timeout = useOption.timeout;
                if (useOption.refuelCount)
                    fuelValue = useOption.refuelCount;
            }
        }
        if (doReturn) {
            this.sendChatText(client, "[ERROR] consumable not mapped to item Definition " +
                item.itemDefinitionId);
            return;
        }
        this.utilizeHudTimer(client, nameId, timeout, () => {
            this.refuelVehiclePass(client, item, vehicleGuid, fuelValue);
        });
    }
    shredItem(client, item) {
        const itemDefinition = this.getItemDefinition(item.itemDefinitionId), nameId = itemDefinition.NAME_ID, itemType = itemDefinition.ITEM_TYPE;
        let count = 1;
        const timeout = 3000;
        switch (itemType) {
            case 36:
            case 39:
                count = 1;
                break;
            case 34: // salvage/shred
                count = 4;
                break;
            default:
                this.sendChatText(client, "[ERROR] Unknown salvage item or count.");
        }
        this.utilizeHudTimer(client, nameId, timeout, () => {
            this.shredItemPass(client, item, count);
        });
    }
    salvageAmmo(client, item) {
        const itemDefinition = this.getItemDefinition(item.itemDefinitionId), nameId = itemDefinition.NAME_ID;
        const timeout = 2000;
        const allowedItems = [
            enums_1.Items.AMMO_12GA,
            enums_1.Items.AMMO_223,
            enums_1.Items.AMMO_308,
            enums_1.Items.AMMO_380,
            enums_1.Items.AMMO_44,
            enums_1.Items.AMMO_45,
            enums_1.Items.AMMO_762,
            enums_1.Items.AMMO_9MM,
        ];
        if (!allowedItems.includes(item.itemDefinitionId)) {
            this.sendAlert(client, `[ERROR] Salvage option not mapped to item definition ${item.itemDefinitionId}`);
            return;
        }
        if (!(0, utils_1.checkConstructionInRange)(this._constructionSimple, client.character.state.position, 1.5, enums_1.Items.WORKBENCH_WEAPON) &&
            !(0, utils_1.checkConstructionInRange)(this._worldSimpleConstruction, client.character.state.position, 1.5, enums_1.Items.WORKBENCH_WEAPON)) {
            this.sendAlert(client, "You must be near a weapon workbench to complete this recipe");
            return;
        }
        const count = item.itemDefinitionId == enums_1.Items.AMMO_12GA ||
            item.itemDefinitionId == enums_1.Items.AMMO_762 ||
            item.itemDefinitionId == enums_1.Items.AMMO_308 ||
            item.itemDefinitionId == enums_1.Items.AMMO_44
            ? 2
            : 1;
        this.utilizeHudTimer(client, nameId, timeout, () => {
            this.salvageItemPass(client, item, count);
        });
    }
    useComsumablePass(client, item, eatCount, drinkCount, staminaCount, givetrash, healCount, bandagingCount) {
        if (!this.removeInventoryItem(client, item))
            return;
        if (eatCount) {
            client.character._resources[enums_1.ResourceIds.HUNGER] += eatCount;
            this.updateResource(client, client.character.characterId, client.character._resources[enums_1.ResourceIds.HUNGER], enums_1.ResourceIds.HUNGER);
        }
        if (drinkCount) {
            client.character._resources[enums_1.ResourceIds.HYDRATION] += drinkCount;
            this.updateResource(client, client.character.characterId, client.character._resources[enums_1.ResourceIds.HYDRATION], enums_1.ResourceIds.HYDRATION);
        }
        if (staminaCount) {
            client.character._resources[enums_1.ResourceIds.STAMINA] += staminaCount;
            this.updateResource(client, client.character.characterId, client.character._resources[enums_1.ResourceIds.STAMINA], enums_1.ResourceIds.STAMINA);
        }
        if (item.itemDefinitionId == enums_1.Items.MEAT_ROTTEN) {
            const damageInfo = {
                entity: "",
                damage: 1000,
            };
            client.character.damage(this, damageInfo);
        }
        if (givetrash) {
            client.character.lootContainerItem(this, this.generateItem(givetrash));
        }
        if (bandagingCount && healCount) {
            client.character.healingMaxTicks += healCount;
            client.character._resources[enums_1.ResourceIds.BLEEDING] -= bandagingCount;
            const bleeding = client.character._resources[enums_1.ResourceIds.BLEEDING];
            if (!client.character.healingInterval) {
                client.character.starthealingInterval(client, this);
            }
            this.updateResourceToAllWithSpawnedEntity(client.character.characterId, bleeding, enums_1.ResourceIds.BLEEDING, enums_1.ResourceTypes.BLEEDING, this._characters);
        }
    }
    slicePass(client, item) {
        if (!this.removeInventoryItem(client, item))
            return;
        if (item.itemDefinitionId == enums_1.Items.BLACKBERRY_PIE) {
            client.character.lootContainerItem(this, this.generateItem(enums_1.Items.BLACKBERRY_PIE_SLICE, 4));
        }
    }
    igniteoptionPass(client) {
        for (const a in this._explosives) {
            if ((0, utils_1.isPosInRadius)(1, client.character.state.position, this._explosives[a].state.position)) {
                this._explosives[a].ignite(this, client);
                return;
            }
        }
        for (const a in this._lootableConstruction) {
            const smeltable = this._lootableConstruction[a];
            if ((0, utils_1.isPosInRadius)(1, client.character.state.position, smeltable.state.position)) {
                if (smeltable instanceof lootableconstructionentity_1.LootableConstructionEntity) {
                    if (smeltable.subEntity instanceof smeltingentity_1.SmeltingEntity &&
                        smeltable.subEntity?.isWorking)
                        return;
                    smeltable.subEntity?.startWorking(this, smeltable);
                    return;
                }
            }
        }
        for (const a in this._worldLootableConstruction) {
            const smeltable = this._worldLootableConstruction[a];
            if ((0, utils_1.isPosInRadius)(1, client.character.state.position, smeltable.state.position)) {
                if (smeltable instanceof lootableconstructionentity_1.LootableConstructionEntity) {
                    if (smeltable.subEntity instanceof smeltingentity_1.SmeltingEntity &&
                        smeltable.subEntity?.isWorking)
                        return;
                    smeltable.subEntity?.startWorking(this, smeltable);
                    return;
                }
            }
        }
    }
    refuelVehiclePass(client, item, vehicleGuid, fuelValue) {
        if (!this.removeInventoryItem(client, item))
            return;
        const vehicle = this._vehicles[vehicleGuid];
        vehicle._resources[enums_1.ResourceIds.FUEL] += fuelValue;
        if (vehicle._resources[enums_1.ResourceIds.FUEL] > 10000) {
            vehicle._resources[enums_1.ResourceIds.FUEL] = 10000;
        }
        this.updateResourceToAllWithSpawnedEntity(vehicleGuid, vehicle._resources[enums_1.ResourceIds.FUEL], enums_1.ResourceIds.FUEL, enums_1.ResourceTypes.FUEL, this._vehicles);
    }
    shredItemPass(client, item, count) {
        if (!this.removeInventoryItem(client, item))
            return;
        client.character.lootItem(this, this.generateItem(enums_1.Items.CLOTH, count));
    }
    salvageItemPass(client, item, count) {
        if (!this.removeInventoryItem(client, item))
            return;
        client.character.lootItem(this, this.generateItem(enums_1.Items.ALLOY_LEAD, count));
        client.character.lootItem(this, this.generateItem(enums_1.Items.SHARD_BRASS, 1));
        client.character.lootItem(this, this.generateItem(enums_1.Items.GUNPOWDER_REFINED, 1));
    }
    stopHudTimer(client) {
        this.utilizeHudTimer(client, 0, 0, () => {
            /*/*/
        });
    }
    utilizeHudTimer(client, nameId, timeout, callback) {
        this.startTimer(client, nameId, timeout);
        if (client.hudTimer != null) {
            clearTimeout(client.hudTimer);
        }
        client.posAtLogoutStart = client.character.state.position;
        client.hudTimer = setTimeout(() => {
            callback.apply(this);
        }, timeout);
    }
    containerError(client, error) {
        switch (error) {
            case enums_1.ContainerErrors.DOES_NOT_ACCEPT_ITEMS:
                this.sendChatText(client, "Container Error: ContainerDoesNotAcceptItems");
                break;
            case enums_1.ContainerErrors.NOT_MUTABLE:
                this.sendChatText(client, "Container Error: ContainerIsNotMutable");
                break;
            case enums_1.ContainerErrors.NOT_CONSTRUCTED:
                this.sendChatText(client, "Container Error: ContainerNotConstructed");
                break;
            case enums_1.ContainerErrors.NO_SPACE:
                this.sendChatText(client, "Container Error: ContainerHasNoSpace");
                break;
            case enums_1.ContainerErrors.INVALID_LOADOUT_SLOT:
                this.sendChatText(client, "Container Error: InvalidLoadoutSlot");
                break;
            case enums_1.ContainerErrors.NO_PERMISSION:
                this.sendChatText(client, "Container Error: NoPermission");
            case enums_1.ContainerErrors.UNACCEPTED_ITEM:
                this.sendChatText(client, "Container Error: Item not accepted");
                break;
            default:
                this.sendData(client, "Container.Error", {
                    characterId: client.character.characterId,
                    containerError: error,
                });
                break;
        }
    }
    placementError(client, error) {
        let errorMsg = "Unknown";
        switch (error) {
            case enums_1.ConstructionErrors.OVERLAP:
                errorMsg = "Construction overlap";
                break;
            case enums_1.ConstructionErrors.BUILD_PERMISSION:
                errorMsg = "No build permission";
                break;
            case enums_1.ConstructionErrors.DEMOLISH_PERMISSION:
                errorMsg = "No demolish permission";
                break;
            case enums_1.ConstructionErrors.UNKNOWN_PARENT:
                errorMsg = "Unknown parent";
                break;
            case enums_1.ConstructionErrors.UNKNOWN_SLOT:
                errorMsg = "Unknown slot";
                break;
            case enums_1.ConstructionErrors.UNKNOWN_CONSTRUCTION:
                errorMsg = "Unknown construction item";
                break;
        }
        this.sendAlert(client, `Construction Error: ${errorMsg}`);
    }
    clearMovementModifiers(client) {
        for (const a in client.character.timeouts) {
            client.character.timeouts[a]._onTimeout();
            clearTimeout(client.character.timeouts[a]);
            delete client.character.timeouts[a];
        }
    }
    applyMovementModifier(client, modifier) {
        this.multiplyMovementModifier(client, modifier);
        switch (modifier) {
            case enums_1.MovementModifiers.SWIZZLE:
                if (client.character.timeouts["swizzle"]) {
                    client.character.timeouts["swizzle"]._onTimeout();
                    clearTimeout(client.character.timeouts["swizzle"]);
                    delete client.character.timeouts["swizzle"];
                }
                client.character.timeouts["swizzle"] = setTimeout(() => {
                    if (!client.character.timeouts["swizzle"]) {
                        return;
                    }
                    this.divideMovementModifier(client, modifier);
                    delete client.character.timeouts["swizzle"];
                }, 30000);
                break;
            case enums_1.MovementModifiers.SNARED:
                if (client.character.timeouts["snared"]) {
                    client.character.timeouts["snared"]._onTimeout();
                    clearTimeout(client.character.timeouts["snared"]);
                    delete client.character.timeouts["snared"];
                }
                client.character.timeouts["snared"] = setTimeout(() => {
                    if (!client.character.timeouts["snared"]) {
                        return;
                    }
                    this.divideMovementModifier(client, modifier);
                    delete client.character.timeouts["snared"];
                }, 15000);
                break;
            case enums_1.MovementModifiers.BOOTS:
                // some stuff
                break;
        }
    }
    multiplyMovementModifier(client, modifier) {
        this.sendData(client, "ClientUpdate.ModifyMovementSpeed", {
            speed: modifier,
        });
    }
    divideMovementModifier(client, modifier) {
        const modifierFixed = 1 / modifier;
        if (!client.character.initialized)
            return;
        this.sendData(client, "ClientUpdate.ModifyMovementSpeed", {
            speed: modifierFixed,
        });
    }
    checkConveys(client, character = client.character) {
        if (!character._equipment["5"]) {
            if (character.hasConveys) {
                character.hasConveys = false;
                this.divideMovementModifier(client, enums_1.MovementModifiers.BOOTS);
            }
        }
        else {
            if (character._equipment["5"].guid) {
                const item = client.character.getInventoryItem(character._equipment["5"].guid);
                if (!item)
                    return;
                const itemDef = this.getItemDefinition(item.itemDefinitionId);
                if (itemDef.DESCRIPTION_ID == 11895 && !character.hasConveys) {
                    character.hasConveys = true;
                    this.multiplyMovementModifier(client, enums_1.MovementModifiers.BOOTS);
                }
                else if (itemDef.DESCRIPTION_ID != 11895 && character.hasConveys) {
                    character.hasConveys = false;
                    this.divideMovementModifier(client, enums_1.MovementModifiers.BOOTS);
                }
            }
        }
    }
    //#endregion
    async reloadZonePacketHandlers() {
        //@ts-ignore
        delete this._packetHandlers;
        delete require.cache[require.resolve("./zonepackethandlers")];
        this._packetHandlers = new (require("./zonepackethandlers").zonePacketHandlers)();
        await this._packetHandlers.reloadCommandCache();
    }
    generateGuid() {
        return (0, utils_1.generateRandomGuid)();
    }
    getSoeClient(soeClientId) {
        return this._gatewayServer._soeServer.getSoeClient(soeClientId);
    }
    _sendRawData(client, data, unbuffered) {
        const soeClient = this.getSoeClient(client.soeClientId);
        if (soeClient) {
            if (unbuffered) {
                this._gatewayServer.sendUnbufferedTunnelData(soeClient, data);
            }
            else {
                this._gatewayServer.sendTunnelData(soeClient, data);
            }
        }
    }
    sendRawData(client, data) {
        this._sendRawData(client, data, false);
    }
    sendUnbufferedRawData(client, data) {
        this._sendRawData(client, data, true);
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
    getAllCurrentUsedTransientId() {
        const allTransient = {};
        for (const key in this._doors) {
            const door = this._doors[key];
            allTransient[door.transientId] = key;
        }
        for (const key in this._lootableProps) {
            const prop = this._lootableProps[key];
            allTransient[prop.transientId] = key;
        }
        for (const key in this._vehicles) {
            const vehicle = this._vehicles[key];
            allTransient[vehicle.transientId] = key;
        }
        for (const key in this._npcs) {
            const npc = this._npcs[key];
            allTransient[npc.transientId] = key;
        }
        for (const key in this._spawnedItems) {
            const object = this._spawnedItems[key];
            allTransient[object.transientId] = key;
        }
        return allTransient;
    }
    async fetchLoginInfo() {
        const resolver = new dns_1.Resolver();
        const loginServerAddress = await (0, utils_1.resolveHostAddress)(resolver, "loginserver.h1emu.com");
        this._loginServerInfo.address = loginServerAddress[0];
    }
    executeFuncForAllReadyClients(callback) {
        for (const client in this._clients) {
            const clientObj = this._clients[client];
            if (!clientObj.isLoading) {
                callback(clientObj);
            }
        }
    }
    executeFuncForAllReadyClientsInRange(callback, entity) {
        for (const client in this._clients) {
            const clientObj = this._clients[client];
            if (!clientObj.isLoading &&
                (0, utils_1.isPosInRadius)(entity.npcRenderDistance || this._charactersRenderDistance, clientObj.character.state.position, entity.state.position)) {
                callback(clientObj);
            }
        }
    }
    startClientRoutine(client) {
        client.routineInterval = setTimeout(() => {
            if (!client)
                return;
            if (!client.isLoading) {
                client.routineCounter++;
                if (client.routineCounter >= 3) {
                    this.assignChunkRenderDistance(client);
                    this.removeOutOfDistanceEntities(client);
                    this.POIManager(client);
                    client.routineCounter = 0;
                }
                this.vehicleManager(client);
                //this.npcManager(client);
                this.spawnCharacters(client);
                this.spawnGridObjects(client);
                this.constructionManager(client);
                this.worldConstructionManager(client);
                client.posAtLastRoutine = client.character.state.position;
            }
            if (client.isLoading) {
                delete client.routineInterval;
                return;
            }
            client.routineInterval?.refresh();
        }, this.tickRate);
    }
    executeRoutine(client) {
        this.vehicleManager(client);
        //this.npcManager(client);
        this.removeOutOfDistanceEntities(client);
        this.spawnCharacters(client);
        this.spawnGridObjects(client);
        this.constructionManager(client);
        this.worldConstructionManager(client);
        this.POIManager(client);
        client.posAtLastRoutine = client.character.state.position;
    }
    _sendDataToAll(packetName, obj, unbuffered) {
        const data = this._protocol.pack(packetName, obj);
        if (data) {
            for (const a in this._clients) {
                if (unbuffered) {
                    this.sendUnbufferedRawData(this._clients[a], data);
                }
                else {
                    this.sendRawData(this._clients[a], data);
                }
            }
        }
    }
    sendDataToAll(packetName, obj) {
        this._sendDataToAll(packetName, obj, false);
    }
    sendUnbufferedDataToAll(packetName, obj) {
        this._sendDataToAll(packetName, obj, true);
    }
    dropVehicleManager(client, vehicleGuid) {
        this.sendManagedObjectResponseControlPacket(client, {
            control: 0,
            objectCharacterId: vehicleGuid,
        });
        client.managedObjects.splice(client.managedObjects.findIndex((e) => e === vehicleGuid), 1);
        delete this._vehicles[vehicleGuid]?.manager;
    }
    sendZonePopulationUpdate() {
        const populationNumber = utils_1._.size(this._characters);
        this._h1emuZoneServer.sendData({
            ...this._loginServerInfo,
            serverId: Infinity,
        }, "UpdateZonePopulation", { population: populationNumber });
    }
    sendChatTextToAllOthers(client, message, clearChat = false) {
        for (const a in this._clients) {
            if (client != this._clients[a]) {
                this.sendChatText(this._clients[a], message, clearChat);
            }
        }
    }
    sendChatTextToAdmins(message, clearChat = false) {
        for (const a in this._clients) {
            if (this._clients[a].isAdmin) {
                this.sendChatText(this._clients[a], message, clearChat);
            }
        }
    }
    sendGlobalChatText(message, clearChat = false) {
        for (const a in this._clients) {
            this.sendChatText(this._clients[a], message, clearChat);
        }
    }
    filterOutOfDistance(element, playerPosition) {
        return !(0, utils_1.isPosInRadius)(element.npcRenderDistance || this._charactersRenderDistance, playerPosition, element.state.position);
    }
    getServerTimeTest() {
        debug("get server time");
        const delta = Date.now() - this._startTime;
        return Number((((this._serverTime + delta) * this._timeMultiplier) / 1000).toFixed(0));
    }
    getServerTime() {
        debug("get server time");
        const delta = Date.now() - this._startTime;
        return this._serverTime + delta;
    }
    dismissVehicle(vehicleGuid) {
        this.sendDataToAll("Character.RemovePlayer", {
            characterId: vehicleGuid,
        });
        this.deleteEntity(vehicleGuid, this._vehicles);
    }
    /**
     * Generates a new transientId and maps it to a provided characterId.
     * @param characterId The characterId to map the transientId to.
     */
    getTransientId(characterId) {
        const generatedTransient = this._transientIdGenerator.next()
            .value;
        this._transientIds[generatedTransient] = characterId;
        this._characterIds[characterId] = generatedTransient;
        return generatedTransient;
    }
    /**
     * Reloads all packet handlers, structures, and commands for the entire server.
     * @param client The client that called the function.
     */
    reloadPackets(client) {
        this.reloadZonePacketHandlers();
        this._protocol.reloadPacketDefinitions();
        this.sendChatText(client, "[DEV] Packets reloaded", true);
    }
    /**
     * Disconnects a client from the zone.
     * @param client The client to be disconnected
     */
    timeoutClient(client) {
        if (!!this._clients[client.sessionId]) {
            // if hasn't already deleted
            debug(`Client (${client.soeClientId}) disconnected ( ping timeout )`);
            this.deleteClient(client);
        }
    }
    toggleFog() {
        return this.weatherManager.changeFog();
    }
};
ZoneServer2016 = __decorate([
    healthWorker_1.healthThreadDecorator
], ZoneServer2016);
exports.ZoneServer2016 = ZoneServer2016;
if (process.env.VSCODE_DEBUG === "true") {
    const PackageSetting = require("../../../package.json");
    process.env.H1Z1_SERVER_VERSION = PackageSetting.version;
    new ZoneServer2016(1117, Buffer.from(constants_1.DEFAULT_CRYPTO_KEY, "base64"), process.env.MONGO_URL, 2).start();
}
//# sourceMappingURL=zoneserver.js.map