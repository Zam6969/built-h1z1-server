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
exports.mountPackets = void 0;
const shared_1 = require("./shared");
exports.mountPackets = [
    ["Mount.MountRequest", 0x7001, {}],
    [
        "Mount.MountResponse",
        0x7002,
        {
            fields: [
                { name: "characterId", type: "uint64string", defaultValue: "0" },
                { name: "guid", type: "uint64string", defaultValue: "0" },
                { name: "unknownDword1", type: "uint32", defaultValue: 0 },
                { name: "unknownDword2", type: "uint32", defaultValue: 1 },
                { name: "unknownDword3", type: "uint32", defaultValue: 1 },
                { name: "unknownDword4", type: "uint32", defaultValue: 0 },
                {
                    name: "characterData",
                    type: "schema",
                    fields: [
                        { name: "unknownDword1", type: "uint32", defaultValue: 0 },
                        { name: "unknownDword2", type: "uint32", defaultValue: 0 },
                        { name: "unknownDword3", type: "uint32", defaultValue: 0 },
                        {
                            name: "characterName",
                            type: "string",
                            defaultValue: "LocalPlayer",
                        },
                        { name: "unknownString1", type: "string", defaultValue: "" },
                    ],
                },
                { name: "tagString", type: "string", defaultValue: "" },
                { name: "unknownDword5", type: "uint32", defaultValue: 0 },
            ],
        },
    ],
    [
        "Mount.DismountRequest",
        0x7003,
        {
            fields: [{ name: "unknownByte1", type: "uint8", defaultValue: 0 }],
        },
    ],
    [
        "Mount.DismountResponse",
        0x7004,
        {
            fields: [
                { name: "characterId", type: "uint64string", defaultValue: "0" },
                { name: "guid", type: "uint64string", defaultValue: "0" },
                { name: "unknownDword1", type: "uint32", defaultValue: 0 },
                { name: "unknownBoolean1", type: "boolean", defaultValue: false },
                { name: "unknownByte1", type: "uint8", defaultValue: 0 },
            ],
        },
    ],
    [
        "Mount.List",
        0x7005,
        {
            fields: [
                {
                    name: "List",
                    type: "array",
                    fields: [
                        { name: "unknownDword1", type: "uint32", defaultValue: 0 },
                        { name: "unknownDword2", type: "uint32", defaultValue: 0 },
                        { name: "unknownDword3", type: "uint32", defaultValue: 0 },
                        { name: "unknownQword1", type: "uint64string", defaultValue: "0" },
                        { name: "unknownBoolean1", type: "boolean", defaultValue: 0 },
                        { name: "unknownDword4", type: "uint32", defaultValue: 0 },
                        { name: "unknownString1", type: "string", defaultValue: "" },
                    ],
                },
            ],
        },
    ],
    ["Mount.Spawn", 0x7006, {}],
    ["Mount.Despawn", 0x7007, {}],
    ["Mount.SpawnByItemDefinitionId", 0x7008, {}],
    ["Mount.OfferUpsell", 0x7009, {}],
    [
        "Mount.SeatChangeRequest",
        0x700a,
        { fields: [{ name: "seatId", type: "uint8", defaultValue: 0 }] },
    ],
    [
        "Mount.SeatChangeResponse",
        0x700b,
        {
            fields: [
                { name: "characterId", type: "uint64string", defaultValue: "0" },
                { name: "vehicleId", type: "uint64string", defaultValue: "0" },
                { name: "unknownDword1", type: "uint32", defaultValue: 1 },
                { name: "unknownDword2", type: "uint32", defaultValue: 2 },
                { name: "unknownDword3", type: "uint32", defaultValue: 3 },
            ],
        },
    ],
    [
        "Mount.SeatSwapRequest",
        0x700c,
        {
            fields: [
                { name: "characterId", type: "uint64string", defaultValue: "0" },
                shared_1.identitySchema,
                { name: "unknownDword3", type: "uint32", defaultValue: 0 },
            ],
        },
    ],
    ["Mount.SeatSwapResponse", 0x700d, {}],
    ["Mount.TypeCount", 0x700e, {}],
];
//# sourceMappingURL=mount.js.map