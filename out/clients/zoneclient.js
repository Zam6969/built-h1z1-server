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
exports.ZoneClient = void 0;
const events_1 = require("events");
const gatewayclient_1 = require("./gatewayclient");
const h1z1protocol_1 = require("../protocols/h1z1protocol");
const debug = require("debug")("ZoneClient");
class ZoneClient extends events_1.EventEmitter {
    constructor(serverAddress, serverPort, key, characterId, ticket, clientProtocol, clientBuild, localPort) {
        super();
        this._gatewayClient = new gatewayclient_1.GatewayClient(serverAddress, serverPort, key, localPort);
        this._protocol = new h1z1protocol_1.H1Z1Protocol();
        this._characterId = characterId;
        this._ticket = ticket;
        this._clientProtocol = clientProtocol;
        this._clientBuild = clientBuild;
        this._referenceData;
        this._environment = "";
        this._serverId = 0;
        const me = this;
        let n = 0;
        this._gatewayClient.on("tunneldata", (err, data, flags) => {
            debug("Received tunnel data (" + data.length + " bytes)");
            n++;
            //fs.writeFileSync("dump/tunneldata_" + n + ".dat", data);
            let packet;
            try {
                packet = this._protocol.parse(data, flags);
            }
            catch (e) {
                //fs.writeFileSync("tunneldata_" + n + ".dat", data);
                debug("Failed parsing tunnel data: tunneldata_" + n + ".dat");
                return;
            }
            if (packet) {
                //fs.writeFileSync("dump/tunneldata_" + n + ".json", JSON.stringify(packet,null,2));
                switch (packet.name) {
                    case "ZoneDoneSendingInitialData":
                        me.emit("ZoneDoneSendingInitialData", null, {});
                        break;
                    case "InitializationParameters":
                        me.emit("initializationParameters", null, packet.data);
                        break;
                    case "ReferenceDataWeaponDefinitions":
                        me.emit("referenceDataWeaponDefinitions", null, packet.data);
                        break;
                    case "SendZoneDetails":
                        me.emit("zoneDetails", null, packet.data);
                        break;
                    case "ClientUpdateBaseZonePopulation":
                        me.emit("zonePopulation", null, packet.data.populations);
                        break;
                    case "ClientUpdateBaseRespawnLocations":
                        me.emit("respawnLocations", null, packet.data.locations);
                        break;
                    case "ClientGameSettings":
                        me.emit("clientGameSettings", null, packet.data);
                        break;
                    case "VehicleBaseLoadVehicleDefinitionManager":
                        me.emit("loadVehicleDefinitionManager", null, packet.data.vehicleDefinitions);
                        break;
                    case "CommandBaseItemDefinitions":
                        me.emit("itemDefinitions", null, packet.data);
                        break;
                    case "SendSelfToClient":
                        me.emit("sendSelfToClient", null, packet.data.self);
                        this._gatewayClient.sendTunnelData(this._protocol.pack("ClientInitializationDetails", {
                            unknownDword1: 7200,
                        }), 0);
                        this._gatewayClient.sendTunnelData(this._protocol.pack("SetLocale", {
                            locale: "en_US",
                        }), 1);
                        this._gatewayClient.sendTunnelData(this._protocol.pack("GetContinentBattleInfo"), 1);
                        this._gatewayClient.sendTunnelData(this._protocol.pack("GetRewardBuffInfo"));
                        this._gatewayClient.sendTunnelData(this._protocol.pack("ClientIsReady"));
                        break;
                }
            }
        });
        this._gatewayClient.on("connect", (err, result) => {
            debug("Connected to gateway server");
            me.emit("connect", err, result);
            this._gatewayClient.login(characterId, ticket, clientProtocol, clientBuild);
        });
        this._gatewayClient.on("disconnect", (err, result) => {
            debug("Disconnected");
            me.emit("disconnect", err, result);
        });
    }
    connect() {
        debug("Connecting to gateway server");
        this._gatewayClient.connect();
    }
    login() { }
    disconnect() { }
    setReferenceData(data) {
        this._referenceData = data;
    }
}
exports.ZoneClient = ZoneClient;
//# sourceMappingURL=zoneclient.js.map