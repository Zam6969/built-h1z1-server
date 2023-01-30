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
exports.ExplosiveEntity = void 0;
const utils_1 = require("../../../utils/utils");
const enums_1 = require("../models/enums");
const baselightweightcharacter_1 = require("./baselightweightcharacter");
class ExplosiveEntity extends baselightweightcharacter_1.BaseLightweightCharacter {
    constructor(characterId, transientId, actorModelId, position, rotation, server, itemDefinitionId) {
        super(characterId, transientId, actorModelId, position, rotation, server);
        this.npcRenderDistance = 300;
        this.detonated = false;
        this.itemDefinitionId = itemDefinitionId;
    }
    isIED() {
        return this.itemDefinitionId == enums_1.Items.IED;
    }
    isLandmine() {
        return this.itemDefinitionId == enums_1.Items.LANDMINE;
    }
    ignite(server, client) {
        if (!this.isIED()) {
            return;
        }
        server.sendDataToAllWithSpawnedEntity(server._explosives, this.characterId, "Command.PlayDialogEffect", {
            characterId: this.characterId,
            effectId: 5034,
        });
        server.sendDataToAllWithSpawnedEntity(server._explosives, this.characterId, "Command.PlayDialogEffect", {
            characterId: this.characterId,
            effectId: 185,
        });
        setTimeout(() => {
            this.detonate(server, client);
        }, 10000);
    }
    detonate(server, client) {
        if (!server._explosives[this.characterId] || this.detonated)
            return;
        this.detonated = true;
        server.sendCompositeEffectToAllInRange(600, "", this.state.position, 1875);
        server.deleteEntity(this.characterId, server._explosives);
        client
            ? server.explosionDamage(this.state.position, this.characterId, client)
            : server.explosionDamage(this.state.position, this.characterId);
    }
    arm(server) {
        this.mineTimer = setTimeout(() => {
            if (!server._explosives[this.characterId]) {
                return;
            }
            for (const a in server._clients) {
                if ((0, utils_1.getDistance)(server._clients[a].character.state.position, this.state.position) < 0.6) {
                    this.detonate(server);
                    return;
                }
            }
            for (const a in server._vehicles) {
                if ((0, utils_1.getDistance)(server._vehicles[a].state.position, this.state.position) <
                    2.2) {
                    this.detonate(server);
                    return;
                }
            }
            if (server._explosives[this.characterId]) {
                this.mineTimer?.refresh();
            }
        }, 90);
    }
    OnProjectileHit(server, damageInfo) {
        this.detonate(server, server.getClientByCharId(damageInfo.entity));
    }
}
exports.ExplosiveEntity = ExplosiveEntity;
//# sourceMappingURL=explosiveentity.js.map