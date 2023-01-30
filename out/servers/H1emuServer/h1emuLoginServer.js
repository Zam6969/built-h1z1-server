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
exports.H1emuLoginServer = void 0;
const h1emuserver_1 = require("./shared/h1emuserver");
class H1emuLoginServer extends h1emuserver_1.H1emuServer {
    constructor(serverPort) {
        super(serverPort);
        this.messageHandler = function (messageType, data, client) {
            const packet = this._protocol.parse(data);
            if (!packet)
                return;
            switch (packet.name) {
                case "Ping":
                    this.ping(client);
                    break;
                case "CharacterCreateReply":
                case "CharacterExistReply":
                case "CharacterDeleteReply":
                case "ClientIsAdminReply": {
                    this.emit("processInternalReq", packet, ["status"]);
                    break;
                }
                default:
                    this.emit("data", null, client, packet);
                    break;
            }
        };
        this.ping = (client) => {
            this.updateClientLastPing(client.clientId);
            super.ping(client);
        };
        this._pingTimer = setTimeout(() => {
            for (const key in this._clients) {
                const client = this._clients[key];
                if (Date.now() > client.lastPing + this._pingTimeout) {
                    this.emit("disconnect", null, client, 1);
                    delete this._clients[client.clientId];
                }
            }
            this._pingTimer.refresh();
        }, this._pingTime);
    }
}
exports.H1emuLoginServer = H1emuLoginServer;
//# sourceMappingURL=h1emuLoginServer.js.map