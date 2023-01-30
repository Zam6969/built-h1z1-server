import { characterEquipment, DamageInfo } from "../../../types/zoneserver";
import { LoadoutKit } from "../data/loadouts";
import { ResourceTypes } from "../models/enums";
import { ZoneServer2016 } from "../zoneserver";
import { BaseItem } from "../classes/baseItem";
import { BaseLightweightCharacter } from "./baselightweightcharacter";
import { LoadoutContainer } from "../classes/loadoutcontainer";
import { LoadoutItem } from "../classes/loadoutItem";
import { ZoneClient2016 } from "../classes/zoneclient";
export declare class BaseFullCharacter extends BaseLightweightCharacter {
    onReadyCallback?: (clientTriggered: ZoneClient2016) => void;
    _resources: {
        [resourceId: number]: number;
    };
    _loadout: {
        [loadoutSlotId: number]: LoadoutItem;
    };
    _equipment: {
        [equipmentSlotId: number]: characterEquipment;
    };
    _containers: {
        [loadoutSlotId: number]: LoadoutContainer;
    };
    loadoutId: number;
    currentLoadoutSlot: number;
    isLightweight: boolean;
    gender: number;
    defaultLoadout: LoadoutKit;
    constructor(characterId: string, transientId: number, actorModelId: number, position: Float32Array, rotation: Float32Array, server: ZoneServer2016);
    getActiveLoadoutSlot(itemGuid: string): number;
    getLoadoutItem(itemGuid: string): LoadoutItem | undefined;
    getItemContainer(itemGuid: string): LoadoutContainer | undefined;
    getInventoryItem(itemGuid: string): BaseItem | undefined;
    getContainerFromGuid(containerGuid: string): LoadoutContainer | undefined;
    getItemById(itemDefId: number): BaseItem | undefined;
    getActiveEquipmentSlot(item: BaseItem): number;
    getEquippedWeapon(): LoadoutItem;
    getInventoryItemAmount(itemDefinitionId: number): number;
    updateLoadout(server: ZoneServer2016): void;
    updateEquipment(server: ZoneServer2016): void;
    updateEquipmentSlot(server: ZoneServer2016, slotId: number): void;
    /**
     * Equips an item to a BaseFullCharacter.
     * @param server The ZoneServer instance.
     * @param item The item to equip.
     * @param sendPacket Optional: Only used if character param belongs to a client. Sends equipment,
     * loadout, and item update packets to client if true.
     * @param loadoutSlotId Optional: The loadoutSlotId to manually try to equip the item to. This will be
     * found automatically if not defined.
     */
    equipItem(server: ZoneServer2016, item?: BaseItem, sendPacket?: boolean, loadoutSlotId?: number): void;
    generateEquipmentFromLoadout(server: ZoneServer2016): void;
    lootItem(server: ZoneServer2016, item?: BaseItem, count?: number, sendUpdate?: boolean): void;
    lootContainerItem(server: ZoneServer2016, item?: BaseItem, count?: number, sendUpdate?: boolean, array?: LoadoutContainer[]): void;
    isDefaultItem(itemDefinitionId: number): boolean;
    equipLoadout(server: ZoneServer2016, loadout?: LoadoutKit, sendPacket?: boolean): void;
    getDeathItems(server: ZoneServer2016): {
        [itemGuid: string]: BaseItem;
    };
    pGetEquipmentSlot(slotId: number): {
        equipmentSlotId: number;
        equipmentSlotData: {
            equipmentSlotId: number;
            guid: string;
            tintAlias: string;
            decalAlias: string;
        };
    } | undefined;
    pGetEquipmentSlots(): ({
        equipmentSlotId: number;
        equipmentSlotData: {
            equipmentSlotId: number;
            guid: string;
            tintAlias: string;
            decalAlias: string;
        };
    } | undefined)[];
    pGetAttachmentSlot(slotId: number): {
        modelName: string;
        textureAlias: string;
        tintAlias: string;
        decalAlias: string;
        slotId: number;
    } | undefined;
    pGetAttachmentSlots(): ({
        modelName: string;
        textureAlias: string;
        tintAlias: string;
        decalAlias: string;
        slotId: number;
    } | undefined)[];
    pGetEquipmentSlotFull(slotId: number): {
        characterData: {
            characterId: string;
        };
        equipmentSlot: {
            equipmentSlotId: number;
            equipmentSlotData: {
                equipmentSlotId: number;
                guid: string;
                tintAlias: string;
                decalAlias: string;
            };
        } | undefined;
        attachmentData: {
            modelName: string;
            textureAlias: string;
            tintAlias: string;
            decalAlias: string;
            slotId: number;
        } | undefined;
    } | undefined;
    pGetAttachmentSlotsMod(): ({
        modelName: string;
        textureAlias: string;
        tintAlias: string;
        decalAlias: string;
        slotId: number;
    } | {
        modelName: string;
        textureAlias: string;
        tintAlias: string;
        decalAlias: string;
        slotId: any;
        unknownArray1: never[];
        unknownBool1: boolean;
    } | undefined)[];
    pGetEquipment(): {
        characterData: {
            profileId: number;
            characterId: string;
        };
        unknownDword1: number;
        unknownString1: string;
        unknownString2: string;
        equipmentSlots: ({
            equipmentSlotId: number;
            equipmentSlotData: {
                equipmentSlotId: number;
                guid: string;
                tintAlias: string;
                decalAlias: string;
            };
        } | undefined)[];
        attachmentData: ({
            modelName: string;
            textureAlias: string;
            tintAlias: string;
            decalAlias: string;
            slotId: number;
        } | undefined)[];
        unknownBoolean1: boolean;
    };
    pGetLoadoutSlot(slotId: number): {
        hotbarSlotId: number;
        loadoutId: number;
        slotId: number;
        loadoutItemData: {
            itemDefinitionId: number;
            loadoutItemGuid: string;
            unknownByte1: number;
        };
        unknownDword1: number;
    };
    getLoadoutSlots(): number[];
    /**
     * Gets the first available loadout slot for a given item.
     * @param server The ZoneServer instance.
     * @param itemDefId The definition ID of an item to try to find a slot for.
     * @returns Returns the ID of an available loadout slot.
     */
    getAvailableLoadoutSlot(server: ZoneServer2016, itemDefId: number): number;
    /**
     * Gets the first available passive equipment slot for a given item.
     * @param server The ZoneServer instance.
     * @param itemDefId The definition ID of an item to try to find a slot for.
     * @returns Returns the ID of an available passive equipment slot.
     */
    getAvailablePassiveEquipmentSlot(server: ZoneServer2016, itemDefId: number): number;
    /**
     * Returns the first container that has enough space for an item stack.
     * @param server The ZoneServer instance.
     * @param itemDefinitionId The item definition ID to try to put in a container.
     * @param count The amount of items to try and fit in a container.
     * @returns Returns a container with available space, or undefined.
     */
    getAvailableContainer(server: ZoneServer2016, itemDefinitionId: number, count: number): LoadoutContainer | undefined;
    pGetLoadoutSlots(): {
        characterId: string;
        loadoutId: number;
        loadoutData: {
            loadoutSlots: {
                hotbarSlotId: number;
                loadoutId: number;
                slotId: number;
                loadoutItemData: {
                    itemDefinitionId: number;
                    loadoutItemGuid: string;
                    unknownByte1: number;
                };
                unknownDword1: number;
            }[];
        };
        currentSlotId: number;
    };
    pGetItemWeaponData(server: ZoneServer2016, slot: BaseItem): {
        isWeapon: boolean;
        unknownData1: {
            unknownBoolean1: boolean;
        };
        unknownData2: {
            ammoSlots: {
                ammoSlot: number;
            }[];
            firegroups: {
                firegroupId: any;
                unknownArray1: {
                    unknownByte1: number;
                    unknownDword1: number;
                    unknownDword2: number;
                    unknownDword3: number;
                }[];
            }[];
            equipmentSlotId: number;
            unknownByte2: number;
            unknownDword1: number;
            unknownByte3: number;
            unknownByte4: number;
            unknownByte5: number;
            unknownFloat1: number;
            unknownByte6: number;
            unknownDword2: number;
            unknownByte7: number;
            unknownDword3: number;
        };
        characterStats: never[];
        unknownArray1: never[];
        unknownBoolean1?: undefined;
    } | {
        isWeapon: boolean;
        unknownBoolean1: boolean;
        unknownData1?: undefined;
        unknownData2?: undefined;
        characterStats?: undefined;
        unknownArray1?: undefined;
    };
    pGetItemData(server: ZoneServer2016, item: BaseItem, containerDefId: number): {
        itemDefinitionId: number;
        tintId: number;
        guid: string;
        count: number;
        itemSubData: {
            hasSubData: boolean;
        };
        containerGuid: string;
        containerDefinitionId: number;
        containerSlotId: number;
        baseDurability: number;
        currentDurability: number;
        maxDurabilityFromDefinition: number;
        unknownBoolean1: boolean;
        ownerCharacterId: string;
        unknownDword9: number;
        weaponData: {
            isWeapon: boolean;
            unknownData1: {
                unknownBoolean1: boolean;
            };
            unknownData2: {
                ammoSlots: {
                    ammoSlot: number;
                }[];
                firegroups: {
                    firegroupId: any;
                    unknownArray1: {
                        unknownByte1: number;
                        unknownDword1: number;
                        unknownDword2: number;
                        unknownDword3: number;
                    }[];
                }[];
                equipmentSlotId: number;
                unknownByte2: number;
                unknownDword1: number;
                unknownByte3: number;
                unknownByte4: number;
                unknownByte5: number;
                unknownFloat1: number;
                unknownByte6: number;
                unknownDword2: number;
                unknownByte7: number;
                unknownDword3: number;
            };
            characterStats: never[];
            unknownArray1: never[];
            unknownBoolean1?: undefined;
        } | {
            isWeapon: boolean;
            unknownBoolean1: boolean;
            unknownData1?: undefined;
            unknownData2?: undefined;
            characterStats?: undefined;
            unknownArray1?: undefined;
        };
    };
    pGetInventoryItems(server: ZoneServer2016): any[];
    pGetFull(server: ZoneServer2016): {
        transientId: number;
        attachmentData: ({
            modelName: string;
            textureAlias: string;
            tintAlias: string;
            decalAlias: string;
            slotId: number;
        } | undefined)[];
        characterId: string;
        resources: {
            data: {
                resourceType: number;
                resourceData: {
                    resourceId: number;
                    resourceType: number;
                    value: number;
                };
            }[];
        };
        effectTags: never[];
        unknownData1: {};
        targetData: {};
        unknownArray1: never[];
        unknownArray2: never[];
        unknownArray3: {
            data: {};
        };
        unknownArray4: {
            data: {};
        };
        unknownArray5: {
            data: {};
        };
        unknownArray6: {
            data: {};
        };
        remoteWeapons: {
            data: {};
        };
        itemsData: {
            items: any[];
            unknownDword1: number;
        };
    };
    pGetContainerData(server: ZoneServer2016, container: LoadoutContainer): {
        guid: string;
        definitionId: number;
        associatedCharacterId: string;
        slots: any;
        items: {
            itemDefinitionId: number;
            itemData: {
                itemDefinitionId: number;
                tintId: number;
                guid: string;
                count: number;
                itemSubData: {
                    hasSubData: boolean;
                };
                containerGuid: string;
                containerDefinitionId: number;
                containerSlotId: number;
                baseDurability: number;
                currentDurability: number;
                maxDurabilityFromDefinition: number;
                unknownBoolean1: boolean;
                ownerCharacterId: string;
                unknownDword9: number;
                weaponData: {
                    isWeapon: boolean;
                    unknownData1: {
                        unknownBoolean1: boolean;
                    };
                    unknownData2: {
                        ammoSlots: {
                            ammoSlot: number;
                        }[];
                        firegroups: {
                            firegroupId: any;
                            unknownArray1: {
                                unknownByte1: number;
                                unknownDword1: number;
                                unknownDword2: number;
                                unknownDword3: number;
                            }[];
                        }[];
                        equipmentSlotId: number;
                        unknownByte2: number;
                        unknownDword1: number;
                        unknownByte3: number;
                        unknownByte4: number;
                        unknownByte5: number;
                        unknownFloat1: number;
                        unknownByte6: number;
                        unknownDword2: number;
                        unknownByte7: number;
                        unknownDword3: number;
                    };
                    characterStats: never[];
                    unknownArray1: never[];
                    unknownBoolean1?: undefined;
                } | {
                    isWeapon: boolean;
                    unknownBoolean1: boolean;
                    unknownData1?: undefined;
                    unknownData2?: undefined;
                    characterStats?: undefined;
                    unknownArray1?: undefined;
                };
            };
        }[];
        showBulk: boolean;
        maxBulk: number;
        unknownDword1: number;
        bulkUsed: number;
        hasBulkLimit: boolean;
    };
    pGetContainers(server: ZoneServer2016): {
        loadoutSlotId: number;
        containerData: {
            guid: string;
            definitionId: number;
            associatedCharacterId: string;
            slots: any;
            items: {
                itemDefinitionId: number;
                itemData: {
                    itemDefinitionId: number;
                    tintId: number;
                    guid: string;
                    count: number;
                    itemSubData: {
                        hasSubData: boolean;
                    };
                    containerGuid: string;
                    containerDefinitionId: number;
                    containerSlotId: number;
                    baseDurability: number;
                    currentDurability: number;
                    maxDurabilityFromDefinition: number;
                    unknownBoolean1: boolean;
                    ownerCharacterId: string;
                    unknownDword9: number;
                    weaponData: {
                        isWeapon: boolean;
                        unknownData1: {
                            unknownBoolean1: boolean;
                        };
                        unknownData2: {
                            ammoSlots: {
                                ammoSlot: number;
                            }[];
                            firegroups: {
                                firegroupId: any;
                                unknownArray1: {
                                    unknownByte1: number;
                                    unknownDword1: number;
                                    unknownDword2: number;
                                    unknownDword3: number;
                                }[];
                            }[];
                            equipmentSlotId: number;
                            unknownByte2: number;
                            unknownDword1: number;
                            unknownByte3: number;
                            unknownByte4: number;
                            unknownByte5: number;
                            unknownFloat1: number;
                            unknownByte6: number;
                            unknownDword2: number;
                            unknownByte7: number;
                            unknownDword3: number;
                        };
                        characterStats: never[];
                        unknownArray1: never[];
                        unknownBoolean1?: undefined;
                    } | {
                        isWeapon: boolean;
                        unknownBoolean1: boolean;
                        unknownData1?: undefined;
                        unknownData2?: undefined;
                        characterStats?: undefined;
                        unknownArray1?: undefined;
                    };
                };
            }[];
            showBulk: boolean;
            maxBulk: number;
            unknownDword1: number;
            bulkUsed: number;
            hasBulkLimit: boolean;
        };
    }[];
    getResourceType(resourceId: number): 0 | ResourceTypes;
    pGetResources(): {
        resourceType: number;
        resourceData: {
            resourceId: number;
            resourceType: number;
            value: number;
        };
    }[];
    /**
     * Gets all inventory containers as an array of items.
     * @param character The character to check.
     * @returns Returns an array containing all items across all containers.
     */
    getInventoryAsContainer(): {
        [itemDefinitionId: number]: BaseItem[];
    };
    hasHelmet(server: ZoneServer2016): boolean;
    hasArmor(server: ZoneServer2016): boolean;
    OnFullCharacterDataRequest(server: ZoneServer2016, client: ZoneClient2016): void;
    OnProjectileHit(server: ZoneServer2016, damageInfo: DamageInfo): void;
}
