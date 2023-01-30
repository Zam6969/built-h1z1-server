/// <reference types="node" />
import { ZoneServer2016 } from "../zoneserver";
import { BaseSimpleNpc } from "./basesimplenpc";
export declare class TemporaryEntity extends BaseSimpleNpc {
    npcRenderDistance: number;
    disappearTimer?: NodeJS.Timeout;
    constructor(characterId: string, transientId: number, actorModelId: number, position: Float32Array, rotation: Float32Array, server: ZoneServer2016);
    setDespawnTimer(server: ZoneServer2016, time: number): void;
}
