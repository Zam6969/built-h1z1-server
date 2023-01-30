import { BaseLightweightCharacter } from "./baselightweightcharacter";
import { ZoneServer2016 } from "../zoneserver";
import { ConstructionPermissionIds } from "../models/enums";
import { ConstructionSlotPositionMap, DamageInfo, OccupiedSlotMap, SlottedConstructionEntity, SquareBounds } from "types/zoneserver";
import { ZoneClient2016 } from "../classes/zoneclient";
import { ConstructionParentEntity } from "./constructionparententity";
import { ConstructionSlots } from "../data/constructionslots";
import { ConstructionDoor } from "./constructiondoor";
import { LootableConstructionEntity } from "./lootableconstructionentity";
export declare class ConstructionChildEntity extends BaseLightweightCharacter {
    health: number;
    readonly itemDefinitionId: number;
    parentObjectCharacterId: string;
    eulerAngle: number;
    readonly slot: string;
    isSecured: boolean;
    readonly damageRange: number;
    readonly fixedPosition?: Float32Array;
    placementTime: number;
    readonly bounds?: SquareBounds;
    readonly wallSlots: ConstructionSlotPositionMap;
    occupiedWallSlots: {
        [slot: number]: ConstructionDoor | ConstructionChildEntity;
    };
    readonly upperWallSlots: ConstructionSlotPositionMap;
    occupiedUpperWallSlots: {
        [slot: number]: ConstructionChildEntity;
    };
    readonly shelterSlots: ConstructionSlotPositionMap;
    occupiedShelterSlots: {
        [slot: number]: ConstructionChildEntity;
    };
    freeplaceEntities: {
        [characterId: string]: ConstructionChildEntity | ConstructionDoor | LootableConstructionEntity;
    };
    constructor(characterId: string, transientId: number, actorModelId: number, position: Float32Array, rotation: Float32Array, server: ZoneServer2016, itemDefinitionId: number, parentObjectCharacterId: string, slot: string, overrideEulerAngle?: number);
    getOccupiedSlotMaps(): Array<OccupiedSlotMap>;
    getSlotPosition(slot: string | number, slots: ConstructionSlotPositionMap): Float32Array | undefined;
    getSlotRotation(slot: string | number, slots: ConstructionSlotPositionMap): Float32Array | undefined;
    updateSecuredState(server: ZoneServer2016): void;
    isSlotOccupied(slotMap: OccupiedSlotMap, slot: number): boolean;
    isSlotsEmpty(): boolean;
    protected isSlotValid(slot: number, definitions: ConstructionSlots, slotMap: ConstructionSlotPositionMap, itemDefinitionId: number): boolean;
    protected setSlot(entity: SlottedConstructionEntity, definitions: ConstructionSlots, slotMap: ConstructionSlotPositionMap, occupiedSlots: OccupiedSlotMap): boolean;
    clearSlot(slot: number, occupiedSlots: OccupiedSlotMap): void;
    isWallSlotValid(buildingSlot: number | string, itemDefinitionId: number): boolean;
    setWallSlot(server: ZoneServer2016, wall: ConstructionChildEntity | ConstructionDoor): boolean;
    isShelterSlotValid(buildingSlot: number | string, itemDefinitionId: number): boolean;
    setShelterSlot(server: ZoneServer2016, shelter: ConstructionChildEntity): boolean;
    addFreeplaceConstruction(entity: ConstructionChildEntity | ConstructionDoor | LootableConstructionEntity): void;
    pGetConstructionHealth(): {
        characterId: string;
        health: number;
    };
    damage(server: ZoneServer2016, damageInfo: DamageInfo): void;
    isInside(position: Float32Array): boolean;
    destroy(server: ZoneServer2016, destructTime?: number): void;
    getParent(server: ZoneServer2016): ConstructionParentEntity | undefined;
    canUndoPlacement(server: ZoneServer2016, client: ZoneClient2016): boolean;
    getHasPermission(server: ZoneServer2016, characterId: string, permission: ConstructionPermissionIds): boolean;
    getParentFoundation(server: ZoneServer2016): ConstructionParentEntity | undefined;
    getSlotNumber(): number;
    OnPlayerSelect(server: ZoneServer2016, client: ZoneClient2016, isInstant?: boolean): void;
    OnInteractionString(server: ZoneServer2016, client: ZoneClient2016): void;
}
