/// <reference types="node" />
import { Items, LoadoutIds, LoadoutSlots } from "../models/enums";
import { ZoneClient2016 } from "../classes/zoneclient";
import { ZoneServer2016 } from "../zoneserver";
import { BaseFullCharacter } from "./basefullcharacter";
import { DamageInfo, DamageRecord, positionUpdate } from "../../../types/zoneserver";
import { BaseItem } from "../classes/baseItem";
import { BaseLootableEntity } from "./baselootableentity";
import { LoadoutContainer } from "../classes/loadoutcontainer";
interface CharacterStates {
    invincibility?: boolean;
    gmHidden?: boolean;
    knockedOut?: boolean;
    inWater?: boolean;
}
interface CharacterMetrics {
    zombiesKilled: number;
    wildlifeKilled: number;
    recipesDiscovered: number;
    startedSurvivingTP: number;
}
export declare class Character2016 extends BaseFullCharacter {
    name?: string;
    spawnLocation?: string;
    resourcesUpdater?: any;
    factionId: number;
    godMode: boolean;
    characterStates: CharacterStates;
    isRunning: boolean;
    isHidden: string;
    isBleeding: boolean;
    isBandaged: boolean;
    isExhausted: boolean;
    temporaryScrapTimeout: NodeJS.Timeout | undefined;
    temporaryScrapSoundTimeout: NodeJS.Timeout | undefined;
    static isAlive: boolean;
    set isAlive(state: boolean);
    get isAlive(): boolean;
    isSonic: boolean;
    isMoving: boolean;
    actorModelId: number;
    headActor: string;
    hairModel: string;
    isRespawning: boolean;
    isReady: boolean;
    creationDate: string;
    lastLoginDate: string;
    vehicleExitDate: number;
    currentLoadoutSlot: LoadoutSlots;
    readonly loadoutId = LoadoutIds.CHARACTER;
    startRessourceUpdater: any;
    healingInterval?: any;
    healingTicks: number;
    healingMaxTicks: number;
    starthealingInterval: any;
    timeouts: any;
    hasConveys: boolean;
    positionUpdate?: positionUpdate;
    tempGodMode: boolean;
    isSpectator: boolean;
    initialized: boolean;
    readonly metrics: CharacterMetrics;
    private combatlog;
    ownedVehicle?: string;
    currentInteractionGuid?: string;
    lastInteractionTime: number;
    mountedContainer?: BaseLootableEntity;
    defaultLoadout: ({
        item: Items;
        count?: undefined;
    } | {
        item: Items;
        count: number;
    })[];
    constructor(characterId: string, transientId: number, server: ZoneServer2016);
    clearReloadTimeout(): void;
    addCombatlogEntry(entry: DamageRecord): void;
    getCombatLog(): DamageRecord[];
    /**
     * Gets the lightweightpc packetfields for use in sendself and addlightweightpc
     */
    pGetLightweight(): {
        rotation: Float32Array;
        identity: {
            characterName: string | undefined;
        };
        characterId: string;
        transientId: number;
        actorModelId: number;
        position: number[];
        scale: Float32Array;
        positionUpdateType: number;
        profileId: number;
        isLightweight: boolean;
        flags: {
            flags1: {
                bit0: number;
                bit1: number;
                bit2: number;
                bit3: number;
                bit4: number;
                bit5: number;
                bit6: number;
                bit7: number;
                bit8: number;
                bit9: number;
                bit10: number;
                bit11: number;
                projectileCollision: number;
                bit13: number;
                bit14: number;
                bit15: number;
                bit16: number;
                bit17: number;
                bit18: number;
                bit19: number;
                noCollide: number;
                knockedOut: number;
                bit22: number;
                bit23: number;
            };
            flags2: {
                bit0: number;
                bit1: number;
                bit2: number;
                bit3: number;
                bit4: number;
                bit5: number;
                bit6: number;
                bit7: number;
                bit8: number;
                bit9: number;
                bit10: number;
                bit11: number;
                projectileCollision: number;
                bit13: number;
                bit14: number;
                bit15: number;
                bit16: number;
                bit17: number;
                bit18: number;
                bit19: number;
                noCollide: number;
                knockedOut: number;
                bit22: number;
                bit23: number;
            };
            flags3: {
                bit0: number;
                bit1: number;
                bit2: number;
                bit3: number;
                bit4: number;
                bit5: number;
                bit6: number;
                bit7: number;
                bit8: number;
                bit9: number;
                bit10: number;
                bit11: number;
                projectileCollision: number;
                bit13: number;
                bit14: number;
                bit15: number;
                bit16: number;
                bit17: number;
                bit18: number;
                bit19: number;
                noCollide: number;
                knockedOut: number;
                bit22: number;
                bit23: number;
            };
        };
        headActor: string;
    };
    pGetSendSelf(server: ZoneServer2016, guid: string | undefined, client: ZoneClient2016): {
        guid: string;
        hairModel: string;
        isRespawning: boolean;
        gender: number;
        creationDate: string;
        lastLoginDate: string;
        identity: {
            characterName: string | undefined;
        };
        inventory: {
            items: any[];
        };
        recipes: any[];
        stats: any;
        loadoutSlots: {
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
        equipmentSlots: {
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
        characterResources: {
            resourceType: number;
            resourceData: {
                resourceId: number;
                resourceType: number;
                value: number;
            };
        }[];
        containers: {
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
        isAdmin: boolean;
        rotation: Float32Array;
        characterId: string;
        transientId: number;
        actorModelId: number;
        position: number[];
        scale: Float32Array;
        positionUpdateType: number;
        profileId: number;
        isLightweight: boolean;
        flags: {
            flags1: {
                bit0: number;
                bit1: number;
                bit2: number;
                bit3: number;
                bit4: number;
                bit5: number;
                bit6: number;
                bit7: number;
                bit8: number;
                bit9: number;
                bit10: number;
                bit11: number;
                projectileCollision: number;
                bit13: number;
                bit14: number;
                bit15: number;
                bit16: number;
                bit17: number;
                bit18: number;
                bit19: number;
                noCollide: number;
                knockedOut: number;
                bit22: number;
                bit23: number;
            };
            flags2: {
                bit0: number;
                bit1: number;
                bit2: number;
                bit3: number;
                bit4: number;
                bit5: number;
                bit6: number;
                bit7: number;
                bit8: number;
                bit9: number;
                bit10: number;
                bit11: number;
                projectileCollision: number;
                bit13: number;
                bit14: number;
                bit15: number;
                bit16: number;
                bit17: number;
                bit18: number;
                bit19: number;
                noCollide: number;
                knockedOut: number;
                bit22: number;
                bit23: number;
            };
            flags3: {
                bit0: number;
                bit1: number;
                bit2: number;
                bit3: number;
                bit4: number;
                bit5: number;
                bit6: number;
                bit7: number;
                bit8: number;
                bit9: number;
                bit10: number;
                bit11: number;
                projectileCollision: number;
                bit13: number;
                bit14: number;
                bit15: number;
                bit16: number;
                bit17: number;
                bit18: number;
                bit19: number;
                noCollide: number;
                knockedOut: number;
                bit22: number;
                bit23: number;
            };
        };
        headActor: string;
    };
    pGetRemoteWeaponData(server: ZoneServer2016, item: BaseItem): {
        weaponDefinitionId: any;
        equipmentSlotId: number;
        firegroups: {
            firegroupId: any;
            unknownArray1: any;
        }[];
    };
    pGetRemoteWeaponExtraData(server: ZoneServer2016, item: BaseItem): {
        guid: string;
        unknownByte1: number;
        unknownByte2: number;
        unknownByte3: number;
        unknownByte4: number;
        unknownByte5: number;
        unknownDword1: number;
        unknownByte6: number;
        unknownDword2: number;
        unknownArray1: any;
    };
    pGetRemoteWeaponsData(server: ZoneServer2016): any[];
    pGetRemoteWeaponsExtraData(server: ZoneServer2016): any[];
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
    resetMetrics(): void;
    damage(server: ZoneServer2016, damageInfo: DamageInfo): void;
    mountContainer(server: ZoneServer2016, lootableEntity: BaseLootableEntity): void;
    dismountContainer(server: ZoneServer2016): void;
    getItemContainer(itemGuid: string): LoadoutContainer | undefined;
    getContainerFromGuid(containerGuid: string): LoadoutContainer | undefined;
    OnFullCharacterDataRequest(server: ZoneServer2016, client: ZoneClient2016): void;
    OnProjectileHit(server: ZoneServer2016, damageInfo: DamageInfo): void;
}
export {};
