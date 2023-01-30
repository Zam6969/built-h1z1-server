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
exports.SmeltingEntity = void 0;
const enums_1 = require("../models/enums");
const Recipes_1 = require("../data/Recipes");
const loadouts_1 = require("../data/loadouts");
function getAllowedFuel(itemDefinitionId) {
    switch (itemDefinitionId) {
        case enums_1.Items.FURNACE:
            return [
                enums_1.Items.WOOD_LOG,
                enums_1.Items.WEAPON_BRANCH,
                enums_1.Items.WOOD_PLANK,
                enums_1.Items.WOOD_STICK,
                enums_1.Items.CHARCOAL,
            ];
        case enums_1.Items.BARBEQUE:
            return [
                enums_1.Items.WEAPON_BRANCH,
                enums_1.Items.WOOD_STICK,
                enums_1.Items.WOOD_PLANK,
                enums_1.Items.CHARCOAL,
            ];
        case enums_1.Items.CAMPFIRE:
            return [
                enums_1.Items.WOOD_LOG,
                enums_1.Items.WEAPON_BRANCH,
                enums_1.Items.WOOD_PLANK,
                enums_1.Items.WOOD_STICK,
                enums_1.Items.CHARCOAL,
            ];
        default:
            return [
                enums_1.Items.WOOD_LOG,
                enums_1.Items.WEAPON_BRANCH,
                enums_1.Items.WOOD_PLANK,
                enums_1.Items.CHARCOAL,
            ];
    }
}
function getBurningTime(itemDefinitionId) {
    switch (itemDefinitionId) {
        case enums_1.Items.WOOD_LOG:
            return 120000;
        case enums_1.Items.CHARCOAL:
            return 180000;
        case enums_1.Items.WOOD_PLANK:
            return 60000;
        case enums_1.Items.WOOD_STICK:
            return 30000;
        case enums_1.Items.WEAPON_BRANCH:
            return 120000;
        default:
            return 30000;
    }
}
function getSmeltingEntityData(entity, child) {
    switch (entity.itemDefinitionId) {
        case enums_1.Items.FURNACE:
            child.filterId = enums_1.FilterIds.FURNACE;
            entity.defaultLoadout = loadouts_1.lootableContainerDefaultLoadouts.furnace;
            child.workingEffect = 5028;
            break;
        case enums_1.Items.CAMPFIRE:
            child.filterId = enums_1.FilterIds.COOKING;
            entity.defaultLoadout = loadouts_1.lootableContainerDefaultLoadouts.campfire;
            child.workingEffect = 1207;
            break;
        case enums_1.Items.BARBEQUE:
            child.filterId = enums_1.FilterIds.COOKING;
            entity.defaultLoadout = loadouts_1.lootableContainerDefaultLoadouts.barbeque;
            child.workingEffect = 5044;
            break;
        default:
            child.filterId = enums_1.FilterIds.FURNACE;
            entity.defaultLoadout = loadouts_1.lootableContainerDefaultLoadouts.furnace;
            child.workingEffect = 5028;
            break;
    }
}
class SmeltingEntity {
    constructor(parentObject, server) {
        this.filterId = enums_1.FilterIds.FURNACE;
        this.workingEffect = 5028;
        this.isWorking = false;
        this.isSmelting = false;
        this.smeltingTime = 40000;
        this.subType = "SmeltingEntity"; // for saving identification
        this.parentObject = parentObject;
        this.allowedFuel = getAllowedFuel(parentObject.itemDefinitionId);
        getSmeltingEntityData(parentObject, this);
        if (!parentObject.getParent(server)) {
            this.dictionary = server._worldLootableConstruction;
        }
        else
            this.dictionary = server._lootableConstruction;
    }
    startWorking(server, parentObject) {
        const container = parentObject.getContainer();
        if (!container)
            return;
        if (JSON.stringify(container.items) === "{}") {
            if (this.isWorking) {
                server.sendDataToAllWithSpawnedEntity(this.dictionary, parentObject.characterId, "Command.PlayDialogEffect", {
                    characterId: parentObject.characterId,
                    effectId: 0,
                });
                this.isWorking = false;
            }
            return;
        }
        let allowBurn = false;
        Object.values(container.items).forEach((item) => {
            if (allowBurn)
                return;
            if (this.allowedFuel.includes(item.itemDefinitionId)) {
                server.removeContainerItem(this.parentObject, item, this.parentObject.getContainer(), 1);
                if (item.itemDefinitionId == enums_1.Items.WOOD_LOG) {
                    // give charcoal if wood log was burned
                    server.addContainerItemExternal(parentObject.mountedCharacter ? parentObject.mountedCharacter : "", server.generateItem(enums_1.Items.CHARCOAL), container, 1);
                }
                if (!this.isWorking) {
                    server.sendDataToAllWithSpawnedEntity(this.dictionary, parentObject.characterId, "Command.PlayDialogEffect", {
                        characterId: parentObject.characterId,
                        effectId: this.workingEffect,
                    });
                }
                this.isWorking = true;
                allowBurn = true;
                setTimeout(() => {
                    if (!this.isSmelting) {
                        this.startSmelting(server, parentObject);
                    }
                }, this.smeltingTime);
                setTimeout(() => {
                    this.startWorking(server, parentObject);
                }, getBurningTime(item.itemDefinitionId));
                return;
            }
        });
        if (allowBurn)
            return;
        this.isWorking = false;
        server.sendDataToAllWithSpawnedEntity(this.dictionary, parentObject.characterId, "Command.PlayDialogEffect", {
            characterId: parentObject.characterId,
            effectId: 0,
        });
    }
    startSmelting(server, parentObject) {
        if (!this.isWorking) {
            this.isSmelting = false;
            return;
        }
        const container = parentObject.getContainer();
        if (!container)
            return;
        if (JSON.stringify(container.items) === "{}")
            return;
        this.isSmelting = true;
        let passed = false;
        Object.keys(Recipes_1.smeltingData).forEach((data) => {
            if (passed)
                return;
            const recipe = Recipes_1.smeltingData[Number(data)];
            if (recipe.filterId == this.filterId) {
                const fulfilledComponents = [];
                const itemsToRemove = [];
                recipe.components.forEach((component) => {
                    if (passed)
                        return;
                    let requiredAmount = component.requiredAmount;
                    Object.values(container.items).forEach((item) => {
                        if (passed)
                            return;
                        if (!fulfilledComponents.includes(component)) {
                            if (component.itemDefinitionId == item.itemDefinitionId) {
                                if (requiredAmount > item.stackCount) {
                                    requiredAmount -= item.stackCount;
                                    itemsToRemove.push({ item: item, count: item.stackCount });
                                }
                                else {
                                    fulfilledComponents.push(component);
                                    itemsToRemove.push({ item: item, count: requiredAmount });
                                }
                                if (fulfilledComponents.length == recipe.components.length) {
                                    itemsToRemove.forEach((item) => {
                                        server.removeContainerItem(this.parentObject, item.item, this.parentObject.getContainer(), item.count);
                                    });
                                    passed = true;
                                    server.addContainerItemExternal(parentObject.mountedCharacter
                                        ? parentObject.mountedCharacter
                                        : "", server.generateItem(recipe.rewardId), container, 1);
                                    return;
                                }
                            }
                        }
                    });
                });
            }
        });
        setTimeout(() => {
            this.startSmelting(server, parentObject);
        }, this.smeltingTime);
    }
    OnInteractionString(server, client) {
        server.sendData(client, "Command.InteractionString", {
            guid: this.parentObject.characterId,
            stringId: enums_1.StringIds.USE_IGNITABLE,
        });
    }
    OnFullCharacterDataRequest(server, client) {
        if (!this.isWorking)
            return;
        server.sendData(client, "Command.PlayDialogEffect", {
            characterId: this.parentObject.characterId,
            effectId: this.workingEffect,
        });
    }
}
exports.SmeltingEntity = SmeltingEntity;
//# sourceMappingURL=smeltingentity.js.map