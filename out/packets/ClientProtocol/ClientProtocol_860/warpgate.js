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
exports.warpgatePackets = void 0;
exports.warpgatePackets = [
    ["Warpgate.ActivateTerminal", 0xa801, {}],
    ["Warpgate.ZoneRequest", 0xa802, {}],
    ["Warpgate.PostQueueNotify", 0xa803, {}],
    ["Warpgate.QueueForZone", 0xa804, {}],
    ["Warpgate.CancelQueue", 0xa805, {}],
    ["Warpgate.WarpToQueuedZone", 0xa806, {}],
    ["Warpgate.WarpToSocialZone", 0xa807, {}],
];
//# sourceMappingURL=warpgate.js.map