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
exports.CollectingEntity = void 0;
const enums_1 = require("../models/enums");
const loadouts_1 = require("../data/loadouts");
function getSubEntityData(entity, child) {
    switch (entity.itemDefinitionId) {
        case enums_1.Items.DEW_COLLECTOR:
            entity.defaultLoadout = loadouts_1.lootableContainerDefaultLoadouts.dew_collector;
            child.workingEffect = 0;
            break;
        case enums_1.Items.ANIMAL_TRAP:
            entity.defaultLoadout = loadouts_1.lootableContainerDefaultLoadouts.animal_trap;
            child.workingEffect = 0;
            break;
    }
}
class CollectingEntity {
    constructor(parentObject, server) {
        this.workingEffect = 5028;
        this.tickTime = 60000;
        this.requiredTicks = 15; // 15 min to fill
        this.currentTicks = 0;
        this.wasUsed = false;
        this.subType = "CollectingEntity"; // for saving identification
        this.parentObject = parentObject;
        if (!parentObject.getParent(server)) {
            this.dictionary = server._worldLootableConstruction;
        }
        else
            this.dictionary = server._lootableConstruction;
        getSubEntityData(parentObject, this);
        this.startWorking(server, parentObject);
        const container = parentObject.getContainer();
        switch (parentObject.itemDefinitionId) {
            case enums_1.Items.ANIMAL_TRAP:
                if (container) {
                    container.canAcceptItems = false;
                }
                break;
            case enums_1.Items.DEW_COLLECTOR:
                if (container) {
                    container.acceptedItems = [enums_1.Items.WATER_EMPTY];
                }
        }
    }
    startWorking(server, parentObject) {
        const container = parentObject.getContainer();
        if (!container)
            return;
        if (!this.dictionary[parentObject.characterId]) {
            return;
        }
        const checkEmpty = JSON.stringify(container.items) === "{}";
        switch (parentObject.itemDefinitionId) {
            case enums_1.Items.ANIMAL_TRAP:
                if (checkEmpty) {
                    if (this.wasUsed) {
                        server.deleteEntity(parentObject.characterId, this.dictionary);
                        return;
                    }
                    if (!this.wasUsed)
                        this.currentTicks++;
                    if (this.currentTicks >= this.requiredTicks) {
                        this.currentTicks = 0;
                        this.wasUsed = true;
                        server.addContainerItemExternal(parentObject.mountedCharacter
                            ? parentObject.mountedCharacter
                            : "", server.generateItem(enums_1.Items.MEAT_RABBIT), container, 1);
                        parentObject.actorModelId = 35;
                        server.sendDataToAllWithSpawnedEntity(this.dictionary, parentObject.characterId, "Character.ReplaceBaseModel", {
                            characterId: parentObject.characterId,
                            modelId: parentObject.actorModelId,
                        });
                    }
                }
                setTimeout(() => {
                    this.startWorking(server, parentObject);
                }, this.tickTime);
                return;
            case enums_1.Items.DEW_COLLECTOR:
                let passed = false;
                Object.values(container.items).forEach((item) => {
                    if (passed)
                        return;
                    if (item.itemDefinitionId != enums_1.Items.WATER_EMPTY)
                        return;
                    this.currentTicks++;
                    passed = true;
                    if (this.currentTicks >= this.requiredTicks) {
                        this.currentTicks = 0;
                        server.removeContainerItem(this.parentObject, item, parentObject.getContainer(), 1);
                        server.addContainerItemExternal(parentObject.mountedCharacter
                            ? parentObject.mountedCharacter
                            : "", server.generateItem(enums_1.Items.WATER_STAGNANT), container, 1);
                        return;
                    }
                });
                if (!passed)
                    this.currentTicks = 0;
                setTimeout(() => {
                    this.startWorking(server, parentObject);
                }, this.tickTime);
                return;
        }
    }
    OnInteractionString(server, client) {
        server.sendData(client, "Command.InteractionString", {
            guid: this.parentObject.characterId,
            stringId: enums_1.StringIds.OPEN,
        });
    }
}
exports.CollectingEntity = CollectingEntity;
//# sourceMappingURL=collectingentity.js.map