import { Npc } from "./npc";
import { ZoneServer2016 } from "../zoneserver";
export declare class Zombie extends Npc {
    constructor(characterId: string, transientId: number, actorModelId: number, position: Float32Array, rotation: Float32Array, server: ZoneServer2016, spawnerId?: number);
}
