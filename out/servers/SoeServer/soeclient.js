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
const utils_1 = require("../../utils/utils");
const soeinputstream_1 = require("./soeinputstream");
const soeoutputstream_1 = require("./soeoutputstream");
class SOEClient {
    constructor(remote, crcSeed, cryptoKey) {
        this.sessionId = 0;
        this.crcLength = 2;
        this.clientUdpLength = 512;
        this.serverUdpLength = 512;
        this.packetsSentThisSec = 0;
        this.useEncryption = true;
        this.waitingQueue = { packets: [], CurrentByteLength: 0 };
        this.outQueue = [];
        this.protocolName = "unset";
        this.unAckData = new Map();
        this.outOfOrderPackets = [];
        this.nextAck = new utils_1.wrappedUint16(-1);
        this.lastAck = new utils_1.wrappedUint16(-1);
        this.isDeleted = false;
        this.stats = {
            totalPacketSent: 0,
            packetsOutOfOrder: 0,
            packetResend: 0,
        };
        this.lastAckTime = 0;
        this.avgPing = 0;
        this.pings = [];
        this.avgPingLen = 6;
        this.soeClientId = remote.address + ":" + remote.port;
        this.address = remote.address;
        this.port = remote.port;
        this.crcSeed = crcSeed;
        this.inputStream = new soeinputstream_1.SOEInputStream(cryptoKey);
        this.outputStream = new soeoutputstream_1.SOEOutputStream(cryptoKey);
        this._statsResetTimer = setInterval(() => this._resetStats(), 60000);
    }
    closeTimers() {
        clearInterval(this._statsResetTimer);
    }
    _resetStats() {
        this.stats.totalPacketSent = 0;
        this.stats.packetsOutOfOrder = 0;
        this.stats.packetResend = 0;
    }
    getNetworkStats() {
        const { totalPacketSent, packetResend, packetsOutOfOrder } = this.stats;
        const packetLossRate = Number((packetResend / totalPacketSent).toFixed(3)) * 100;
        const packetOutOfOrderRate = Number((packetsOutOfOrder / totalPacketSent).toFixed(3)) * 100;
        return [
            `Packet loss rate ${packetLossRate}%`,
            `Packet outOfOrder rate ${packetOutOfOrderRate}%`,
            `Avg ping ${this.avgPing}ms`,
        ];
    }
    addPing(ping) {
        if (ping > 0) {
            this.pings.push(ping);
        }
        if (this.pings.length > this.avgPingLen) {
            this.pings.shift();
        }
        this._updateAvgPing();
    }
    _updateAvgPing() {
        this.avgPing = (0, utils_1.toInt)(utils_1._.sum(this.pings) / this.pings.length);
    }
}
exports.default = SOEClient;
//# sourceMappingURL=soeclient.js.map