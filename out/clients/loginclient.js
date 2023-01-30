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
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginClient = void 0;
const events_1 = require("events");
const soeclient_1 = require("./soeclient");
const loginprotocol_1 = require("../protocols/loginprotocol");
const loginProtocolName = "LoginUdp_9";
const debug = require("debug")("LoginClient");
class LoginClient extends events_1.EventEmitter {
    constructor(gameId, environment, serverAddress, serverPort, loginKey, localPort) {
        super();
        this.requestCharacterDelete = function () { };
        this._gameId = gameId;
        this._environment = environment;
        this._soeClient = new soeclient_1.SOEClient(loginProtocolName, serverAddress, serverPort, loginKey, localPort);
        this._protocol = new loginprotocol_1.LoginProtocol();
        let n = 0;
        this._soeClient.on("connect", (err, result) => {
            debug("Connected to login server");
            this.login("FiNgErPrInT");
        });
        this._soeClient.on("disconnect", (err, result) => {
            debug("Disconnected");
        });
        this._soeClient.on("appdata", (err, data) => {
            n++;
            let packet, result;
            try {
                packet = this._protocol.parse(data);
            }
            catch (e) {
                debug("Failed parsing app data loginclient_appdata_" + n + ".dat");
                return;
            }
            result = packet.result;
            switch (packet.name) {
                case "LoginReply":
                    if (result.status === 1) {
                        this.emit("login", null, {
                            loggedIn: result.loggedIn,
                            isMember: result.isMember,
                        });
                    }
                    else {
                        this.emit("login", "Login failed");
                    }
                    break;
                case "ForceDisconnect":
                    break;
                case "CharacterLoginReply":
                    if (result.status === 1) {
                        debug(JSON.stringify(result, null, 4));
                        this.emit("characterlogin", null, result);
                    }
                    else {
                        this.emit("characterlogin", "Character login failed");
                    }
                    break;
                case "CharacterCreateReply":
                    if (result.status === 1) {
                        this.emit("charactercreate", null, {
                            characterId: result.characterId,
                        });
                    }
                    else {
                        this.emit("charactercreate", "Character create failed");
                    }
                    break;
                case "CharacterDeleteReply":
                    if (result.status === 1) {
                        this.emit("characterdelete", null, {});
                    }
                    else {
                        this.emit("characterdelete", "Character delete failed");
                    }
                    break;
                case "CharacterSelectInfoReply":
                    if (result.status === 1) {
                        this.emit("characterinfo", null, result);
                    }
                    else {
                        this.emit("characterinfo", "Character info failed");
                    }
                    break;
                case "ServerListReply":
                    this.emit("serverlist", null, {
                        servers: result.servers,
                    });
                    break;
                case "ServerUpdate":
                    if (result.status === 1) {
                        this.emit("serverupdate", null, result.server);
                    }
                    else {
                        this.emit("serverupdate", "Server update failed");
                    }
                    break;
                case "TunnelAppPacketServerToClient":
                    break;
            }
        });
    }
    connect() {
        debug("Connecting to login server");
        this._soeClient.connect();
    }
    login(fingerprint) {
        const data = this._protocol.pack("LoginRequest", {
            sessionId: this._soeClient._sessionId.toString(),
            systemFingerPrint: fingerprint,
        });
        debug("Sending login request");
        this._soeClient.sendAppData(data, true);
        this.emit("connect");
    }
    disconnect() {
        this.emit("disconnect");
    }
    requestServerList() {
        debug("Requesting server list");
        const data = this._protocol.pack("ServerListRequest");
        this._soeClient.sendAppData(data, true);
    }
    requestCharacterInfo() {
        debug("Requesting character info");
        const data = this._protocol.pack("CharacterSelectInfoRequest");
        this._soeClient.sendAppData(data, true);
    }
    requestCharacterLogin(characterId, serverId, payload) {
        debug("Requesting character login");
        const data = this._protocol.pack("CharacterLoginRequest", {
            characterId: characterId,
            serverId: serverId,
            payload: payload,
        });
        if (data) {
            this._soeClient.sendAppData(data, true);
        }
        else {
            debug("Could not pack character login request data");
        }
    }
    requestCharacterCreate() {
        debug("Requesting character create");
        const data = this._protocol.pack("CharacterCreateRequest", {
            serverId: 1,
            unknown: 0,
            payload: {
                empireId: 2,
                headType: 1,
                profileType: 3,
                gender: 1,
                characterName: "test",
            },
        });
        if (data) {
            this._soeClient.sendAppData(data, true);
        }
        else {
            debug("Could not pack character create request data");
        }
    }
}
exports.LoginClient = LoginClient;
//# sourceMappingURL=loginclient.js.map