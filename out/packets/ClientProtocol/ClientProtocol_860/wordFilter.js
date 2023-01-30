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
exports.wordFilterPackets = void 0;
exports.wordFilterPackets = [
    [
        "WordFilter.Data",
        0xc001,
        {
            fields: [{ name: "wordFilterData", type: "byteswithlength" }],
        },
    ],
];
//# sourceMappingURL=wordFilter.js.map