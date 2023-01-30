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
exports.BaseSimpleNpc = void 0;
const baseentity_1 = require("./baseentity");
class BaseSimpleNpc extends baseentity_1.BaseEntity {
    constructor(characterId, transientId, actorModelId, position, rotation, server) {
        super(characterId, transientId, actorModelId, position, rotation, server);
        this.health = 100000;
    }
    pGetSimpleNpc() {
        return {
            characterId: this.characterId,
            transientId: this.transientId,
            position: this.state.position,
            rotation: this.state.rotation,
            modelId: this.actorModelId,
            scale: this.scale,
            showHealth: true,
            health: this.health / 1000,
        };
    }
    pGetSimpleProxyHealth() {
        return {
            characterId: this.characterId,
            healthPercentage: this.health / 1000,
        };
    }
}
exports.BaseSimpleNpc = BaseSimpleNpc;
//# sourceMappingURL=basesimplenpc.js.map