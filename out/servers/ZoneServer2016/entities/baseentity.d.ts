import { DamageInfo } from "types/zoneserver";
import { ZoneServer2016 } from "../zoneserver";
import { ZoneClient2016 } from "../classes/zoneclient";
export declare class BaseEntity {
    characterId: string;
    transientId: number;
    actorModelId: number;
    state: {
        position: Float32Array;
        rotation: Float32Array;
    };
    scale: Float32Array;
    npcRenderDistance?: number;
    constructor(characterId: string, transientId: number, actorModelId: number, position: Float32Array, rotation: Float32Array, server: ZoneServer2016);
    damage(server: ZoneServer2016, damageInfo: DamageInfo): void;
    OnPlayerSelect(server: ZoneServer2016, client: ZoneClient2016, isInstant?: boolean): void;
    OnInteractionString(server: ZoneServer2016, client: ZoneClient2016): void;
    OnProjectileHit(server: ZoneServer2016, damageInfo: DamageInfo): void;
}
