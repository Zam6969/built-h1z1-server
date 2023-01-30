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
exports.GatewayClient = void 0;
const debug = require("debug")("GatewayClient");
const events_1 = require("events");
const h1emu_core_1 = require("h1emu-core");
const soeclient_1 = require("./soeclient");
class GatewayClient extends events_1.EventEmitter {
    constructor(serverAddress, serverPort, key, localPort) {
        super();
        this._soeClient = new soeclient_1.SOEClient("ExternalGatewayApi_3", serverAddress, serverPort, key, localPort);
        this._protocol = new h1emu_core_1.GatewayProtocol();
        // @ts-ignore
        this._soeClient.on("appdata", (err, data) => {
            const packet = JSON.parse(this._protocol.parse(data));
            switch (packet.name) {
                case "LoginReply":
                    if (packet.logged_in) {
                        this.emit("login", null, { result: packet });
                    }
                    break;
                case "TunnelPacket":
                    this.emit("tunneldata", null, Buffer.from(packet.tunnel_data), packet.flags);
                    break;
            }
        });
        // @ts-ignore
        this._soeClient.on("connect", (err, result) => {
            debug("Connected to login server");
            this._soeClient.toggleEncryption(false);
            this.emit("connect", err, result);
        });
    }
    connect() {
        debug("Connecting to gateway server");
        this._soeClient.connect();
    }
    sendTunnelData(tunnelData, channel) {
        channel = channel || 0;
        debug("Sending tunnel data to gateway server");
        const data = this._protocol.pack_tunnel_data_packet_for_server(tunnelData);
        this._soeClient.sendAppData(data, true);
    }
    login(characterId, ticket, clientProtocol, clientBuild) {
        debug("Sending login request");
        const data = this._protocol.pack_login_request_packet(BigInt(characterId), ticket, clientProtocol, clientBuild);
        this._soeClient.sendAppData(data, false);
        this._soeClient.toggleEncryption(true);
    }
}
exports.GatewayClient = GatewayClient;
//# sourceMappingURL=gatewayclient.js.map