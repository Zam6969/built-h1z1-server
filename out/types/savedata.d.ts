import { ConstructionPermissions } from "./zoneserver";
export interface BaseSaveData {
    serverId: number;
}
export interface BaseEntityUpdateSaveData {
    position: Array<number>;
    rotation: Array<number>;
}
export interface BaseFullEntitySaveData extends BaseEntityUpdateSaveData, BaseSaveData {
    characterId: string;
    actorModelId: number;
}
export interface WeaponSaveData {
    ammoCount: number;
}
export interface ItemSaveData {
    itemDefinitionId: number;
    slotId: number;
    itemGuid: string;
    containerGuid: string;
    currentDurability: number;
    stackCount: number;
    weapon?: WeaponSaveData;
}
export interface LoadoutItemSaveData extends ItemSaveData {
    loadoutItemOwnerGuid: string;
}
export interface LoadoutContainerSaveData extends LoadoutItemSaveData {
    containerDefinitionId: number;
    items: {
        [itemGuid: string]: ItemSaveData;
    };
}
export interface BaseFullCharacterUpdateSaveData extends BaseEntityUpdateSaveData {
    _loadout: {
        [loadoutSlotId: number]: LoadoutItemSaveData;
    };
    _containers: {
        [loadoutSlotId: number]: LoadoutContainerSaveData;
    };
    _resources: {
        [resourceId: number]: number;
    };
    worldSaveVersion: number;
}
export interface CharacterUpdateSaveData extends BaseFullCharacterUpdateSaveData {
    isRespawning: boolean;
}
export interface FullCharacterSaveData extends CharacterUpdateSaveData, BaseFullEntitySaveData {
    creationDate: string;
    lastLoginDate: string;
    ownerId: string;
    characterName: string;
    headActor: string;
    hairModel: string;
    gender: number;
    status: number;
}
export interface FullVehicleSaveData extends BaseFullCharacterUpdateSaveData, BaseFullEntitySaveData {
    vehicleId: number;
}
export interface BaseConstructionSaveData extends BaseFullEntitySaveData {
    health: number;
    placementTime: number;
    parentObjectCharacterId: string;
    itemDefinitionId: number;
    slot: string;
}
export interface ConstructionDoorSaveData extends BaseConstructionSaveData {
    ownerCharacterId: string;
    passwordHash: number;
    grantedAccess: Array<string>;
}
export interface LootableConstructionSaveData extends BaseConstructionSaveData {
    container?: LoadoutContainerSaveData;
    subEntityType: string;
}
export interface ConstructionChildSaveData extends BaseConstructionSaveData {
    eulerAngle: number;
    occupiedWallSlots: {
        [slot: number]: ConstructionDoorSaveData | ConstructionChildSaveData;
    };
    occupiedUpperWallSlots: {
        [slot: number]: ConstructionChildSaveData;
    };
    occupiedShelterSlots: {
        [slot: number]: ConstructionChildSaveData;
    };
    freeplaceEntities: {
        [characterId: string]: ConstructionChildSaveData | ConstructionDoorSaveData | LootableConstructionSaveData;
    };
}
export interface ConstructionParentSaveData extends ConstructionChildSaveData {
    permissions: {
        [characterId: string]: ConstructionPermissions;
    };
    ownerCharacterId: string;
    occupiedExpansionSlots: {
        [slot: number]: ConstructionParentSaveData;
    };
    occupiedRampSlots: {
        [slot: number]: ConstructionChildSaveData;
    };
}
export interface PlantSaveData extends BaseFullEntitySaveData {
    growState: number;
    parentObjectCharacterId: string;
    slot: string;
    item: ItemSaveData;
}
export interface PlantingDiameterSaveData extends BaseFullEntitySaveData {
    seedSlots: {
        [id: string]: PlantSaveData;
    };
    fertilizedTimestamp: number;
    isFertilized: boolean;
}
export interface ServerSaveData extends BaseSaveData {
    lastItemGuid: string;
    worldSaveVersion: number;
}
