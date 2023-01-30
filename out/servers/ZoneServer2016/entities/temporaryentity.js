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
exports.TemporaryEntity = void 0;
const basesimplenpc_1 = require("./basesimplenpc");
class TemporaryEntity extends basesimplenpc_1.BaseSimpleNpc {
    constructor(characterId, transientId, actorModelId, position, rotation, server) {
        super(characterId, transientId, actorModelId, position, rotation, server);
        this.npcRenderDistance = 40;
    }
    setDespawnTimer(server, time) {
        if (this.disappearTimer)
            this.disappearTimer.refresh();
        this.disappearTimer = setTimeout(() => {
            server.deleteEntity(this.characterId, server._temporaryObjects);
        }, time);
    }
}
exports.TemporaryEntity = TemporaryEntity;
//# sourceMappingURL=temporaryentity.js.map