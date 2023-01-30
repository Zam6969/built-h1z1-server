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
const packettable_1 = __importDefault(require("../../packettable"));
const packets = [
    [
        "nameValidationRequest",
        0x01,
        {
            fields: [{ name: "characterName", type: "string" }],
        },
    ],
    [
        "nameValidationReply",
        0x02,
        {
            fields: [
                { name: "firstName", type: "string" },
                { name: "lastName", type: "string", defaultValue: " " },
                { name: "status", type: "uint32" },
            ],
        },
    ],
];
_a = (0, packettable_1.default)(packets), exports.packetTypes = _a[0], exports.packetDescriptors = _a[1];
const loginTunnelPackets = {
    Packets: exports.packetDescriptors,
    PacketTypes: exports.packetTypes,
};
exports.default = loginTunnelPackets;
//# sourceMappingURL=loginTunnelPackets.js.map