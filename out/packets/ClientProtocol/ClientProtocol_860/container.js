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
        "Container.InitEquippedContainers",
        0xcb02,
        {
            fields: [
                { name: "Unknown2", type: "uint16", defaultValue: 0 },
                shared_1.EquippedContainersSchema,
            ],
        },
    ],
    ["Container.Error", 0xcb03, {}],
    ["Container.PacketListAll", 0xcb05, {}],
    ["Container.UpdateEquippedContainer", 0xcb06, {}],
];
//# sourceMappingURL=container.js.map