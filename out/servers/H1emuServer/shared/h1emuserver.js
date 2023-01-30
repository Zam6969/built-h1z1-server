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
exports.H1emuServer = void 0;
const events_1 = require("events");
const h1emuprotocol_1 = require("../../../protocols/h1emuprotocol");
const h1emuclient_1 = require("./h1emuclient");
const worker_threads_1 = require("worker_threads");
const debug = require("debug")("H1emuServer");
process.env.isBin && require("../../shared/workers/udpServerWorker.js");
class H1emuServer extends events_1.EventEmitter {
    constructor(serverPort) {
        super();
        this._udpLength = 512;
        this._clients = {};
        this._pingTime = 5000; // ms
        this._pingTimeout = 12000;
        this._serverPort = serverPort;
        this._protocol = new h1emuprotocol_1.H1emuProtocol();
        this._connection = new worker_threads_1.Worker(`${__dirname}/../../shared/workers/udpServerWorker.js`, {
            workerData: { serverPort: serverPort },
        });
    }
    clientHandler(remote, opcode) {
        let client;
        const clientId = `${remote.address}:${remote.port}`;
        if (!this._clients[clientId]) {
            // if client doesn't exist yet, only accept sessionrequest or sessionreply
            if (opcode !== 0x01 && opcode !== 0x02)
                return;
            client = this._clients[clientId] = new h1emuclient_1.H1emuClient(remote);
            this.updateClientLastPing(clientId);
        }
        else {
            client = this._clients[clientId];
        }
        return client;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    messageHandler(messageType, data, client) {
        throw new Error("You need to implement messageHandler !");
    }
    connectionHandler(message) {
        const { data: dataUint8, remote } = message;
        const data = Buffer.from(dataUint8);
        const client = this.clientHandler(remote, dataUint8[0]);
        if (client) {
            this.messageHandler(message.type, data, client);
        }
        else {
            debug(`Connection rejected from remote ${remote.address}:${remote.port}`);
        }
    }
    start() {
        this._connection.on("message", (message) => this.connectionHandler(message));
        this._connection.postMessage({ type: "bind" });
    }
    stop() {
        this._connection.postMessage({ type: "close" });
        process.exitCode = 0;
    }
    sendData(client, packetName, obj) {
        // blocks zone from sending packet without open session
        if (!client || (!client.serverId && packetName !== "SessionRequest"))
            return;
        const data = this._protocol.pack(packetName, obj);
        if (data) {
            this._connection.postMessage({
                type: "sendPacket",
                data: {
                    packetData: data,
                    port: client.port,
                    address: client.address,
                },
            }, [data.buffer]);
        }
    }
    ping(client) {
        this.sendData(client, "Ping", {});
    }
    updateClientLastPing(clientId) {
        this._clients[clientId].lastPing = Date.now();
    }
}
exports.H1emuServer = H1emuServer;
exports.H1emuServer = H1emuServer;
//# sourceMappingURL=h1emuserver.js.map