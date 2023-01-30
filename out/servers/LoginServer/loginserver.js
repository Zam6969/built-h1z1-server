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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginServer = void 0;
const events_1 = require("events");
const soeserver_1 = require("../SoeServer/soeserver");
const h1emuLoginServer_1 = require("../H1emuServer/h1emuLoginServer");
const loginprotocol_1 = require("../../protocols/loginprotocol");
const mongodb_1 = require("mongodb");
const utils_1 = require("../../utils/utils");
const fs_1 = __importDefault(require("fs"));
const worker_threads_1 = require("worker_threads");
const loginprotocol2016_1 = require("../../protocols/loginprotocol2016");
const constants_1 = require("../../utils/constants");
const healthWorker_1 = require("../../servers/shared/workers/healthWorker");
const functions_1 = require("../shared/functions");
const enums_1 = require("../../utils/enums");
const h1z1_dataschema_1 = __importDefault(require("h1z1-dataschema"));
const loginpackets_1 = require("../../packets/LoginUdp/LoginUdp_11/loginpackets");
const dns_1 = require("dns");
const debugName = "LoginServer";
const debug = require("debug")(debugName);
const characterItemDefinitionsDummy = require("../../../data/2015/sampleData/characterItemDefinitionsDummy.json");
let LoginServer = class LoginServer extends events_1.EventEmitter {
    constructor(serverPort, mongoAddress = "") {
        super();
        this._httpServerPort = 80;
        this._zoneConnections = {};
        this._internalReqCount = 0;
        this._pendingInternalReq = {};
        this._pendingInternalReqTimeouts = {};
        this._soloPlayIp = process.env.SOLO_PLAY_IP || "127.0.0.1";
        this._resolver = new dns_1.Resolver();
        this._crcSeed = 0;
        this._crcLength = 0;
        this._udpLength = 512;
        this._cryptoKey = Buffer.from(constants_1.DEFAULT_CRYPTO_KEY, "base64");
        this._soloMode = false;
        this._mongoAddress = mongoAddress;
        this._appDataFolder = (0, utils_1.getAppDataFolderPath)();
        this._enableHttpServer = true;
        this.clients = new Map();
        // reminders
        if (!this._mongoAddress) {
            this._soloMode = true;
            debug("Server in solo mode !");
        }
        this._soeServer = new soeserver_1.SOEServer(serverPort, this._cryptoKey);
        // 2016 client doesn't send a disconnect packet so we've to use that
        // But that can't be enabled on zoneserver
        this._soeServer._usePingTimeout = true;
        this._protocol = new loginprotocol_1.LoginProtocol();
        this._protocol2016 = new loginprotocol2016_1.LoginProtocol2016();
        this._soeServer.on("disconnect", (client) => {
            debug(`Client disconnected from ${client.address}:${client.port}`);
            this.Logout(client);
        });
        this._soeServer.on("appdata", async (client, data) => {
            try {
                const packet = this.parseData(client.protocolName, data);
                debug(packet);
                if (packet?.result) {
                    // if packet parsing succeed
                    switch (packet.name) {
                        case "LoginRequest":
                            const { sessionId } = packet.result;
                            await this.LoginRequest(client, sessionId);
                            break;
                        case "CharacterSelectInfoRequest":
                            await this.CharacterSelectInfoRequest(client);
                            break;
                        case "ServerListRequest":
                            await this.ServerListRequest(client);
                            break;
                        case "CharacterDeleteRequest":
                            await this.CharacterDeleteRequest(client, packet.result);
                            break;
                        case "CharacterLoginRequest":
                            await this.CharacterLoginRequest(client, packet.result);
                            break;
                        case "CharacterCreateRequest":
                            await this.CharacterCreateRequest(client, packet.result);
                            break;
                        case "TunnelAppPacketClientToServer": // only used for nameValidation rn
                            await this.TunnelAppPacketClientToServer(client, packet);
                            break;
                        case "Logout":
                            this.Logout(client);
                            break;
                    }
                }
                else {
                    debug("Packet parsing was unsuccesful");
                }
            }
            catch (error) {
                console.log(error);
                process.exitCode = 1;
            }
        });
        if (!this._soloMode) {
            this._h1emuLoginServer = new h1emuLoginServer_1.H1emuLoginServer(1110);
            this._h1emuLoginServer.on("data", async (err, client, packet) => {
                if (err) {
                    console.error(err);
                }
                else {
                    try {
                        const connectionEstablished = !!this._zoneConnections[client.clientId];
                        if (connectionEstablished || packet.name === "SessionRequest") {
                            switch (packet.name) {
                                case "SessionRequest": {
                                    const { serverId } = packet.data;
                                    debug(`Received session request from ${client.address}:${client.port}`);
                                    let status = 0;
                                    const { serverAddress: fullServerAddress } = await this._db
                                        .collection(enums_1.DB_COLLECTIONS.SERVERS)
                                        .findOne({ serverId: serverId });
                                    const serverAddress = fullServerAddress.split(":")[0];
                                    if (serverAddress) {
                                        const resolvedServerAddress = await (0, utils_1.resolveHostAddress)(this._resolver, serverAddress);
                                        if (resolvedServerAddress.includes(client.address)) {
                                            status = 1;
                                        }
                                    }
                                    if (status === 1) {
                                        debug(`ZoneConnection established`);
                                        client.serverId = serverId;
                                        this._zoneConnections[client.clientId] = serverId;
                                        await this.updateServerStatus(serverId, true);
                                    }
                                    else {
                                        console.log(`rejected connection serverId : ${serverId} address: ${client.address} `);
                                        delete this._h1emuLoginServer._clients[client.clientId];
                                        return;
                                    }
                                    this._h1emuLoginServer.sendData(client, "SessionReply", {
                                        status: status,
                                    });
                                    break;
                                }
                                case "UpdateZonePopulation": {
                                    const { population } = packet.data;
                                    const serverId = this._zoneConnections[client.clientId];
                                    const { maxPopulationNumber } = await this._db
                                        .collection(enums_1.DB_COLLECTIONS.SERVERS)
                                        .findOne({ serverId: serverId });
                                    this._db
                                        ?.collection(enums_1.DB_COLLECTIONS.SERVERS)
                                        .findOneAndUpdate({ serverId: serverId }, {
                                        $set: {
                                            populationNumber: population,
                                            populationLevel: Number(((population / maxPopulationNumber) * 3).toFixed(0)),
                                        },
                                    });
                                    break;
                                }
                                default:
                                    debug(`Unhandled h1emu packet: ${packet.name}`);
                                    break;
                            }
                        }
                    }
                    catch (e) {
                        console.log(e);
                    }
                }
            });
            this._h1emuLoginServer.on("processInternalReq", (packet, keysToReturn) => {
                const { reqId } = packet.data;
                clearTimeout(this._pendingInternalReqTimeouts[reqId]);
                delete this._pendingInternalReqTimeouts[reqId];
                if (this._pendingInternalReq[reqId]) {
                    let returnedData;
                    if (keysToReturn.length > 0) {
                        if (keysToReturn.length === 1) {
                            returnedData = packet.data[keysToReturn[0]];
                        }
                        else {
                            returnedData = {};
                            for (const key of keysToReturn) {
                                returnedData[key] = packet.data[key];
                            }
                        }
                    }
                    else {
                        returnedData = packet.data;
                    }
                    this._pendingInternalReq[reqId](returnedData);
                    delete this._pendingInternalReq[reqId];
                }
            });
            this._h1emuLoginServer.on("disconnect", async (err, client, reason) => {
                debug(`ZoneConnection dropped: ${reason ? "Connection Lost" : "Unknown Error"}`);
                delete this._zoneConnections[client.clientId];
                if (client.serverId &&
                    !Object.values(this._zoneConnections).includes(client.serverId)) {
                    await this.updateServerStatus(client.serverId, false);
                }
            });
            this._h1emuLoginServer.start();
        }
    }
    parseData(clientProtocol, data) {
        switch (clientProtocol) {
            case "LoginUdp_9":
                return this._protocol.parse(data);
            case "LoginUdp_11":
                return this._protocol2016.parse(data);
            default:
                return null;
        }
    }
    sendData(client, packetName, obj) {
        let data;
        switch (client.protocolName) {
            case "LoginUdp_9": {
                data = this._protocol.pack(packetName, obj);
                break;
            }
            case "LoginUdp_11": {
                data = this._protocol2016.pack(packetName, obj);
                break;
            }
            default:
                return;
        }
        if (data) {
            this._soeServer.sendAppData(client, data);
        }
    }
    async loadCharacterData(client) {
        if (this._soloMode) {
            switch (client.gameVersion) {
                default:
                case enums_1.GAME_VERSIONS.H1Z1_15janv_2015: {
                    try {
                        // delete old character cache
                        delete require.cache[require.resolve(`${this._appDataFolder}/single_player_characters.json`)];
                    }
                    catch (e) {
                        console.error(e);
                    }
                    return require(`${this._appDataFolder}/single_player_characters.json`);
                }
                case enums_1.GAME_VERSIONS.H1Z1_6dec_2016: {
                    try {
                        // delete old character cache
                        delete require.cache[require.resolve(`${this._appDataFolder}/single_player_characters2016.json`)];
                    }
                    catch (e) {
                        console.error(e);
                    }
                    return require(`${this._appDataFolder}/single_player_characters2016.json`);
                }
                case enums_1.GAME_VERSIONS.H1Z1_KOTK_PS3: {
                    try {
                        // delete old character cache
                        delete require.cache[require.resolve(`${this._appDataFolder}/single_player_charactersKOTK.json`)];
                    }
                    catch (e) {
                        console.error(e);
                    }
                    return require(`${this._appDataFolder}/single_player_charactersKOTK.json`);
                }
            }
        }
        else {
            const charactersQuery = {
                authKey: client.loginSessionId,
                gameVersion: client.gameVersion,
                status: 1,
            };
            return await this._db
                .collection(enums_1.DB_COLLECTIONS.CHARACTERS_LIGHT)
                .find(charactersQuery)
                .toArray();
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async LoginRequest(client, sessionIdString) {
        let sessionId, gameVersion;
        // In case of shitty json formatting
        sessionIdString = sessionIdString.replaceAll("\\", "");
        try {
            const sessionIdObject = JSON.parse(sessionIdString);
            sessionId = sessionIdObject.sessionId;
            gameVersion = sessionIdObject.gameVersion;
            if (!sessionId || !gameVersion) {
                throw new Error("Invalid sessionId");
            }
        }
        catch (e) {
            sessionId = sessionIdString;
            gameVersion =
                client.protocolName === "LoginUdp_9"
                    ? enums_1.GAME_VERSIONS.H1Z1_15janv_2015
                    : enums_1.GAME_VERSIONS.H1Z1_6dec_2016;
            //console.warn(
            //  "Your session id is not a valid json string, please update your launcher to avoid this warning"
            //);
        }
        if (this._soloMode) {
            client.loginSessionId = String(sessionId);
        }
        else {
            const realSession = await this._db
                .collection(enums_1.DB_COLLECTIONS.USERS_SESSIONS)
                .findOne({ guid: sessionId });
            client.loginSessionId = realSession ? realSession.authKey : sessionId;
        }
        client.gameVersion = gameVersion;
        const loginReply = {
            loggedIn: true,
            status: 1,
            resultCode: 1,
            isMember: true,
            isInternal: true,
            namespace: "soe",
            accountFeatures: [
                {
                    key: 2,
                    accountFeature: {
                        id: 2,
                        active: true,
                        remainingCount: 2,
                        rawData: "test",
                    },
                },
            ],
            errorDetails: [
                {
                    unknownDword1: 0,
                    name: "None",
                    value: "None",
                },
            ],
            ipCountryCode: "US",
            applicationPayload: "US",
        };
        this.clients.set(client.soeClientId, client);
        this.sendData(client, "LoginReply", loginReply);
    }
    async TunnelAppPacketClientToServer(client, packet) {
        const baseResponse = { serverId: packet.serverId };
        let response;
        switch (packet.subPacketName) {
            case "nameValidationRequest":
                const characterName = packet.result.characterName;
                let status = (0, utils_1.isValidCharacterName)(characterName);
                if (!this._soloMode) {
                    const blackListedEntry = await this._db
                        .collection(enums_1.DB_COLLECTIONS.BLACK_LIST_ENTRIES)
                        .findOne({
                        WORD: characterName.toUpperCase(),
                    });
                    if (blackListedEntry) {
                        if (blackListedEntry.FILTER_TYPE === 3) {
                            status = enums_1.NAME_VALIDATION_STATUS.RESERVED;
                        }
                        else {
                            status = enums_1.NAME_VALIDATION_STATUS.PROFANE;
                        }
                    }
                    else {
                        const duplicateCharacter = await this._db
                            .collection(enums_1.DB_COLLECTIONS.CHARACTERS_LIGHT)
                            .findOne({
                            "payload.name": characterName,
                            serverId: baseResponse.serverId,
                            status: 1,
                        });
                        if (duplicateCharacter) {
                            status = enums_1.NAME_VALIDATION_STATUS.TAKEN;
                        }
                    }
                }
                response = {
                    ...baseResponse,
                    subPacketOpcode: 0x02,
                    firstName: characterName,
                    status: status,
                };
                break;
            default:
                debug(`Unhandled tunnel packet "${packet.subPacketName}"`);
                break;
        }
        this.sendData(client, "TunnelAppPacketServerToClient", response);
    }
    Logout(client) {
        this.clients.delete(client.soeClientId);
        this._soeServer.deleteClient(client);
    }
    addDummyDataToCharacters(characters) {
        for (let index = 0; index < characters.length; index++) {
            // add required dummy data
            const PlayerCharacter = characters[index];
            PlayerCharacter.payload.itemDefinitions = characterItemDefinitionsDummy;
            PlayerCharacter.payload.loadoutData = {
                loadoutId: 3,
                unknownData1: {
                    unknownDword1: 22,
                    unknownByte1: 1,
                },
                unknownDword1: 0,
                unknownData2: {
                    unknownDword1: 0,
                    loadoutName: "",
                },
                tintItemId: 0,
                unknownDword2: 0,
                decalItemId: 0,
                loadoutSlots: [],
            };
            PlayerCharacter.payload.attachmentDefinitions = [];
        }
        return characters;
    }
    async CharacterSelectInfoRequest(client) {
        let characters = await this.loadCharacterData(client);
        if (this._soloMode) {
            if (client.gameVersion === enums_1.GAME_VERSIONS.H1Z1_15janv_2015) {
                characters = this.addDummyDataToCharacters(characters);
            }
            else {
                // LoginUdp_11
                let characterList = [];
                characterList = characters.map((character) => {
                    return {
                        characterId: character.characterId,
                        serverId: character.serverId,
                        payload: {
                            name: character.characterName,
                            modelId: character.actorModelId,
                            gender: character.gender,
                        },
                    };
                });
                characters = this.addDummyDataToCharacters(characterList);
            }
        }
        else {
            characters = this.addDummyDataToCharacters(characters);
        }
        const characterSelectInfoReply = {
            status: 1,
            canBypassServerLock: true,
            characters: characters,
        };
        this.sendData(client, "CharacterSelectInfoReply", characterSelectInfoReply);
        debug("CharacterSelectInfoRequest");
    }
    async updateServerStatus(serverId, status) {
        const server = await this._db
            .collection(enums_1.DB_COLLECTIONS.SERVERS)
            .findOneAndUpdate({ serverId: serverId }, {
            $set: {
                allowedAccess: status,
                populationNumber: 0,
                populationLevel: 0,
            },
        });
        this.clients.forEach((client) => {
            if (client.gameVersion === server.value.gameVersion) {
                this.sendData(client, "ServerUpdate", {
                    ...server.value,
                    allowedAccess: status,
                });
            }
        });
    }
    async updateServersStatus() {
        const servers = await this._db
            .collection(enums_1.DB_COLLECTIONS.SERVERS)
            .find()
            .toArray();
        for (let index = 0; index < servers.length; index++) {
            const server = servers[index];
            if (server.allowedAccess &&
                !Object.values(this._zoneConnections).includes(server.serverId)) {
                await this.updateServerStatus(server.serverId, false);
            }
        }
    }
    async ServerListRequest(client) {
        let servers;
        if (!this._soloMode) {
            servers = await this._db
                .collection(enums_1.DB_COLLECTIONS.SERVERS)
                .find({
                gameVersion: client.gameVersion,
            })
                .toArray();
        }
        else {
            switch (client.gameVersion) {
                default:
                case enums_1.GAME_VERSIONS.H1Z1_15janv_2015: {
                    const SoloServer = require("../../../data/2015/sampleData/single_player_server.json");
                    servers = [SoloServer];
                    break;
                }
                case enums_1.GAME_VERSIONS.H1Z1_6dec_2016: {
                    const SoloServer = require("../../../data/2016/sampleData/single_player_server.json");
                    servers = [SoloServer];
                    break;
                }
                case enums_1.GAME_VERSIONS.H1Z1_KOTK_PS3: {
                    const SoloServer = require("../../../data/kotk/sampleData/single_player_server.json");
                    servers = [SoloServer];
                    break;
                }
            }
        }
        const serverListReply = { servers: servers };
        this.sendData(client, "ServerListReply", serverListReply);
    }
    async CharacterDeleteRequest(client, packet) {
        debug("CharacterDeleteRequest");
        let deletionStatus = 1;
        if (this._soloMode) {
            const SinglePlayerCharacters = await this.loadCharacterData(client);
            const characterIndex = SinglePlayerCharacters.findIndex((character) => character.characterId === packet.characterId);
            SinglePlayerCharacters.splice(characterIndex, 1);
            switch (client.gameVersion) {
                default:
                case enums_1.GAME_VERSIONS.H1Z1_15janv_2015: {
                    fs_1.default.writeFileSync(`${this._appDataFolder}/single_player_characters.json`, JSON.stringify(SinglePlayerCharacters, null, "\t"));
                    break;
                }
                case enums_1.GAME_VERSIONS.H1Z1_6dec_2016: {
                    fs_1.default.writeFileSync(`${this._appDataFolder}/single_player_characters2016.json`, JSON.stringify(SinglePlayerCharacters, null, "\t"));
                    break;
                }
                case enums_1.GAME_VERSIONS.H1Z1_KOTK_PS3: {
                    fs_1.default.writeFileSync(`${this._appDataFolder}/single_player_charactersKOTK.json`, JSON.stringify(SinglePlayerCharacters, null, "\t"));
                    break;
                }
            }
        }
        else {
            const characterId = packet.characterId;
            const characterQuery = { characterId: characterId };
            const charracterToDelete = await this._db
                .collection(enums_1.DB_COLLECTIONS.CHARACTERS_LIGHT)
                .findOne(characterQuery);
            if (charracterToDelete &&
                charracterToDelete.authKey === client.loginSessionId) {
                deletionStatus = (await this.askZone(charracterToDelete.serverId, "CharacterDeleteRequest", { characterId: characterId }));
                if (deletionStatus) {
                    await this._db
                        .collection(enums_1.DB_COLLECTIONS.CHARACTERS_LIGHT)
                        .updateOne(characterQuery, {
                        $set: {
                            status: 0,
                        },
                    });
                    debug(`Character ${packet.characterId} deleted !`);
                }
            }
        }
        const characterDeleteReply = {
            characterId: packet.characterId,
            status: deletionStatus,
            Payload: "\0",
        };
        this.sendData(client, "CharacterDeleteReply", characterDeleteReply);
    }
    async getCharactersLoginInfo(serverId, characterId, loginSessionId) {
        const { serverAddress, populationNumber, maxPopulationNumber } = await this._db
            .collection(enums_1.DB_COLLECTIONS.SERVERS)
            .findOne({ serverId: serverId });
        const character = await this._db
            .collection(enums_1.DB_COLLECTIONS.CHARACTERS_LIGHT)
            .findOne({ characterId: characterId });
        let connectionStatus = Object.values(this._zoneConnections).includes(serverId) &&
            (populationNumber < maxPopulationNumber || !maxPopulationNumber);
        debug(`connectionStatus ${connectionStatus}`);
        if (!character) {
            console.error(`CharacterId "${characterId}" unfound on serverId: "${serverId}"`);
        }
        const hiddenSession = connectionStatus
            ? await this._db
                .collection(enums_1.DB_COLLECTIONS.USERS_SESSIONS)
                .findOne({ authKey: loginSessionId })
            : { guid: "" };
        if (!connectionStatus) {
            // Admins bypass max pop
            connectionStatus = (await this.askZone(serverId, "ClientIsAdminRequest", {
                guid: hiddenSession?.guid,
            }));
        }
        return {
            unknownQword1: "0x0",
            unknownDword1: 0,
            unknownDword2: 0,
            status: character ? Number(connectionStatus) : 0,
            applicationData: {
                serverAddress: serverAddress,
                serverTicket: hiddenSession?.guid,
                encryptionKey: this._cryptoKey,
                guid: characterId,
                unknownQword2: "0x0",
                stationName: "",
                characterName: character ? character.payload.name : "error",
                unknownString: "",
            },
        };
    }
    async getCharactersLoginInfoSolo(client, characterId) {
        const SinglePlayerCharacters = await this.loadCharacterData(client);
        let character;
        switch (client.gameVersion) {
            default:
            case enums_1.GAME_VERSIONS.H1Z1_15janv_2015: {
                character = SinglePlayerCharacters.find((character) => character.characterId === characterId);
                character.characterName = character.payload.name;
                break;
            }
            case enums_1.GAME_VERSIONS.H1Z1_KOTK_PS3:
            case enums_1.GAME_VERSIONS.H1Z1_6dec_2016: {
                character = SinglePlayerCharacters.find((character) => character.characterId === characterId);
                break;
            }
        }
        return {
            unknownQword1: "0x0",
            unknownDword1: 0,
            unknownDword2: 0,
            status: 1,
            applicationData: {
                serverAddress: `${this._soloPlayIp}:1117`,
                serverTicket: client.loginSessionId,
                encryptionKey: this._cryptoKey,
                guid: characterId,
                unknownQword2: "0x0",
                stationName: "",
                characterName: character.characterName,
                unknownString: "",
            },
        };
    }
    async CharacterLoginRequest(client, packet) {
        let charactersLoginInfo;
        const { serverId, characterId } = packet;
        let characterExistOnZone = 1;
        if (!this._soloMode) {
            charactersLoginInfo = await this.getCharactersLoginInfo(serverId, characterId, client.loginSessionId);
            characterExistOnZone = (await this.askZone(serverId, "CharacterExistRequest", { characterId: characterId }));
        }
        else {
            charactersLoginInfo = await this.getCharactersLoginInfoSolo(client, characterId);
        }
        if (client.gameVersion === enums_1.GAME_VERSIONS.H1Z1_KOTK_PS3) {
            charactersLoginInfo.applicationData = h1z1_dataschema_1.default.pack(loginpackets_1.applicationDataKOTK, charactersLoginInfo.applicationData).data;
        }
        debug(charactersLoginInfo);
        if (charactersLoginInfo.status) {
            charactersLoginInfo.status = Number(characterExistOnZone);
        }
        this.sendData(client, "CharacterLoginReply", charactersLoginInfo);
        debug("CharacterLoginRequest");
    }
    async askZone(serverId, packetName, packetObj) {
        const askZonePromise = await new Promise((resolve) => {
            this._internalReqCount++;
            const reqId = this._internalReqCount;
            try {
                const zoneConnectionIndex = Object.values(this._zoneConnections).findIndex((e) => e === serverId);
                const zoneConnectionString = Object.keys(this._zoneConnections)[zoneConnectionIndex];
                const [address, port] = zoneConnectionString.split(":");
                this._h1emuLoginServer.sendData({
                    address: address,
                    port: port,
                    clientId: zoneConnectionString,
                    serverId: 1, // TODO: that's a hack
                }, packetName, { reqId: reqId, ...packetObj });
                this._pendingInternalReq[reqId] = resolve;
                this._pendingInternalReqTimeouts[reqId] = setTimeout(() => {
                    delete this._pendingInternalReq[reqId];
                    delete this._pendingInternalReqTimeouts[reqId];
                    resolve(0);
                }, 5000);
            }
            catch (e) {
                resolve(0);
            }
        });
        return askZonePromise;
    }
    async CharacterCreateRequest(client, packet) {
        const { payload: { characterName }, serverId, payload, } = packet;
        // create character object
        let sampleCharacter, newCharacter;
        switch (client.gameVersion) {
            case enums_1.GAME_VERSIONS.H1Z1_15janv_2015: {
                sampleCharacter = require("../../../data/2015/sampleData/single_player_character.json");
                newCharacter = utils_1._.cloneDeep(sampleCharacter);
                newCharacter.payload.name = characterName;
                break;
            }
            default:
            case enums_1.GAME_VERSIONS.H1Z1_KOTK_PS3:
            case enums_1.GAME_VERSIONS.H1Z1_6dec_2016: {
                sampleCharacter = require("../../../data/2016/sampleData/character.json");
                newCharacter = utils_1._.cloneDeep(sampleCharacter);
                newCharacter.characterName = characterName;
                break;
            }
        }
        newCharacter.serverId = serverId;
        newCharacter.characterId = (0, utils_1.generateRandomGuid)();
        let creationStatus = 1;
        if (this._soloMode) {
            const SinglePlayerCharacters = await this.loadCharacterData(client);
            switch (client.gameVersion) {
                case enums_1.GAME_VERSIONS.H1Z1_15janv_2015: {
                    SinglePlayerCharacters[SinglePlayerCharacters.length] = newCharacter;
                    fs_1.default.writeFileSync(`${this._appDataFolder}/single_player_characters.json`, JSON.stringify(SinglePlayerCharacters, null, "\t"));
                    break;
                }
                default:
                case enums_1.GAME_VERSIONS.H1Z1_6dec_2016: {
                    const characterModelData = (0, functions_1.getCharacterModelData)(payload);
                    newCharacter = {
                        ...newCharacter,
                        actorModelId: characterModelData.modelId,
                        headActor: characterModelData.headActor,
                        gender: payload.gender,
                        hairModel: characterModelData.hairModel,
                    };
                    SinglePlayerCharacters[SinglePlayerCharacters.length] = newCharacter;
                    fs_1.default.writeFileSync(`${this._appDataFolder}/single_player_characters2016.json`, JSON.stringify(SinglePlayerCharacters, null, "\t"));
                    break;
                }
                case enums_1.GAME_VERSIONS.H1Z1_KOTK_PS3: {
                    const characterModelData = (0, functions_1.getCharacterModelData)(payload);
                    newCharacter = {
                        ...newCharacter,
                        actorModelId: characterModelData.modelId,
                        headActor: characterModelData.headActor,
                        gender: payload.gender,
                        hairModel: characterModelData.hairModel,
                    };
                    SinglePlayerCharacters[SinglePlayerCharacters.length] = newCharacter;
                    fs_1.default.writeFileSync(`${this._appDataFolder}/single_player_charactersKOTK.json`, JSON.stringify(SinglePlayerCharacters, null, "\t"));
                    break;
                }
            }
        }
        else {
            let sessionObj;
            const storedUserSession = await this._db
                ?.collection(enums_1.DB_COLLECTIONS.USERS_SESSIONS)
                .findOne({ authKey: client.loginSessionId, serverId: serverId });
            if (storedUserSession) {
                sessionObj = storedUserSession;
            }
            else {
                sessionObj = {
                    serverId: serverId,
                    authKey: client.loginSessionId,
                    guid: (0, utils_1.generateRandomGuid)(),
                };
                await this._db
                    ?.collection(enums_1.DB_COLLECTIONS.USERS_SESSIONS)
                    .insertOne(sessionObj);
            }
            let newCharacterData;
            switch (client.gameVersion) {
                case enums_1.GAME_VERSIONS.H1Z1_15janv_2015: {
                    newCharacterData = { ...newCharacter, ownerId: sessionObj.guid };
                    break;
                }
                default:
                case enums_1.GAME_VERSIONS.H1Z1_KOTK_PS3:
                case enums_1.GAME_VERSIONS.H1Z1_6dec_2016: {
                    newCharacterData = {
                        characterId: newCharacter.characterId,
                        serverId: newCharacter.serverId,
                        ownerId: sessionObj.guid,
                        payload: packet.payload,
                        status: 1,
                    };
                    break;
                }
            }
            creationStatus = (await this.askZone(serverId, "CharacterCreateRequest", {
                characterObjStringify: JSON.stringify(newCharacterData),
            }))
                ? 1
                : 0;
            if (creationStatus === 1) {
                await this._db.collection(enums_1.DB_COLLECTIONS.CHARACTERS_LIGHT).insertOne({
                    authKey: client.loginSessionId,
                    serverId: serverId,
                    gameVersion: client.gameVersion,
                    payload: { name: characterName },
                    characterId: newCharacter.characterId,
                    status: 1,
                });
            }
            newCharacter;
        }
        const characterCreateReply = {
            status: creationStatus,
            characterId: newCharacter.characterId,
        };
        this.sendData(client, "CharacterCreateReply", characterCreateReply);
    }
    async start() {
        debug("Starting server");
        if (this._mongoAddress) {
            const mongoClient = new mongodb_1.MongoClient(this._mongoAddress, {
                maxPoolSize: 100,
            });
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
            this.updateServersStatus();
        }
        if (this._soloMode) {
            (0, utils_1.setupAppDataFolder)();
        }
        this._soeServer.start(this._crcLength, this._udpLength);
        if (this._mongoAddress && this._enableHttpServer) {
            this._httpServer = new worker_threads_1.Worker(`${__dirname}/workers/httpServer.js`, {
                workerData: {
                    MONGO_URL: this._mongoAddress,
                    SERVER_PORT: this._httpServerPort,
                },
            });
            this._httpServer.on("message", (message) => {
                const { type, requestId, data } = message;
                switch (type) {
                    case "pingzone": {
                        const response = {
                            type: "pingzone",
                            requestId: requestId,
                            data: Object.values(this._zoneConnections).includes(data)
                                ? "pong"
                                : "error",
                        };
                        this._httpServer.postMessage(response);
                        break;
                    }
                    case "ping": {
                        const response = {
                            type: "ping",
                            requestId: requestId,
                            data: "pong",
                        };
                        this._httpServer.postMessage(response);
                        break;
                    }
                    default:
                        break;
                }
            });
        }
    }
    deleteAllLocalCharacters() {
        // used for testing / benchmarks
        if (fs_1.default.existsSync(`${this._appDataFolder}/single_player_characters.json`)) {
            fs_1.default.unlinkSync(`${this._appDataFolder}/single_player_characters.json`);
        }
    }
    stop() {
        debug("Shutting down");
        process.exitCode = 0;
    }
};
LoginServer = __decorate([
    healthWorker_1.healthThreadDecorator
], LoginServer);
exports.LoginServer = LoginServer;
if (process.env.VSCODE_DEBUG === "true") {
    const PackageSetting = require("../../../package.json");
    process.env.H1Z1_SERVER_VERSION = PackageSetting.version;
    new LoginServer(1115, process.env.MONGO_URL).start();
}
//# sourceMappingURL=loginserver.js.map