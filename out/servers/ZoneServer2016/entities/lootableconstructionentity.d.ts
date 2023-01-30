import { ConstructionPermissionIds } from "../models/enums";
import { DamageInfo } from "types/zoneserver";
import { ZoneServer2016 } from "../zoneserver";
import { BaseLootableEntity } from "./baselootableentity";
import { ConstructionChildEntity } from "./constructionchildentity";
import { ConstructionParentEntity } from "./constructionparententity";
import { ZoneClient2016 } from "../classes/zoneclient";
import { SmeltingEntity } from "../classes/smeltingentity";
import { CollectingEntity } from "../classes/collectingentity";
export declare class LootableConstructionEntity extends BaseLootableEntity {
    get health(): number;
    set health(health: number);
    placementTime: number;
    parentObjectCharacterId: string;
    npcRenderDistance: number;
    loadoutId: number;
    itemDefinitionId: number;
    subEntity?: SmeltingEntity | CollectingEntity;
    constructor(characterId: string, transientId: number, actorModelId: number, position: Float32Array, rotation: Float32Array, server: ZoneServer2016, itemDefinitionId: number, parentObjectCharacterId: string, subEntityType: string);
    damage(server: ZoneServer2016, damageInfo: DamageInfo): void;
    getParent(server: ZoneServer2016): ConstructionParentEntity | ConstructionChildEntity | undefined;
    getParentFoundation(server: ZoneServer2016): ConstructionParentEntity | undefined;
    canUndoPlacement(server: ZoneServer2016, client: ZoneClient2016): boolean;
    destroy(server: ZoneServer2016, destructTime?: number): void;
    getHasPermission(server: ZoneServer2016, characterId: string, permission: ConstructionPermissionIds): boolean;
    OnPlayerSelect(server: ZoneServer2016, client: ZoneClient2016, isInstant?: boolean): void;
    OnInteractionString(server: ZoneServer2016, client: ZoneClient2016): void;
    OnFullCharacterDataRequest(server: ZoneServer2016, client: ZoneClient2016): void;
}
