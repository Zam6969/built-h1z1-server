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
exports.Lootbag = void 0;
const baselootableentity_1 = require("./baselootableentity");
const loadouts_1 = require("../data/loadouts");
class Lootbag extends baselootableentity_1.BaseLootableEntity {
    constructor(characterId, transientId, actorModelId, position, rotation, server) {
        super(characterId, transientId, actorModelId, position, rotation, server);
        this.creationTime = Date.now();
        this.canAcceptItems = false;
        this.loadoutId = 5;
        const container = this.getContainer();
        if (container)
            container.canAcceptItems = false;
        this.flags.noCollide = 1;
        this.npcRenderDistance = 50;
        this.defaultLoadout = loadouts_1.lootableContainerDefaultLoadouts.lootbag;
        this.equipLoadout(server);
    }
}
exports.Lootbag = Lootbag;
//# sourceMappingURL=lootbag.js.map