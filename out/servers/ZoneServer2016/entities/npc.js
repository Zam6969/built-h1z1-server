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
exports.Npc = void 0;
const basefullcharacter_1 = require("./basefullcharacter");
const utils_1 = require("../../../utils/utils");
const enums_1 = require("../../../utils/enums");
class Npc extends basefullcharacter_1.BaseFullCharacter {
    set isAlive(state) {
        this.flags.knockedOut = state ? 0 : 1;
    }
    get isAlive() {
        return this.flags.knockedOut ? 0 : 1;
    }
    constructor(characterId, transientId, actorModelId, position, rotation, server, spawnerId = 0) {
        super(characterId, transientId, actorModelId, position, rotation, server);
        this.npcRenderDistance = 80;
        this.deathTime = 0;
        this.flags = {
            bit0: 0,
            bit1: 0,
            bit2: 0,
            bit3: 0,
            bit4: 0,
            bit5: 0,
            bit6: 0,
            bit7: 0,
            bit8: 0,
            bit9: 0,
            bit10: 0,
            bit11: 0,
            projectileCollision: 1,
            bit13: 0,
            bit14: 0,
            bit15: 0,
            bit16: 0,
            bit17: 0,
            bit18: 0,
            bit19: 0,
            noCollide: 0,
            knockedOut: 0,
            bit22: 0,
            bit23: 0,
        };
        this.spawnerId = spawnerId;
        this.health = 10000;
    }
    damage(server, damageInfo) {
        const client = server.getClientByCharId(damageInfo.entity), oldHealth = this.health;
        if ((this.health -= damageInfo.damage) <= 0) {
            this.flags.knockedOut = 1;
            this.deathTime = Date.now();
            if (client) {
                if (!server._soloMode) {
                    (0, utils_1.logClientActionToMongo)(server._db.collection(enums_1.DB_COLLECTIONS.KILLS), client, server._worldId, { type: "zombie" });
                }
                client.character.metrics.zombiesKilled++;
            }
            server.sendDataToAllWithSpawnedEntity(server._npcs, this.characterId, "Character.StartMultiStateDeath", {
                characterId: this.characterId,
            });
        }
        if (client) {
            const damageRecord = server.generateDamageRecord(this.characterId, damageInfo, oldHealth);
            client.character.addCombatlogEntry(damageRecord);
        }
    }
    OnFullCharacterDataRequest(server, client) {
        server.sendData(client, "LightweightToFullNpc", this.pGetFull(server));
        if (this.onReadyCallback) {
            this.onReadyCallback(client);
            delete this.onReadyCallback;
        }
    }
    OnProjectileHit(server, damageInfo) {
        const client = server.getClientByCharId(damageInfo.entity);
        if (client && this.isAlive) {
            const hasHelmetBefore = this.hasHelmet(server);
            const hasArmorBefore = this.hasArmor(server);
            server.sendHitmarker(client, damageInfo.hitReport?.hitLocation, this.hasHelmet(server), this.hasArmor(server), hasHelmetBefore, hasArmorBefore);
        }
        switch (damageInfo.hitReport?.hitLocation) {
            case "HEAD":
            case "GLASSES":
            case "NECK":
                damageInfo.damage *= 4;
                break;
            default:
                break;
        }
        this.damage(server, damageInfo);
    }
}
exports.Npc = Npc;
Npc.isAlive = true;
//# sourceMappingURL=npc.js.map