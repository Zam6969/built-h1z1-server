import { ConstructionChildEntity } from "./constructionchildentity";
import { ConstructionPermissionIds } from "../models/enums";
import { ZoneServer2016 } from "../zoneserver";
import { ZoneClient2016 } from "../classes/zoneclient";
import { ConstructionPermissions, ConstructionSlotPositionMap, OccupiedSlotMap, SquareBounds } from "types/zoneserver";
export declare class ConstructionParentEntity extends ConstructionChildEntity {
    permissions: {
        [characterId: string]: ConstructionPermissions;
    };
    ownerCharacterId: string;
    readonly expansionSlots: ConstructionSlotPositionMap;
    occupiedExpansionSlots: {
        [slot: number]: ConstructionParentEntity;
    };
    readonly rampSlots: ConstructionSlotPositionMap;
    occupiedRampSlots: {
        [slot: number]: ConstructionChildEntity;
    };
    readonly itemDefinitionId: number;
    readonly slot: string;
    readonly damageRange: number;
    readonly bounds?: SquareBounds;
    constructor(characterId: string, transientId: number, actorModelId: number, position: Float32Array, rotation: Float32Array, server: ZoneServer2016, itemDefinitionId: number, ownerCharacterId: string, ownerName: string, parentObjectCharacterId: string, BuildingSlot: string | undefined, overrideEulerAngle?: number);
    getOccupiedSlotMaps(): Array<OccupiedSlotMap>;
    private getSquareBounds;
    getAdjustedShelterSlotId(buildingSlot: string): string;
    /**
     * [Deck expansions only] Returns an array containing the parent foundation walls that a given expansion depends on to be secured.
     * @param expansion The expansion to check.
     */
    getDependentWalls(): Array<number>;
    /**
     * [Deck foundations only] Returns the slotId of an expansion on the same side as a given wall.
     * @param expansion The expansion to check.
     */
    getDependentExpansion(slotId: number): number;
    isSideSecure(side: number): boolean;
    /**
     * Tests if all walls slots of this foundation are occupied and secured.
     * @returns boolean
     */
    getWallsSecured(): boolean;
    updateSecuredState(server: ZoneServer2016): void;
    isExpansionSlotValid(buildingSlot: number | string, itemDefinitionId: number): boolean;
    setExpansionSlot(expansion: ConstructionParentEntity): boolean;
    isRampSlotValid(buildingSlot: number | string, itemDefinitionId: number): boolean;
    setRampSlot(ramp: ConstructionChildEntity): boolean;
    isInside(position: Float32Array): boolean;
    destroy(server: ZoneServer2016, destructTime?: number): void;
    isExpansionSlotsEmpty(): boolean;
    isSlotsEmpty(): boolean;
    canUndoPlacement(server: ZoneServer2016, client: ZoneClient2016): boolean;
    getHasPermission(server: ZoneServer2016, characterId: string, permission: ConstructionPermissionIds): boolean;
    OnPlayerSelect(server: ZoneServer2016, client: ZoneClient2016, isInstant?: boolean): void;
    OnInteractionString(server: ZoneServer2016, client: ZoneClient2016): void;
}
