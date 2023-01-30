/// <reference types="node" />
import { DamageInfo } from "types/zoneserver";
import { ZoneServer2016 } from "../zoneserver";
import { BaseLightweightCharacter } from "./baselightweightcharacter";
import { ZoneClient2016 } from "../classes/zoneclient";
export declare class ExplosiveEntity extends BaseLightweightCharacter {
    itemDefinitionId: number;
    mineTimer?: NodeJS.Timeout;
    npcRenderDistance: number;
    detonated: boolean;
    constructor(characterId: string, transientId: number, actorModelId: number, position: Float32Array, rotation: Float32Array, server: ZoneServer2016, itemDefinitionId: number);
    isIED(): boolean;
    isLandmine(): boolean;
    ignite(server: ZoneServer2016, client: ZoneClient2016): void;
    detonate(server: ZoneServer2016, client?: ZoneClient2016): void;
    arm(server: ZoneServer2016): void;
    OnProjectileHit(server: ZoneServer2016, damageInfo: DamageInfo): void;
}
