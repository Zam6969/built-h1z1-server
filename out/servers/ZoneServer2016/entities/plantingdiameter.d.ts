import { TemporaryEntity } from "./temporaryentity";
import { ZoneServer2016 } from "../zoneserver";
import { Plant } from "./plant";
export declare class PlantingDiameter extends TemporaryEntity {
    seedSlots: {
        [id: string]: Plant;
    };
    disappearTimestamp: number;
    isFertilized: boolean;
    fertilizedTimestamp: number;
    constructor(characterId: string, transientId: number, actorModelId: number, position: Float32Array, rotation: Float32Array, server: ZoneServer2016);
}
