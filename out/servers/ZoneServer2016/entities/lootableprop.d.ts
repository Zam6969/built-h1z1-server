import { BaseLootableEntity } from "./baselootableentity";
import { ZoneServer2016 } from "../zoneserver";
import { ZoneClient2016 } from "../classes/zoneclient";
export declare class LootableProp extends BaseLootableEntity {
    spawnerId: number;
    npcRenderDistance: number;
    positionUpdateType: number;
    containerId: number;
    lootSpawner: string;
    searchTime: number;
    constructor(characterId: string, transientId: number, actorModelId: number, position: Float32Array, rotation: Float32Array, server: ZoneServer2016, scale: Float32Array, spawnerId: number, renderDistance: number);
    OnPlayerSelect(server: ZoneServer2016, client: ZoneClient2016, isInstant?: boolean): void;
    OnInteractionString(server: ZoneServer2016, client: ZoneClient2016): void;
}
