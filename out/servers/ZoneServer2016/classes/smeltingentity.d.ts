import { ZoneServer2016 } from "../zoneserver";
import { LootableConstructionEntity } from "../entities/lootableconstructionentity";
import { BaseEntity } from "../entities/baseentity";
import { ZoneClient2016 } from "./zoneclient";
export declare class SmeltingEntity {
    parentObject: LootableConstructionEntity;
    allowedFuel: number[];
    filterId: number;
    workingEffect: number;
    isWorking: boolean;
    isSmelting: boolean;
    smeltingTime: number;
    dictionary: {
        [characterId: string]: BaseEntity;
    };
    subType: string;
    constructor(parentObject: LootableConstructionEntity, server: ZoneServer2016);
    startWorking(server: ZoneServer2016, parentObject: LootableConstructionEntity): void;
    startSmelting(server: ZoneServer2016, parentObject: LootableConstructionEntity): void;
    OnInteractionString(server: ZoneServer2016, client: ZoneClient2016): void;
    OnFullCharacterDataRequest(server: ZoneServer2016, client: ZoneClient2016): void;
}
