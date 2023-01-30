import { DoorEntity } from "./doorentity";
import { ConstructionPermissionIds } from "../models/enums";
import { ZoneServer2016 } from "../zoneserver";
import { ZoneClient2016 } from "../classes/zoneclient";
import { DamageInfo } from "types/zoneserver";
import { ConstructionParentEntity } from "./constructionparententity";
import { ConstructionChildEntity } from "./constructionchildentity";
export declare class ConstructionDoor extends DoorEntity {
    ownerCharacterId: string;
    passwordHash: number;
    grantedAccess: Array<string>;
    health: number;
    parentObjectCharacterId: string;
    readonly itemDefinitionId: number;
    readonly slot: string;
    damageRange: number;
    readonly fixedPosition: Float32Array;
    placementTime: number;
    isSecured: boolean;
    constructor(characterId: string, transientId: number, actorModelId: number, position: Float32Array, rotation: Float32Array, server: ZoneServer2016, itemDefinitionId: number, ownerCharacterId: string, parentObjectCharacterId: string, slot: string);
    pGetConstructionHealth(): {
        characterId: string;
        health: number;
    };
    damage(server: ZoneServer2016, damageInfo: DamageInfo): void;
    destroy(server: ZoneServer2016, destructTime?: number): void;
    canUndoPlacement(server: ZoneServer2016, client: ZoneClient2016): boolean;
    getParent(server: ZoneServer2016): ConstructionChildEntity | undefined;
    getParentFoundation(server: ZoneServer2016): ConstructionParentEntity | undefined;
    getHasPermission(server: ZoneServer2016, characterId: string, permission: ConstructionPermissionIds): boolean;
    getSlotNumber(): number;
    OnPlayerSelect(server: ZoneServer2016, client: ZoneClient2016, isInstant?: boolean): void;
    OnInteractionString(server: ZoneServer2016, client: ZoneClient2016): void;
}
