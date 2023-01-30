import { BaseLootableEntity } from "./baselootableentity";
import { ZoneServer2016 } from "../zoneserver";
export declare class Lootbag extends BaseLootableEntity {
    creationTime: number;
    canAcceptItems: boolean;
    loadoutId: number;
    constructor(characterId: string, transientId: number, actorModelId: number, position: Float32Array, rotation: Float32Array, server: ZoneServer2016);
}
