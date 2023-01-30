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
exports.equipmentPackets = void 0;
const shared_1 = require("./shared");
exports.equipmentPackets = [
    [
        "Equipment.SetCharacterEquipment",
        0x9501,
        {
            fields: [
                {
                    name: "characterData",
                    type: "schema",
                    fields: shared_1.equipmentCharacterSchema,
                },
                { name: "unknownDword1", type: "uint32", defaultValue: 0 },
                { name: "unknownString1", type: "string", defaultValue: "" },
                { name: "unknownString2", type: "string", defaultValue: "#" },
                {
                    name: "equipmentSlots",
                    type: "array",
                    defaultValue: [],
                    fields: shared_1.equipmentSlotSchema,
                },
                {
                    name: "attachmentData",
                    type: "array",
                    defaultValue: [],
                    fields: shared_1.attachmentSchema,
                },
                { name: "unknownBoolean1", type: "boolean", defaultValue: false },
            ],
        },
    ],
    [
        "Equipment.SetCharacterEquipmentSlot",
        0x9502,
        {
            fields: [
                {
                    name: "characterData",
                    type: "schema",
                    fields: shared_1.equipmentCharacterSchema,
                },
                {
                    name: "equipmentSlot",
                    type: "schema",
                    fields: shared_1.equipmentSlotSchema,
                },
                {
                    name: "attachmentData",
                    type: "schema",
                    fields: shared_1.attachmentSchema,
                },
            ],
        },
    ],
    [
        "Equipment.UnsetCharacterEquipmentSlot",
        0x9503,
        {
            fields: [
                {
                    name: "characterData",
                    type: "schema",
                    fields: shared_1.equipmentCharacterSchema,
                },
                { name: "unknownDword1", type: "uint32", defaultValue: 0 },
                { name: "slotId", type: "uint32", defaultValue: 0 },
            ],
        },
    ],
    [
        "Equipment.SetCharacterEquipmentSlots",
        0x9504,
        {
            fields: [
                {
                    name: "characterData",
                    type: "schema",
                    fields: shared_1.equipmentCharacterSchema,
                },
                { name: "gameTime", type: "uint32", defaultValue: 0 },
                {
                    name: "slots",
                    type: "array",
                    defaultValue: [],
                    fields: [
                        { name: "index", type: "uint32", defaultValue: 0 },
                        { name: "slotId", type: "uint32", defaultValue: 0 },
                    ],
                },
                { name: "unknownDword1", type: "uint32", defaultValue: 1 },
                { name: "unknownString1", type: "string", defaultValue: "" },
                { name: "unknownString2", type: "string", defaultValue: "#" },
                {
                    name: "equipmentSlots",
                    type: "array",
                    defaultValue: [],
                    fields: shared_1.equipmentSlotSchema,
                },
                {
                    name: "attachmentData",
                    type: "array",
                    defaultValue: [],
                    fields: shared_1.attachmentSchema,
                },
            ],
        },
    ],
];
//# sourceMappingURL=equipment.js.map