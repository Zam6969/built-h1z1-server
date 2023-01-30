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
exports.PlantingDiameter = void 0;
const temporaryentity_1 = require("./temporaryentity");
class PlantingDiameter extends temporaryentity_1.TemporaryEntity {
    constructor(characterId, transientId, actorModelId, position, rotation, server) {
        super(characterId, transientId, actorModelId, position, rotation, server);
        this.seedSlots = {};
        this.disappearTimestamp = new Date().getTime() + 86400000; // + 1 day
        this.isFertilized = false;
        this.fertilizedTimestamp = 0;
        this.npcRenderDistance = 30;
    }
}
exports.PlantingDiameter = PlantingDiameter;
//# sourceMappingURL=plantingdiameter.js.map