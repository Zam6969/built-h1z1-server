import { ZoneServer2016 } from "../zoneserver";
import { LootableConstructionEntity } from "../entities/lootableconstructionentity";
import { BaseEntity } from "../entities/baseentity";
import { ZoneClient2016 } from "./zoneclient";
export declare class CollectingEntity {
    parentObject: LootableConstructionEntity;
    workingEffect: number;
    tickTime: number;
    dictionary: {
        [characterId: string]: BaseEntity;
    };
    requiredTicks: number;
    currentTicks: number;
    wasUsed: boolean;
    subType: string;
    constructor(parentObject: LootableConstructionEntity, server: ZoneServer2016);
    startWorking(server: ZoneServer2016, parentObject: LootableConstructionEntity): void;
    OnInteractionString(server: ZoneServer2016, client: ZoneClient2016): void;
}
