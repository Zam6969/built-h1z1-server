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
exports.containerPackets = void 0;
const shared_1 = require("./shared");
exports.containerPackets = [
    [
        "Container.MoveItem",
        0xc90100,
        {
            fields: [
                { name: "containerGuid", type: "uint64string", defaultValue: "" },
                { name: "characterId", type: "uint64string", defaultValue: "" },
                { name: "itemGuid", type: "uint64string", defaultValue: "" },
                { name: "targetCharacterId", type: "uint64string", defaultValue: "" },
                { name: "count", type: "uint32", defaultValue: 0 },
                { name: "newSlotId", type: "uint32", defaultValue: 0 },
            ],
        },
    ],
    [
        "Container.InitEquippedContainers",
        0xc90200,
        {
            fields: [
                { name: "ignore", type: "uint64string", defaultValue: "" },
                { name: "characterId", type: "uint64string", defaultValue: "" },
                {
                    name: "containers",
                    type: "array",
                    defaultValue: [],
                    fields: shared_1.containers,
                },
            ],
        },
    ],
    [
        "Container.Error",
        0xc90300,
        {
            fields: [
                { name: "characterId", type: "uint64string", defaultValue: "0" },
                { name: "containerError", type: "uint32", defaultValue: 0 },
            ],
        },
    ],
    [
        "Container.ListAll",
        0xc90500,
        {
            fields: [
                { name: "characterId", type: "uint64string", defaultValue: "" },
                {
                    name: "containers",
                    type: "array",
                    defaultValue: [],
                    fields: shared_1.containerData,
                },
                {
                    name: "array1",
                    type: "array",
                    defaultValue: [],
                    fields: [
                        { name: "unknownQword1", type: "uint64string", defaultValue: "" },
                        { name: "unknownDword1", type: "uint32", defaultValue: 0 },
                    ],
                },
                { name: "unknownDword1", type: "uint32", defaultValue: 1 },
            ],
        },
    ],
    [
        "Container.UpdateEquippedContainer",
        0xc90600,
        {
            fields: [
                { name: "ignore", type: "uint64string", defaultValue: "" },
                { name: "characterId", type: "uint64string", defaultValue: "" },
                { name: "containerData", type: "schema", fields: shared_1.containerData },
            ],
        },
    ],
];
//# sourceMappingURL=container.js.map