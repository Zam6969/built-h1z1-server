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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SOEServer = void 0;
const events_1 = require("events");
const h1emu_core_1 = require("h1emu-core");
const soeclient_1 = __importDefault(require("./soeclient"));
const worker_threads_1 = require("worker_threads");
const logicalPacket_1 = require("./logicalPacket");
const debug = require("debug")("SOEServer");
process.env.isBin && require("../shared/workers/udpServerWorker.js");
class SOEServer extends events_1.EventEmitter {
    constructor(serverPort, cryptoKey, disableAntiDdos) {
        super();
        this._udpLength = 512;
        this._useEncryption = true;
        this._clients = new Map();
        this._crcSeed = 0;
        this._crcLength = 2;
        this._waitQueueTimeMs = 50;
        this._pingTimeoutTime = 60000;
        this._usePingTimeout = false;
        this._resendTimeout = 500;
        this.packetRatePerClient = 500;
        this._ackTiming = 80;
        this._routineTiming = 3;
        this._allowRawDataReception = true;
        Buffer.poolSize = 8192 * 4;
        this._serverPort = serverPort;
        this._cryptoKey = cryptoKey;
        this._maxMultiBufferSize = this._udpLength - 4 - this._crcLength;
        this._connection = new worker_threads_1.Worker(`${__dirname}/../shared/workers/udpServerWorker.js`, {
            workerData: { serverPort: serverPort, disableAntiDdos },
        });
        setInterval(() => {
            this.resetPacketsSent();
        }, 1000);
    }
    getSoeClient(soeClientId) {
        return this._clients.get(soeClientId);
    }
    resetPacketsSent() {
        for (const client of this._clients.values()) {
            client.packetsSentThisSec = 0;
        }
    }
    _sendPhysicalPacket(client, packet) {
        client.packetsSentThisSec++;
        client.stats.totalPacketSent++;
        this._connection.postMessage({
            type: "sendPacket",
            data: {
                packetData: packet,
                port: client.port,
                address: client.address,
            },
        });
    }
    sendOutQueue(client) {
        debug("Sending out queue");
        while (client.packetsSentThisSec < this.packetRatePerClient) {
            const logicalPacket = client.outQueue.shift();
            if (logicalPacket) {
                // if is a reliable packet
                if (logicalPacket.isReliable && logicalPacket.sequence) {
                    client.unAckData.set(logicalPacket.sequence, Date.now());
                }
                this._sendPhysicalPacket(client, logicalPacket.data);
            }
            else {
                break;
            }
        }
    }
    // Send pending packets from client, in priority ones from the priority queue
    checkClientOutQueues(client) {
        if (client.outQueue.length > 0) {
            this.sendOutQueue(client);
        }
    }
    soeRoutine() {
        for (const client of this._clients.values()) {
            this.soeClientRoutine(client);
        }
        this._soeClientRoutineLoopMethod(() => this.soeRoutine(), this._routineTiming);
    }
    // Executed at the same rate for every client
    soeClientRoutine(client) {
        if (client.lastAckTime + this._ackTiming < Date.now()) {
            // Acknowledge received packets
            this.checkAck(client);
            this.checkOutOfOrderQueue(client);
            client.lastAckTime = Date.now();
        }
        // Send pending packets
        this.checkResendQueue(client);
        this.checkClientOutQueues(client);
    }
    // If a packet hasn't been acknowledge in the timeout time, then resend it via the priority queue
    checkResendQueue(client) {
        const currentTime = Date.now();
        for (const [sequence, time] of client.unAckData) {
            if (time + this._resendTimeout < currentTime) {
                client.outputStream.resendData(sequence);
                client.unAckData.delete(sequence);
            }
        }
    }
    // Use the lastAck value to acknowlege multiple packets as a time
    // This function could be called less often but rn it will stick that way
    checkAck(client) {
        if (client.lastAck.get() != client.nextAck.get()) {
            client.lastAck.set(client.nextAck.get());
            this._sendLogicalPacket(client, "Ack", {
                sequence: client.nextAck.get(),
            });
        }
    }
    resetPacketsQueue(queue) {
        queue.packets = [];
        queue.CurrentByteLength = 0;
    }
    setupResendForQueuedPackets(client, queue) {
        for (let index = 0; index < queue.packets.length; index++) {
            const packet = queue.packets[index];
            if (packet.isReliable) {
                client.unAckData.set(packet.sequence, Date.now() + this._waitQueueTimeMs);
            }
        }
    }
    // send the queued packets
    sendClientWaitQueue(client, queue) {
        if (queue.timer) {
            clearTimeout(queue.timer);
            queue.timer = undefined;
        }
        if (queue.packets.length) {
            this._sendLogicalPacket(client, "MultiPacket", {
                sub_packets: queue.packets.map((packet) => {
                    return Array.from(packet.data);
                }),
            });
            // if a packet in the waiting queue is a reliable packet, then we need to set the timeout
            this.setupResendForQueuedPackets(client, queue);
            this.resetPacketsQueue(queue);
        }
    }
    // If some packets are received out of order then we Acknowledge then one by one
    checkOutOfOrderQueue(client) {
        if (client.outOfOrderPackets.length) {
            for (let i = 0; i < client.outOfOrderPackets.length; i++) {
                const sequence = client.outOfOrderPackets.shift();
                if (sequence > client.lastAck.get()) {
                    this._sendLogicalPacket(client, "OutOfOrder", {
                        sequence: sequence,
                    });
                }
            }
        }
    }
    _createClient(clientId, remote) {
        const client = new soeclient_1.default(remote, this._crcSeed, this._cryptoKey);
        this._clients.set(clientId, client);
        return client;
    }
    handlePacket(client, packet) {
        switch (packet.name) {
            case "SessionRequest":
                debug("Received session request from " + client.address + ":" + client.port);
                client.sessionId = packet.session_id;
                client.clientUdpLength = packet.udp_length;
                client.protocolName = packet.protocol;
                client.serverUdpLength = this._udpLength;
                client.crcSeed = this._crcSeed;
                client.crcLength = this._crcLength;
                client.inputStream.setEncryption(this._useEncryption);
                client.outputStream.setEncryption(this._useEncryption);
                client.outputStream.setFragmentSize(client.clientUdpLength - 7); // TODO: 7? calculate this based on crc enabled / compression etc
                if (this._usePingTimeout) {
                    client.lastPingTimer = setTimeout(() => {
                        this.emit("disconnect", client);
                    }, this._pingTimeoutTime);
                }
                this._sendLogicalPacket(client, "SessionReply", {
                    session_id: client.sessionId,
                    crc_seed: client.crcSeed,
                    crc_length: client.crcLength,
                    encrypt_method: 0,
                    udp_length: client.serverUdpLength,
                }, true);
                break;
            case "Disconnect":
                debug("Received disconnect from client");
                this.emit("disconnect", client);
                break;
            case "MultiPacket": {
                for (let i = 0; i < packet.sub_packets.length; i++) {
                    const subPacket = packet.sub_packets[i];
                    this.handlePacket(client, subPacket);
                }
                break;
            }
            case "Ping":
                debug("Received ping from client");
                if (this._usePingTimeout) {
                    client.lastPingTimer.refresh();
                }
                this._sendLogicalPacket(client, "Ping", {}, true);
                break;
            case "NetStatusRequest":
                debug("Received net status request from client");
                break;
            case "Data":
                client.inputStream.write(Buffer.from(packet.data), packet.sequence, false);
                break;
            case "DataFragment":
                client.inputStream.write(Buffer.from(packet.data), packet.sequence, true);
                break;
            case "OutOfOrder":
                client.addPing(Date.now() +
                    this._waitQueueTimeMs -
                    client.unAckData.get(packet.sequence));
                client.outputStream.removeFromCache(packet.sequence);
                client.unAckData.delete(packet.sequence);
                break;
            case "Ack":
                const mostWaitedPacketTime = client.unAckData.get(client.outputStream.lastAck.get());
                if (mostWaitedPacketTime) {
                    client.addPing(Date.now() + this._waitQueueTimeMs - mostWaitedPacketTime);
                }
                client.outputStream.ack(packet.sequence, client.unAckData);
                break;
            default:
                console.log(`Unknown SOE packet received from ${client.sessionId}`);
                console.log(packet);
        }
    }
    start(crcLength, udpLength) {
        if (crcLength !== undefined) {
            this._crcLength = crcLength;
        }
        this._protocol = new h1emu_core_1.Soeprotocol(Boolean(this._crcLength), this._crcSeed);
        if (udpLength !== undefined) {
            this._udpLength = udpLength;
        }
        this._soeClientRoutineLoopMethod = setTimeout;
        this._soeClientRoutineLoopMethod(() => this.soeRoutine(), this._routineTiming);
        this._connection.on("message", (message) => {
            const data = Buffer.from(message.data);
            try {
                let client;
                const clientId = message.remote.address + ":" + message.remote.port;
                debug(data.length + " bytes from ", clientId);
                // if doesn't know the client
                if (!this._clients.has(clientId)) {
                    if (data[1] !== 1) {
                        return;
                    }
                    client = this._createClient(clientId, message.remote);
                    client.inputStream.on("appdata", (data) => {
                        this.emit("appdata", client, data);
                    });
                    client.inputStream.on("error", (err) => {
                        console.error(err);
                        this.emit("disconnect", client);
                    });
                    client.inputStream.on("ack", (sequence) => {
                        client.nextAck.set(sequence);
                    });
                    client.inputStream.on("outoforder", (outOfOrderSequence) => {
                        client.stats.packetsOutOfOrder++;
                        client.outOfOrderPackets.push(outOfOrderSequence);
                    });
                    client.outputStream.on("data", (data, sequence, fragment, unbuffered) => {
                        this._sendLogicalPacket(client, fragment ? "DataFragment" : "Data", {
                            sequence: sequence,
                            data: data,
                        }, unbuffered);
                    });
                    // the only difference with the event "data" is that resended data is send via the priority queue
                    client.outputStream.on("dataResend", (data, sequence, fragment) => {
                        client.stats.packetResend++;
                        this._sendLogicalPacket(client, fragment ? "DataFragment" : "Data", {
                            sequence: sequence,
                            data: data,
                        });
                    });
                }
                else {
                    client = this._clients.get(clientId);
                }
                if (data[0] === 0x00) {
                    const raw_parsed_data = this._protocol.parse(data);
                    if (raw_parsed_data) {
                        const parsed_data = JSON.parse(raw_parsed_data);
                        if (parsed_data.name === "Error") {
                            console.error(parsed_data.error);
                        }
                        else {
                            this.handlePacket(client, parsed_data);
                        }
                    }
                    else {
                        console.error("Unmanaged packet from client", clientId, data);
                    }
                }
                else {
                    if (this._allowRawDataReception) {
                        debug("Raw data received from client", clientId, data);
                        this.emit("appdata", client, data, true); // Unreliable + Unordered
                    }
                    else {
                        debug("Raw data received from client but raw data reception isn't enabled", clientId, data);
                    }
                }
            }
            catch (e) {
                console.log(e);
                process.exitCode = 1;
            }
        });
        this._connection.postMessage({ type: "bind" });
    }
    stop() {
        this._connection.postMessage({ type: "close" });
        process.exitCode = 0;
    }
    packLogicalData(packetName, packet) {
        let logicalData;
        switch (packetName) {
            case "SessionRequest":
                logicalData = this._protocol.pack_session_request_packet(packet.session_id, packet.crc_length, packet.udp_length, packet.protocol);
                break;
            case "SessionReply":
                logicalData = this._protocol.pack_session_reply_packet(packet.session_id, packet.crc_seed, packet.crc_length, packet.encrypt_method, packet.udp_length);
                break;
            case "MultiPacket":
                logicalData = this._protocol.pack_multi_fromjs(packet);
                break;
            case "Ack":
                logicalData = this._protocol.pack_ack_packet(packet.sequence);
                break;
            case "OutOfOrder":
                logicalData = this._protocol.pack_out_of_order_packet(packet.sequence);
                break;
            case "Data":
                logicalData = this._protocol.pack_data_packet(packet.data, packet.sequence);
                break;
            case "DataFragment":
                logicalData = this._protocol.pack_fragment_data_packet(packet.data, packet.sequence);
                break;
            default:
                logicalData = this._protocol.pack(packetName, JSON.stringify(packet));
                break;
        }
        return Buffer.from(logicalData);
    }
    // Build the logical packet via the soeprotocol
    createLogicalPacket(packetName, packet) {
        try {
            const logicalPacket = new logicalPacket_1.LogicalPacket(this.packLogicalData(packetName, packet), packet.sequence);
            return logicalPacket;
        }
        catch (e) {
            console.error(`Failed to create packet ${packetName} packet data : ${JSON.stringify(packet, null, 4)}`);
            console.error(e);
            process.exitCode = 444;
            // @ts-ignore
            return null;
        }
    }
    _addPacketToQueue(logicalPacket, queue) {
        const fullBufferedPacketLen = logicalPacket.data.length + 1; // the additionnal byte is the length of the packet written in the buffer when assembling the packet
        queue.packets.push(logicalPacket);
        queue.CurrentByteLength += fullBufferedPacketLen;
    }
    _canBeBuffered(logicalPacket, queue) {
        return (this._waitQueueTimeMs > 0 &&
            logicalPacket.data.length < 255 &&
            queue.CurrentByteLength + logicalPacket.data.length <=
                this._maxMultiBufferSize);
    }
    _addPacketToBuffer(client, logicalPacket, queue) {
        this._addPacketToQueue(logicalPacket, queue);
        if (!queue.timer) {
            queue.timer = setTimeout(() => {
                this.sendClientWaitQueue(client, queue);
            }, this._waitQueueTimeMs);
        }
    }
    // The packets is builded from schema and added to one of the queues
    _sendLogicalPacket(client, packetName, packet, unbuffered = false) {
        const logicalPacket = this.createLogicalPacket(packetName, packet);
        if (!unbuffered &&
            packetName !== "MultiPacket" &&
            this._canBeBuffered(logicalPacket, client.waitingQueue)) {
            this._addPacketToBuffer(client, logicalPacket, client.waitingQueue);
        }
        else {
            if (packetName !== "MultiPacket") {
                this.sendClientWaitQueue(client, client.waitingQueue);
            }
            client.outQueue.push(logicalPacket);
        }
    }
    // Called by the application to send data to a client
    sendAppData(client, data) {
        if (client.outputStream.isUsingEncryption()) {
            debug("Sending app data: " + data.length + " bytes with encryption");
        }
        else {
            debug("Sending app data: " + data.length + " bytes");
        }
        client.outputStream.write(data);
    }
    sendUnbufferedAppData(client, data) {
        if (client.outputStream.isUsingEncryption()) {
            debug("Sending unbuffered app data: " + data.length + " bytes with encryption");
        }
        else {
            debug("Sending unbuffered app data: " + data.length + " bytes");
        }
        client.outputStream.write(data, true);
    }
    setEncryption(client, value) {
        client.outputStream.setEncryption(value);
        client.inputStream.setEncryption(value);
    }
    toggleEncryption(client) {
        client.outputStream.toggleEncryption();
        client.inputStream.toggleEncryption();
    }
    deleteClient(client) {
        client.closeTimers();
        this._clients.delete(client.address + ":" + client.port);
        debug("client connection from port : ", client.port, " deleted");
    }
}
exports.SOEServer = SOEServer;
exports.SOEServer = SOEServer;
//# sourceMappingURL=soeserver.js.map