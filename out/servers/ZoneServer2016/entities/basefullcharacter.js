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
exports.BaseFullCharacter = void 0;
const enums_1 = require("../models/enums");
const baseItem_1 = require("../classes/baseItem");
const baselightweightcharacter_1 = require("./baselightweightcharacter");
const loadoutcontainer_1 = require("../classes/loadoutcontainer");
const loadoutItem_1 = require("../classes/loadoutItem");
const weapon_1 = require("../classes/weapon");
const debugName = "ZoneServer", debug = require("debug")(debugName);
const loadoutSlots = require("./../../../../data/2016/dataSources/LoadoutSlots.json"), loadoutSlotItemClasses = require("./../../../../data/2016/dataSources/LoadoutSlotItemClasses.json"), equipSlotItemClasses = require("./../../../../data/2016/dataSources/EquipSlotItemClasses.json");
function getGender(actorModelId) {
    switch (actorModelId) {
        case 9510: // zombiemale
        case 9240: // male character
            return 1;
        case 9634: // zombiefemale
        case 9474: // female character
            return 2;
        default:
            return 0;
    }
}
class BaseFullCharacter extends baselightweightcharacter_1.BaseLightweightCharacter {
    constructor(characterId, transientId, actorModelId, position, rotation, server) {
        super(characterId, transientId, actorModelId, position, rotation, server);
        this._resources = {};
        this._loadout = {};
        this._equipment = {};
        this._containers = {};
        this.loadoutId = 0;
        this.currentLoadoutSlot = 0; // idk if other full npcs use this
        this.isLightweight = false;
        this.defaultLoadout = [];
        this.gender = getGender(this.actorModelId);
    }
    getActiveLoadoutSlot(itemGuid) {
        // gets the loadoutSlotId of a specified itemGuid in the loadout
        for (const item of Object.values(this._loadout)) {
            if (itemGuid == item.itemGuid) {
                return item.slotId;
            }
        }
        return 0;
    }
    getLoadoutItem(itemGuid) {
        const loadoutSlotId = this.getActiveLoadoutSlot(itemGuid);
        if (this._loadout[loadoutSlotId]?.itemGuid == itemGuid) {
            return this._loadout[loadoutSlotId];
        }
        return;
    }
    getItemContainer(itemGuid) {
        // returns the container that an item is contained in
        for (const container of Object.values(this._containers)) {
            if (container.items[itemGuid]) {
                return container;
            }
        }
        return;
    }
    getInventoryItem(itemGuid) {
        const loadoutItem = this.getLoadoutItem(itemGuid);
        if (loadoutItem) {
            return loadoutItem;
        }
        else {
            const container = this.getItemContainer(itemGuid);
            const item = container?.items[itemGuid];
            if (!container || !item)
                return undefined;
            return item;
        }
    }
    getContainerFromGuid(containerGuid) {
        for (const container of Object.values(this._containers)) {
            if (container.itemGuid == containerGuid) {
                return container;
            }
        }
        return undefined;
    }
    getItemById(itemDefId) {
        for (const container of Object.values(this._containers)) {
            for (const item of Object.values(container.items)) {
                if (item.itemDefinitionId == itemDefId) {
                    return item;
                }
            }
        }
        return undefined;
    }
    getActiveEquipmentSlot(item) {
        for (const equipment of Object.values(this._equipment)) {
            if (item.itemGuid == equipment.guid) {
                return equipment.slotId;
            }
        }
        return 0;
    }
    getEquippedWeapon() {
        return this._loadout[this.currentLoadoutSlot];
    }
    // gets the amount of items of a specific itemDefinitionId
    getInventoryItemAmount(itemDefinitionId) {
        let items = 0;
        for (const container of Object.values(this._containers)) {
            for (const item of Object.values(container.items)) {
                if (item.itemDefinitionId == itemDefinitionId) {
                    items += item.stackCount;
                }
            }
        }
        return items;
    }
    updateLoadout(server) {
        const client = server.getClientByCharId(this.characterId);
        if (client) {
            if (!client.character.initialized)
                return;
            server.checkConveys(client);
        }
        server.sendDataToAllWithSpawnedEntity(server._characters, this.characterId, "Loadout.SetLoadoutSlots", this.pGetLoadoutSlots());
    }
    updateEquipment(server) {
        if (!server.getClientByCharId(this.characterId)?.character.initialized)
            return;
        server.sendDataToAllWithSpawnedEntity(server._characters, this.characterId, "Equipment.SetCharacterEquipment", this.pGetEquipment());
    }
    updateEquipmentSlot(server, slotId) {
        if (!server.getClientByCharId(this.characterId)?.character.initialized)
            return;
        server.sendDataToAllWithSpawnedEntity(server._characters, this.characterId, "Equipment.SetCharacterEquipmentSlot", this.pGetEquipmentSlotFull(slotId));
    }
    /**
     * Equips an item to a BaseFullCharacter.
     * @param server The ZoneServer instance.
     * @param item The item to equip.
     * @param sendPacket Optional: Only used if character param belongs to a client. Sends equipment,
     * loadout, and item update packets to client if true.
     * @param loadoutSlotId Optional: The loadoutSlotId to manually try to equip the item to. This will be
     * found automatically if not defined.
     */
    equipItem(server, item, sendPacket = true, loadoutSlotId = 0) {
        if (!item) {
            debug("[ERROR] EquipItem: Invalid item!");
            return;
        }
        const def = server.getItemDefinition(item.itemDefinitionId);
        if (loadoutSlotId) {
            if (!server.validateLoadoutSlot(item.itemDefinitionId, loadoutSlotId, this.loadoutId)) {
                debug(`[ERROR] EquipItem: Client tried to equip item ${item.itemDefinitionId} with invalid loadoutSlotId ${loadoutSlotId}!`);
                return;
            }
        }
        else {
            loadoutSlotId = this.getAvailableLoadoutSlot(server, item.itemDefinitionId);
            if (!loadoutSlotId) {
                loadoutSlotId = server.getLoadoutSlot(item.itemDefinitionId);
            }
        }
        if (!loadoutSlotId) {
            debug(`[ERROR] EquipItem: Tried to equip item with itemDefinitionId: ${item.itemDefinitionId} with an invalid loadoutSlotId!`);
            return;
        }
        let equipmentSlotId = def.PASSIVE_EQUIP_SLOT_ID; // default for any equipment
        if (server.isWeapon(item.itemDefinitionId)) {
            if (loadoutSlotId == this.currentLoadoutSlot) {
                equipmentSlotId = def.ACTIVE_EQUIP_SLOT_ID;
            }
            else {
                equipmentSlotId = this.getAvailablePassiveEquipmentSlot(server, item.itemDefinitionId);
            }
        }
        if (equipmentSlotId) {
            const equipmentData = {
                modelName: def.MODEL_NAME.replace("<gender>", this.gender == 1 ? "Male" : "Female"),
                slotId: equipmentSlotId,
                guid: item.itemGuid,
                textureAlias: def.TEXTURE_ALIAS || "default0",
                tintAlias: "",
            };
            this._equipment[equipmentSlotId] = equipmentData;
        }
        this._loadout[loadoutSlotId] = new loadoutItem_1.LoadoutItem(item, loadoutSlotId, this.characterId);
        const client = server.getClientByCharId(this.characterId);
        if (client && this._loadout[loadoutSlotId] && sendPacket) {
            server.deleteItem(client, client.character._loadout[loadoutSlotId].itemGuid);
        }
        if (def.ITEM_TYPE === 34) {
            this._containers[loadoutSlotId] = new loadoutcontainer_1.LoadoutContainer(this._loadout[loadoutSlotId], def.PARAM1);
            if (client && sendPacket)
                server.initializeContainerList(client);
        }
        // probably will need to replicate server for vehicles / maybe npcs
        if (client && sendPacket)
            server.addItem(client, this._loadout[loadoutSlotId], 101);
        if (!sendPacket)
            return;
        this.updateLoadout(server);
        if (equipmentSlotId)
            this.updateEquipmentSlot(server, equipmentSlotId);
    }
    generateEquipmentFromLoadout(server) {
        for (const slot of Object.values(this._loadout)) {
            if (!slot.itemDefinitionId)
                continue;
            const def = server.getItemDefinition(slot.itemDefinitionId);
            let equipmentSlotId = def.PASSIVE_EQUIP_SLOT_ID; // default for any equipment
            if (server.isWeapon(slot.itemDefinitionId)) {
                if (slot.slotId == this.currentLoadoutSlot) {
                    equipmentSlotId = def.ACTIVE_EQUIP_SLOT_ID;
                }
                else {
                    equipmentSlotId = this.getAvailablePassiveEquipmentSlot(server, slot.itemDefinitionId);
                }
            }
            if (equipmentSlotId) {
                const equipmentData = {
                    modelName: def.MODEL_NAME.replace("<gender>", this.gender == 1 ? "Male" : "Female"),
                    slotId: equipmentSlotId,
                    guid: slot.itemGuid,
                    textureAlias: def.TEXTURE_ALIAS || "default0",
                    tintAlias: "",
                };
                this._equipment[equipmentSlotId] = equipmentData;
            }
        }
    }
    lootItem(server, item, count, sendUpdate = true) {
        const client = server.getClientByCharId(this.characterId);
        if (!item)
            return;
        if (!count)
            count = item.stackCount;
        if (count > item.stackCount) {
            console.error(`LootItem: Not enough items in stack! Count ${count} > Stackcount ${item.stackCount}`);
            count = item.stackCount;
        }
        const itemDefId = item.itemDefinitionId;
        if (this.getAvailableLoadoutSlot(server, itemDefId)) {
            if (client && client.character.initialized && sendUpdate) {
                server.sendData(client, "Reward.AddNonRewardItem", {
                    itemDefId: itemDefId,
                    iconId: server.getItemDefinition(itemDefId).IMAGE_SET_ID,
                    count: count,
                });
            }
            this.equipItem(server, item, sendUpdate);
            if (client && server.isWeapon(item.itemDefinitionId) && sendUpdate) {
                server.sendRemoteWeaponDataToAllOthers(client, client.character.transientId, "RemoteWeapon.Reset", {
                    data: {
                        remoteWeapons: client.character.pGetRemoteWeaponsData(server),
                        remoteWeaponsExtra: client.character.pGetRemoteWeaponsExtraData(server),
                    },
                });
            }
        }
        else {
            this.lootContainerItem(server, item, count, sendUpdate);
        }
    }
    lootContainerItem(server, item, count, sendUpdate = true, array = []) {
        const client = server.getClientByCharId(this.characterId);
        if (!item)
            return;
        if (item.stackCount <= 0) {
            console.error(`LootContainerItem: stackCount is negative! item ${item}`);
            return;
        }
        if (!count)
            count = item.stackCount;
        if (count > item.stackCount) {
            console.error(`LootContainerItem: Not enough items in stack! Count ${count} > Stackcount ${item.stackCount}`);
            count = item.stackCount;
        }
        const itemDefId = item.itemDefinitionId, availableContainer = this.getAvailableContainer(server, itemDefId, count);
        if (!availableContainer) {
            // container error full
            if (client) {
                server.sendData(client, "Character.NoSpaceNotification", {
                    characterId: client.character.characterId,
                });
            }
            Object.values(this._containers).forEach((c) => {
                if (array.includes(c))
                    return;
                array.push(c);
                const availableSpace = c.getAvailableBulk(server), itemBulk = server.getItemDefinition(item.itemDefinitionId).BULK, lootCount = Math.floor(availableSpace / itemBulk);
                if (lootCount) {
                    item.stackCount -= lootCount;
                    this.lootContainerItem(server, server.generateItem(item.itemDefinitionId, lootCount), count, true, array);
                }
            });
            server.worldObjectManager.createLootEntity(server, item, this.state.position, new Float32Array([0, Number(Math.random() * 10 - 5), 0, 1]));
            return;
        }
        const itemStackGuid = availableContainer.getAvailableItemStack(server, itemDefId, count);
        if (itemStackGuid) {
            const itemStack = this._containers[availableContainer.slotId].items[itemStackGuid];
            itemStack.stackCount += count;
            if (!client)
                return;
            server.updateContainerItem(client, itemStack, availableContainer);
            if (sendUpdate && client.character.initialized) {
                server.sendData(client, "Reward.AddNonRewardItem", {
                    itemDefId: itemDefId,
                    iconId: server.getItemDefinition(itemDefId).IMAGE_SET_ID,
                    count: count,
                });
            }
        }
        else {
            server.addContainerItem(this, item, availableContainer, count, sendUpdate);
        }
    }
    isDefaultItem(itemDefinitionId) {
        let isDefault = false;
        this.defaultLoadout.forEach((defaultItem) => {
            if (defaultItem.item == itemDefinitionId) {
                isDefault = true;
            }
        });
        return isDefault;
    }
    equipLoadout(server, loadout, sendPacket = true) {
        const l = loadout ? loadout : this.defaultLoadout;
        l.forEach((entry) => {
            if (entry.item != enums_1.Items.WEAPON_FISTS ||
                !this._loadout[enums_1.LoadoutSlots.FISTS]) {
                this.lootItem(server, server.generateItem(entry.item, entry.count), entry.count, sendPacket);
            }
        });
    }
    getDeathItems(server) {
        const items = {};
        Object.values(this._loadout).forEach((itemData) => {
            if (itemData.itemGuid != "0x0" &&
                !this.isDefaultItem(itemData.itemDefinitionId) &&
                !server.isAdminItem(itemData.itemDefinitionId)) {
                const item = new baseItem_1.BaseItem(itemData.itemDefinitionId, itemData.itemGuid, itemData.currentDurability, itemData.stackCount);
                item.debugFlag = "getDeathItems";
                if (itemData.weapon)
                    item.weapon = new weapon_1.Weapon(item, itemData.weapon.ammoCount);
                item.slotId = Object.keys(items).length + 1;
                items[item.itemGuid] = item;
            }
        });
        Object.values(this._containers).forEach((container) => {
            Object.values(container.items).forEach((item) => {
                if (!this.isDefaultItem(item.itemDefinitionId)) {
                    let stacked = false;
                    for (const i of Object.values(items)) {
                        // stack similar items
                        if (i.itemDefinitionId == item.itemDefinitionId &&
                            server.isStackable(item.itemDefinitionId)) {
                            items[i.itemGuid].stackCount += item.stackCount;
                            stacked = true;
                            break;
                        }
                    }
                    if (!stacked) {
                        const newItem = new baseItem_1.BaseItem(item.itemDefinitionId, item.itemGuid, item.currentDurability, item.stackCount);
                        newItem.debugFlag = "getDeathItemsNotStacked";
                        if (item.weapon)
                            newItem.weapon = new weapon_1.Weapon(newItem, item.weapon.ammoCount);
                        newItem.slotId = Object.keys(items).length + 1;
                        items[newItem.itemGuid] = newItem;
                    }
                }
            });
        });
        return items;
    }
    pGetEquipmentSlot(slotId) {
        const slot = this._equipment[slotId];
        return slot
            ? {
                equipmentSlotId: slot.slotId,
                equipmentSlotData: {
                    equipmentSlotId: slot.slotId,
                    guid: slot.guid || "",
                    tintAlias: slot.tintAlias || "Default",
                    decalAlias: slot.decalAlias || "#",
                },
            }
            : undefined;
    }
    pGetEquipmentSlots() {
        return Object.keys(this._equipment).map((slotId) => {
            return this.pGetEquipmentSlot(slotId);
        });
    }
    pGetAttachmentSlot(slotId) {
        const slot = this._equipment[slotId];
        return slot
            ? {
                modelName: slot.modelName,
                textureAlias: slot.textureAlias || "",
                tintAlias: slot.tintAlias || "Default",
                decalAlias: slot.decalAlias || "#",
                slotId: slot.slotId,
            }
            : undefined;
    }
    pGetAttachmentSlots() {
        return Object.keys(this._equipment).map((slotId) => {
            return this.pGetAttachmentSlot(slotId);
        });
    }
    pGetEquipmentSlotFull(slotId) {
        const slot = this._equipment[slotId];
        return slot
            ? {
                characterData: {
                    characterId: this.characterId,
                },
                equipmentSlot: this.pGetEquipmentSlot(slotId),
                attachmentData: this.pGetAttachmentSlot(slotId),
            }
            : undefined;
    }
    pGetAttachmentSlotsMod() {
        return Object.keys(this._equipment).map((slotId) => {
            if (this.pGetAttachmentSlot(slotId)?.modelName == "Weapon_Empty.adr") {
                return this.pGetAttachmentSlot(slotId);
            }
            return {
                modelName: "",
                textureAlias: "",
                tintAlias: "Default",
                decalAlias: "#",
                slotId: slotId,
                unknownArray1: [],
                unknownBool1: false,
            };
        });
    }
    pGetEquipment() {
        return {
            characterData: {
                profileId: 5,
                characterId: this.characterId,
            },
            unknownDword1: 0,
            unknownString1: "Default",
            unknownString2: "#",
            equipmentSlots: this.pGetEquipmentSlots(),
            attachmentData: this.pGetAttachmentSlots(),
            unknownBoolean1: true,
        };
    }
    pGetLoadoutSlot(slotId) {
        const slot = this._loadout[slotId];
        return {
            hotbarSlotId: slotId,
            loadoutId: this.loadoutId,
            slotId: slotId,
            loadoutItemData: {
                itemDefinitionId: slot?.itemDefinitionId || 0,
                loadoutItemGuid: slot?.itemGuid || "0x0",
                unknownByte1: 255, // flags?
            },
            unknownDword1: slotId,
        };
    }
    getLoadoutSlots() {
        const slots = [];
        loadoutSlots.forEach((slot) => {
            if (slot.LOADOUT_ID == this.loadoutId)
                slots.push(slot.SLOT_ID);
        });
        return slots;
    }
    /**
     * Gets the first available loadout slot for a given item.
     * @param server The ZoneServer instance.
     * @param itemDefId The definition ID of an item to try to find a slot for.
     * @returns Returns the ID of an available loadout slot.
     */
    getAvailableLoadoutSlot(server, itemDefId) {
        // gets an open loadoutslot for a specified itemDefinitionId
        const itemDef = server.getItemDefinition(itemDefId), loadoutSlotItemClass = loadoutSlotItemClasses.find((slot) => slot.ITEM_CLASS == itemDef.ITEM_CLASS &&
            this.loadoutId == slot.LOADOUT_ID);
        let slot = loadoutSlotItemClass?.SLOT;
        if (!slot)
            return 0;
        switch (itemDef.ITEM_CLASS) {
            case enums_1.ItemClasses.WEAPONS_LONG:
            case enums_1.ItemClasses.WEAPONS_PISTOL:
            case enums_1.ItemClasses.WEAPONS_MELEES:
            case enums_1.ItemClasses.WEAPONS_MELEES0:
            case enums_1.ItemClasses.WEAPONS_CROSSBOW:
            case enums_1.ItemClasses.WEAPONS_BOW:
                if (this._loadout[slot]?.itemDefinitionId) {
                    // primary
                    slot = enums_1.LoadoutSlots.SECONDARY;
                }
                if (slot == enums_1.LoadoutSlots.SECONDARY &&
                    this._loadout[slot]?.itemDefinitionId) {
                    // secondary
                    slot = enums_1.LoadoutSlots.TERTIARY;
                }
                break;
            case enums_1.ItemClasses.WEAPONS_GENERIC: // item1/item2 slots
                if (this._loadout[slot]?.itemDefinitionId) {
                    slot = enums_1.LoadoutSlots.ITEM2;
                }
                break;
        }
        if (this._loadout[slot]?.itemDefinitionId)
            return 0;
        return slot;
    }
    /**
     * Gets the first available passive equipment slot for a given item.
     * @param server The ZoneServer instance.
     * @param itemDefId The definition ID of an item to try to find a slot for.
     * @returns Returns the ID of an available passive equipment slot.
     */
    getAvailablePassiveEquipmentSlot(server, itemDefId) {
        const itemDef = server.getItemDefinition(itemDefId), itemClass = itemDef?.ITEM_CLASS;
        if (!itemDef || !itemClass || !server.isWeapon(itemDefId))
            return 0;
        for (const slot of equipSlotItemClasses) {
            if (slot.ITEM_CLASS == itemDef.ITEM_CLASS &&
                !this._equipment[slot.EQUIP_SLOT_ID]) {
                return slot.EQUIP_SLOT_ID;
            }
        }
        return 0;
    }
    /**
     * Returns the first container that has enough space for an item stack.
     * @param server The ZoneServer instance.
     * @param itemDefinitionId The item definition ID to try to put in a container.
     * @param count The amount of items to try and fit in a container.
     * @returns Returns a container with available space, or undefined.
     */
    getAvailableContainer(server, itemDefinitionId, count) {
        const itemDef = server.getItemDefinition(itemDefinitionId);
        for (const container of Object.values(this._containers)) {
            if (container &&
                container.getMaxBulk(server) >=
                    container.getUsedBulk(server) + itemDef.BULK * count) {
                return container;
            }
        }
        return;
    }
    pGetLoadoutSlots() {
        return {
            characterId: this.characterId,
            loadoutId: this.loadoutId,
            loadoutData: {
                loadoutSlots: Object.values(this.getLoadoutSlots()).map((slotId) => {
                    return this.pGetLoadoutSlot(slotId);
                }),
            },
            currentSlotId: this.currentLoadoutSlot,
        };
    }
    pGetItemWeaponData(server, slot) {
        if (slot.weapon) {
            return {
                isWeapon: true,
                unknownData1: {
                    unknownBoolean1: false,
                },
                unknownData2: {
                    ammoSlots: server.getWeaponAmmoId(slot.itemDefinitionId)
                        ? [{ ammoSlot: slot.weapon?.ammoCount }]
                        : [],
                    firegroups: [
                        {
                            firegroupId: server.getWeaponDefinition(server.getItemDefinition(slot.itemDefinitionId).PARAM1)?.FIRE_GROUPS[0]?.FIRE_GROUP_ID,
                            unknownArray1: [
                                // maybe firemodes?
                                {
                                    unknownByte1: 0,
                                    unknownDword1: 0,
                                    unknownDword2: 0,
                                    unknownDword3: 0,
                                },
                                {
                                    unknownByte1: 0,
                                    unknownDword1: 0,
                                    unknownDword2: 0,
                                    unknownDword3: 0,
                                },
                            ],
                        },
                    ],
                    equipmentSlotId: this.getActiveEquipmentSlot(slot),
                    unknownByte2: 1,
                    unknownDword1: 0,
                    unknownByte3: 0,
                    unknownByte4: -1,
                    unknownByte5: -1,
                    unknownFloat1: 0,
                    unknownByte6: 0,
                    unknownDword2: 0,
                    unknownByte7: 0,
                    unknownDword3: -1,
                },
                characterStats: [],
                unknownArray1: [],
            };
        }
        return {
            isWeapon: false,
            unknownBoolean1: false,
        };
    }
    pGetItemData(server, item, containerDefId) {
        let durability = 0;
        const isWeapon = server.isWeapon(item.itemDefinitionId);
        switch (true) {
            case server.isWeapon(item.itemDefinitionId):
                durability = 2000;
                break;
            case server.isArmor(item.itemDefinitionId):
                durability = 1000;
                break;
            case server.isHelmet(item.itemDefinitionId):
                durability = 100;
                break;
        }
        return {
            itemDefinitionId: item.itemDefinitionId,
            tintId: 0,
            guid: item.itemGuid,
            count: item.stackCount,
            itemSubData: {
                hasSubData: false,
            },
            containerGuid: item.containerGuid,
            containerDefinitionId: containerDefId,
            containerSlotId: item.slotId,
            baseDurability: durability,
            currentDurability: durability ? item.currentDurability : 0,
            maxDurabilityFromDefinition: durability,
            unknownBoolean1: true,
            ownerCharacterId: isWeapon && item.itemDefinitionId !== 85 ? "" : this.characterId,
            unknownDword9: 1,
            weaponData: this.pGetItemWeaponData(server, item),
        };
    }
    pGetInventoryItems(server) {
        const items = Object.values(this._loadout)
            .filter((slot) => {
            if (slot.itemDefinitionId) {
                return true;
            }
        })
            .map((slot) => {
            return this.pGetItemData(server, slot, 101);
        });
        Object.values(this._containers).forEach((container) => {
            Object.values(container.items).forEach((item) => {
                items.push(this.pGetItemData(server, item, container.containerDefinitionId));
            });
        });
        return items;
    }
    pGetFull(server) {
        return {
            transientId: this.transientId,
            attachmentData: this.pGetAttachmentSlots(),
            characterId: this.characterId,
            resources: {
                data: this.pGetResources(),
            },
            effectTags: [],
            unknownData1: {},
            targetData: {},
            unknownArray1: [],
            unknownArray2: [],
            unknownArray3: { data: {} },
            unknownArray4: { data: {} },
            unknownArray5: { data: {} },
            unknownArray6: { data: {} },
            remoteWeapons: { data: {} },
            itemsData: {
                items: this.pGetInventoryItems(server),
                unknownDword1: 0,
            },
        };
    }
    pGetContainerData(server, container) {
        return {
            guid: container.itemGuid,
            definitionId: container.containerDefinitionId,
            associatedCharacterId: this.characterId,
            slots: container.getMaxSlots(server),
            items: Object.values(container.items).map((item, idx) => {
                container.items[item.itemGuid].slotId = idx + 1;
                return {
                    itemDefinitionId: item.itemDefinitionId,
                    itemData: this.pGetItemData(server, item, container.containerDefinitionId),
                };
            }),
            showBulk: true,
            maxBulk: container.getMaxBulk(server),
            unknownDword1: 28,
            bulkUsed: container.getUsedBulk(server),
            hasBulkLimit: !!container.getMaxBulk(server),
        };
    }
    pGetContainers(server) {
        return Object.values(this._containers).map((container) => {
            return {
                loadoutSlotId: container.slotId,
                containerData: this.pGetContainerData(server, container),
            };
        });
    }
    getResourceType(resourceId) {
        switch (resourceId) {
            case enums_1.ResourceIds.HEALTH:
                return enums_1.ResourceTypes.HEALTH;
            case enums_1.ResourceIds.HUNGER:
                return enums_1.ResourceTypes.HUNGER;
            case enums_1.ResourceIds.HYDRATION:
                return enums_1.ResourceTypes.HYDRATION;
            case enums_1.ResourceIds.STAMINA:
                return enums_1.ResourceTypes.STAMINA;
            case enums_1.ResourceIds.VIRUS:
                return enums_1.ResourceTypes.VIRUS;
            case enums_1.ResourceIds.BLEEDING:
                return enums_1.ResourceTypes.BLEEDING;
            case enums_1.ResourceIds.COMFORT:
                return enums_1.ResourceTypes.COMFORT;
            case enums_1.ResourceIds.FUEL:
                return enums_1.ResourceTypes.FUEL;
            case enums_1.ResourceIds.CONDITION:
                return enums_1.ResourceTypes.CONDITION;
            default:
                return 0;
        }
    }
    pGetResources() {
        return Object.keys(this._resources).map((resource) => {
            const resourceId = Number(resource);
            const resourceType = this.getResourceType(resourceId);
            return {
                resourceType: resourceType,
                resourceData: {
                    resourceId: resourceId,
                    resourceType: resourceType,
                    value: this._resources[resourceId] > 0 ? this._resources[resourceId] : 0,
                },
            };
        });
    }
    /**
     * Gets all inventory containers as an array of items.
     * @param character The character to check.
     * @returns Returns an array containing all items across all containers.
     */
    getInventoryAsContainer() {
        const inventory = {};
        for (const container of Object.values(this._containers)) {
            for (const item of Object.values(container.items)) {
                if (!inventory[item.itemDefinitionId]) {
                    inventory[item.itemDefinitionId] = []; // init array
                }
                inventory[item.itemDefinitionId].push(item); // push new itemstack
            }
        }
        return inventory;
    }
    hasHelmet(server) {
        const slot = this._loadout[enums_1.LoadoutSlots.HEAD], itemDef = server.getItemDefinition(slot?.itemDefinitionId);
        if (!slot || !itemDef)
            return false;
        return (slot.itemDefinitionId >= 0 &&
            itemDef.ITEM_CLASS == 25000 &&
            itemDef.IS_ARMOR);
    }
    hasArmor(server) {
        const slot = this._loadout[enums_1.LoadoutSlots.ARMOR], itemDef = server.getItemDefinition(slot?.itemDefinitionId);
        if (!slot || !itemDef)
            return false;
        return slot.itemDefinitionId >= 0 && itemDef.ITEM_CLASS == 25041;
    }
    OnFullCharacterDataRequest(server, client) {
        console.log(`[ERROR] Unhandled FullCharacterDataRequest from client ${client.guid}!`);
    }
    OnProjectileHit(server, damageInfo) {
        this.damage(server, damageInfo);
    }
}
exports.BaseFullCharacter = BaseFullCharacter;
//# sourceMappingURL=basefullcharacter.js.map