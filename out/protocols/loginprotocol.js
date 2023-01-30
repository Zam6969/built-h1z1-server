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
exports.LoginProtocol = void 0;
const debug = require("debug")("LoginProtocol");
const h1z1_dataschema_1 = __importDefault(require("h1z1-dataschema"));
class LoginProtocol {
    constructor() {
        this.loginPackets =
            require("../packets/LoginUdp/LoginUdp_9/loginpackets").default;
        this.tunnelLoginPackets =
            require("../packets/LoginUdp/LoginUdp_9/loginTunnelPackets").default;
    }
    parse(data) {
        const packetType = data[0];
        let result;
        const packet = this.loginPackets.Packets[packetType];
        if (packet) {
            if (packet.name === "TunnelAppPacketClientToServer") {
                const { schema, name } = this.tunnelLoginPackets.Packets[data.readUInt8(13)];
                const tunnelData = data.slice(14);
                try {
                    result = h1z1_dataschema_1.default.parse(schema, tunnelData, 0).result;
                }
                catch (error) {
                    console.error(`${packet.name} : ${error}`);
                }
                return {
                    serverId: data.readUInt32LE(1),
                    unknown: data.readUInt32LE(5),
                    subPacketName: name,
                    packetLength: data.readUInt32LE(9),
                    name: packet.name,
                    result: result,
                };
            }
            else if (packet.schema) {
                debug(packet.name);
                try {
                    result = h1z1_dataschema_1.default.parse(packet.schema, data, 1).result;
                }
                catch (error) {
                    console.error(`${packet.name} : ${error}`);
                }
                debug("[DEBUG] Packet receive :");
                debug(result);
                return {
                    type: packet.type,
                    name: packet.name,
                    result: result,
                };
            }
            else {
                debug("parse()", "No schema for packet ", packet.name);
                return null;
            }
        }
        else {
            debug("parse() " + "Unknown or unhandled login packet type: " + packetType);
            return null;
        }
    }
    pack(packetName, object) {
        const packetType = this.loginPackets.PacketTypes[packetName];
        const packet = this.loginPackets.Packets[packetType];
        let payload;
        let data;
        if (packet) {
            if (packet.name === "TunnelAppPacketServerToClient") {
                const { subPacketOpcode } = object;
                const { schema } = this.tunnelLoginPackets.Packets[subPacketOpcode];
                let tunnelData;
                try {
                    tunnelData = h1z1_dataschema_1.default.pack(schema, object, undefined, undefined);
                }
                catch (error) {
                    console.error(`${subPacketOpcode} : ${error}`);
                    return Buffer.from("0");
                }
                const basePacketLength = 14;
                const opcodesLength = 1;
                data = new Buffer.alloc(basePacketLength + tunnelData.length);
                data.writeUInt8(packetType, 0);
                data.writeUInt32LE(object.serverId, 1);
                data.writeUInt32LE(0, 5);
                data.writeUInt32LE(tunnelData.length + opcodesLength, 9);
                data.writeUInt8(subPacketOpcode, 13);
                tunnelData.data.copy(data, basePacketLength);
                debug("tunnelpacket send data :", object);
            }
            else if (packet.schema) {
                debug("Packing data for " + packet.name);
                try {
                    payload = h1z1_dataschema_1.default.pack(packet.schema, object, undefined, undefined);
                }
                catch (error) {
                    console.error(`${packet.name} : ${error}`);
                    return null;
                }
                if (payload) {
                    data = Buffer.allocUnsafe(1 + payload.length);
                    data.writeUInt8(packetType, 0);
                    payload.data.copy(data, 1);
                }
                else {
                    debug("Could not pack data schema for " + packet.name);
                    return null;
                }
            }
            else {
                debug("pack()", "No schema for packet " + packet.name);
                return null;
            }
        }
        else {
            debug("pack()", "Unknown or unhandled login packet type: " + packetType);
            return null;
        }
        return data;
    }
}
exports.LoginProtocol = LoginProtocol;
exports.LoginProtocol = LoginProtocol;
//# sourceMappingURL=loginprotocol.js.map