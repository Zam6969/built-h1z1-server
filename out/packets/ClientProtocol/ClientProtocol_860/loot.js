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
exports.lootPackets = void 0;
const shared_1 = require("./shared");
exports.lootPackets = [
    [
        "Loot.Reply",
        0x6901,
        {
            fields: [
                {
                    name: "items",
                    type: "array",
                    defaultValue: [],
                    fields: [...shared_1.lootItemSchema],
                },
            ],
        },
    ],
    ["Loot.Request", 0x6902, {}],
    ["Loot.DiscardRequest", 0x6903, {}],
    ["Loot.LootAllRequest", 0x6904, {}],
];
//# sourceMappingURL=loot.js.map