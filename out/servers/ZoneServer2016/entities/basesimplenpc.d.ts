import { ZoneServer2016 } from "../zoneserver";
import { BaseEntity } from "./baseentity";
export declare class BaseSimpleNpc extends BaseEntity {
    health: number;
    constructor(characterId: string, transientId: number, actorModelId: number, position: Float32Array, rotation: Float32Array, server: ZoneServer2016);
    pGetSimpleNpc(): {
        characterId: string;
        transientId: number;
        position: Float32Array;
        rotation: Float32Array;
        modelId: number;
        scale: Float32Array;
        showHealth: boolean;
        health: number;
    };
    pGetSimpleProxyHealth(): {
        characterId: string;
        healthPercentage: number;
    };
}
