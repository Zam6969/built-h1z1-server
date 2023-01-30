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
exports.LogicalPacket = void 0;
class LogicalPacket {
    constructor(data, sequence) {
        this.sequence = sequence;
        this.data = data;
        this.isReliable = data[1] === 9 || data[1] === 13;
    }
}
exports.LogicalPacket = LogicalPacket;
//# sourceMappingURL=logicalPacket.js.map