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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.packetDescriptors = exports.packetTypes = void 0;
const packettable_1 = __importDefault(require("./packettable"));
const packets = [
    [
        "LoginRequest",
        0x01,
        {
            fields: [
                { name: "characterId", type: "int64string" },
                { name: "ticket", type: "string" },
                { name: "clientProtocol", type: "string" },
                { name: "clientBuild", type: "string" },
            ],
        },
    ],
    [
        "LoginReply",
        0x02,
        {
            fields: [{ name: "loggedIn", type: "boolean" }],
        },
    ],
    [
        "Logout",
        0x03,
        {
            fields: [],
        },
    ],
    [
        "ForceDisconnect",
        0x04,
        {
            fields: [],
        },
    ],
    ["TunnelPacketToExternalConnection", 0x05, {}],
    ["TunnelPacketFromExternalConnection", 0x06, {}],
    [
        "ChannelIsRoutable",
        0x07,
        {
            fields: [{ name: "isRoutable", type: "boolean" }],
        },
    ],
    [
        "ConnectionIsNotRoutable",
        0x08,
        {
            fields: [],
        },
    ],
];
_a = (0, packettable_1.default)(packets), exports.packetTypes = _a[0], exports.packetDescriptors = _a[1];
const GatewayPackets = {
    Packets: exports.packetDescriptors,
    PacketDescriptors: exports.packetTypes,
};
exports.default = GatewayPackets;
//# sourceMappingURL=gatewaypackets.js.map