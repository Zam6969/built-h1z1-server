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
exports.Plant = void 0;
const itemobject_1 = require("./itemobject");
const enums_1 = require("../models/enums");
class Plant extends itemobject_1.ItemObject {
    constructor(characterId, transientId, actorModelId, position, rotation, server, spawnerId, item, parentObjectCharacterId, slot) {
        super(characterId, transientId, actorModelId, position, rotation, server, spawnerId, item);
        this.growState = 0;
        this.growTime = 28800000; // 8h;
        this.isFertilized = false;
        this.isLightweight = false;
        this.npcRenderDistance = 30;
        this.parentObjectCharacterId = parentObjectCharacterId;
        this.slot = slot;
        this.nextStateTime = new Date().getTime() + this.growTime;
        if (!server._temporaryObjects[parentObjectCharacterId])
            return;
        const parent = server._temporaryObjects[parentObjectCharacterId];
        if (parent.isFertilized)
            this.isFertilized = true;
        if (this.item.itemDefinitionId == enums_1.Items.SEED_CORN) {
            this.nameId = enums_1.StringIds.CORN;
        }
        else
            this.nameId = enums_1.StringIds.WHEAT;
    }
    grow(server) {
        if (this.growState == 3)
            return;
        this.growState++;
        switch (this.item.itemDefinitionId) {
            case enums_1.Items.SEED_CORN:
                switch (this.growState) {
                    case 1:
                        this.actorModelId = 59;
                        break;
                    case 2:
                        this.actorModelId = 60;
                        break;
                    case 3:
                        this.actorModelId = 61;
                        break;
                }
                break;
            case enums_1.Items.SEED_WHEAT:
                switch (this.growState) {
                    case 1:
                        this.actorModelId = 9191;
                        break;
                    case 2:
                        this.actorModelId = 9190;
                        break;
                    case 3:
                        this.actorModelId = 9189;
                        break;
                }
        }
        server.sendDataToAllWithSpawnedEntity(server._plants, this.characterId, "Character.ReplaceBaseModel", {
            characterId: this.characterId,
            modelId: this.actorModelId,
        });
        if (this.isFertilized) {
            server.sendDataToAllWithSpawnedEntity(server._plants, this.characterId, "Command.PlayDialogEffect", {
                characterId: this.characterId,
                effectId: 5056,
            });
        }
        const timeToAdd = this.isFertilized ? this.growTime / 2 : this.growTime; // 4 or 8h based on fertilized or not
        this.nextStateTime = new Date().getTime() + timeToAdd;
    }
    /* eslint-disable @typescript-eslint/no-unused-vars */
    OnPlayerSelect(server, client, isInstant
    /* eslint-enable @typescript-eslint/no-unused-vars */
    ) {
        if (this.growState != 3)
            return;
        if (!server._temporaryObjects[this.parentObjectCharacterId]) {
            server.deleteEntity(this.characterId, server._plants);
            return;
        }
        const parent = server._temporaryObjects[this.parentObjectCharacterId];
        delete parent.seedSlots[this.slot];
        switch (this.item.itemDefinitionId) {
            case enums_1.Items.SEED_WHEAT:
                client.character.lootItem(server, server.generateItem(enums_1.Items.WHEAT));
                client.character.lootItem(server, server.generateItem(enums_1.Items.SEED_WHEAT, 2), 2);
                break;
            case enums_1.Items.SEED_CORN:
                client.character.lootItem(server, server.generateItem(enums_1.Items.CORN));
                client.character.lootItem(server, server.generateItem(enums_1.Items.SEED_CORN, 2), 2);
                break;
        }
        server.sendCompositeEffectToAllWithSpawnedEntity(server._plants, this, 5151);
        server.deleteEntity(this.characterId, server._plants);
    }
    OnInteractionString(server, client) {
        if (this.growState != 3)
            return;
        server.sendData(client, "Command.InteractionString", {
            guid: this.characterId,
            stringId: enums_1.StringIds.TAKE_ITEM,
        });
    }
    OnFullCharacterDataRequest(server, client) {
        if (!this.isFertilized)
            return;
        server.sendData(client, "Command.PlayDialogEffect", {
            characterId: this.characterId,
            effectId: 5056,
        });
    }
}
exports.Plant = Plant;
//# sourceMappingURL=plant.js.map