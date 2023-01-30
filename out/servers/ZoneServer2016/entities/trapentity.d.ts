/// <reference types="node" />
import { Items } from "../models/enums";
import { ZoneServer2016 } from "../zoneserver";
import { BaseSimpleNpc } from "./basesimplenpc";
export declare class TrapEntity extends BaseSimpleNpc {
    trapTimer?: NodeJS.Timeout;
    isTriggered: boolean;
    npcRenderDistance: number;
    itemDefinitionId: number;
    constructor(characterId: string, transientId: number, actorModelId: number, position: Float32Array, rotation: Float32Array, server: ZoneServer2016, itemDefinitionId: Items);
    arm(server: ZoneServer2016): void;
}
