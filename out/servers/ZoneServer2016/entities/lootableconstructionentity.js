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
exports.LootableConstructionEntity = void 0;
const enums_1 = require("../models/enums");
const baselootableentity_1 = require("./baselootableentity");
const smeltingentity_1 = require("../classes/smeltingentity");
const loadouts_1 = require("../data/loadouts");
const collectingentity_1 = require("../classes/collectingentity");
class LootableConstructionEntity extends baselootableentity_1.BaseLootableEntity {
    get health() {
        return this._resources[enums_1.ResourceIds.CONSTRUCTION_CONDITION];
    }
    set health(health) {
        this._resources[enums_1.ResourceIds.CONSTRUCTION_CONDITION] = health;
    }
    constructor(characterId, transientId, actorModelId, position, rotation, server, itemDefinitionId, parentObjectCharacterId, subEntityType) {
        super(characterId, transientId, actorModelId, position, rotation, server);
        this.placementTime = Date.now();
        this.npcRenderDistance = 15;
        this.loadoutId = 5;
        this.parentObjectCharacterId = parentObjectCharacterId || "";
        this.itemDefinitionId = itemDefinitionId;
        const itemDefinition = server.getItemDefinition(itemDefinitionId);
        if (itemDefinition)
            this.nameId = itemDefinition.NAME_ID;
        this.profileId = 999; /// mark as construction
        this.health = 1000000;
        this.defaultLoadout = loadouts_1.lootableContainerDefaultLoadouts.storage;
        if (subEntityType === "SmeltingEntity") {
            this.subEntity = new smeltingentity_1.SmeltingEntity(this, server);
        }
        else if (subEntityType === "CollectingEntity") {
            this.subEntity = new collectingentity_1.CollectingEntity(this, server);
        }
    }
    damage(server, damageInfo) {
        // todo: redo this
        this.health -= damageInfo.damage;
    }
    getParent(server) {
        return (server._constructionFoundations[this.parentObjectCharacterId] ||
            server._constructionSimple[this.parentObjectCharacterId] ||
            undefined);
    }
    getParentFoundation(server) {
        const parent = this.getParent(server);
        if (!parent)
            return;
        if (server._constructionSimple[parent.characterId]) {
            return server._constructionSimple[parent.characterId].getParentFoundation(server);
        }
        return server._constructionFoundations[parent.characterId];
    }
    canUndoPlacement(server, client) {
        return (this.getHasPermission(server, client.character.characterId, enums_1.ConstructionPermissionIds.BUILD) &&
            Date.now() < this.placementTime + 120000 &&
            client.character.getEquippedWeapon().itemDefinitionId ==
                enums_1.Items.WEAPON_HAMMER_DEMOLITION);
    }
    destroy(server, destructTime = 0) {
        server.deleteEntity(this.characterId, server._lootableConstruction[this.characterId]
            ? server._lootableConstruction
            : server._worldLootableConstruction, 242, destructTime);
        const parent = this.getParent(server);
        if (parent && parent.freeplaceEntities[this.characterId]) {
            delete parent.freeplaceEntities[this.characterId];
        }
        if (!destructTime) {
            server.worldObjectManager.createLootbag(server, this);
            return;
        }
        setTimeout(() => {
            server.worldObjectManager.createLootbag(server, this);
        }, destructTime);
    }
    getHasPermission(server, characterId, permission) {
        return (this.getParentFoundation(server)?.getHasPermission(server, characterId, permission) || false);
    }
    /* eslint-disable @typescript-eslint/no-unused-vars */
    OnPlayerSelect(server, client, isInstant
    /* eslint-enable @typescript-eslint/no-unused-vars */
    ) {
        if (this.canUndoPlacement(server, client)) {
            this.destroy(server);
            client.character.lootItem(server, server.generateItem(this.itemDefinitionId));
            return;
        }
        super.OnPlayerSelect(server, client);
    }
    OnInteractionString(server, client) {
        if (this.canUndoPlacement(server, client)) {
            server.undoPlacementInteractionString(this, client);
            return;
        }
        if (this.subEntity) {
            this.subEntity.OnInteractionString(server, client);
            return;
        }
        server.sendData(client, "Command.InteractionString", {
            guid: this.characterId,
            stringId: enums_1.StringIds.OPEN,
        });
    }
    OnFullCharacterDataRequest(server, client) {
        if (this.subEntity) {
            if (!(this.subEntity instanceof smeltingentity_1.SmeltingEntity))
                return;
            this.subEntity.OnFullCharacterDataRequest(server, client);
        }
    }
}
exports.LootableConstructionEntity = LootableConstructionEntity;
//# sourceMappingURL=lootableconstructionentity.js.map