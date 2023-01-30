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
exports.Zombie = void 0;
const npc_1 = require("./npc");
class Zombie extends npc_1.Npc {
    constructor(characterId, transientId, actorModelId, position, rotation, server, spawnerId = 0) {
        super(characterId, transientId, actorModelId, position, rotation, server, spawnerId);
    }
}
exports.Zombie = Zombie;
//# sourceMappingURL=zombie.js.map