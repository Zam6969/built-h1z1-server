import { ZoneServer2016 } from "../zoneserver";
import { Vehicle2016 } from "../entities/vehicle";
import { ItemObject } from "../entities/itemobject";
import { BaseFullCharacter } from "../entities/basefullcharacter";
import { BaseItem } from "../classes/baseItem";
export declare class WorldObjectManager {
    _spawnedNpcs: {
        [spawnerId: number]: string;
    };
    _spawnedLootObjects: {
        [spawnerId: number]: string;
    };
    vehicleSpawnCap: number;
    private lastLootRespawnTime;
    private lastVehicleRespawnTime;
    private lastNpcRespawnTime;
    lootRespawnTimer: number;
    vehicleRespawnTimer: number;
    npcRespawnTimer: number;
    itemDespawnTimer: number;
    lootDespawnTimer: number;
    deadNpcDespawnTimer: number;
    vehicleSpawnRadius: number;
    npcSpawnRadius: number;
    chanceNpc: number;
    chanceScreamer: number;
    private zombieSlots;
    private getItemRespawnTimer;
    run(server: ZoneServer2016): void;
    private equipRandomSkins;
    createZombie(server: ZoneServer2016, modelId: number, position: Float32Array, rotation: Float32Array, spawnerId?: number): void;
    createLootEntity(server: ZoneServer2016, item: BaseItem | undefined, position: Float32Array, rotation: Float32Array, itemSpawnerId?: number): ItemObject | undefined;
    createLootbag(server: ZoneServer2016, entity: BaseFullCharacter): void;
    createProps(server: ZoneServer2016): void;
    private createDoor;
    createDoors(server: ZoneServer2016): void;
    createVehicle(server: ZoneServer2016, vehicle: Vehicle2016): void;
    createVehicles(server: ZoneServer2016): void;
    createNpcs(server: ZoneServer2016): void;
    createLoot(server: ZoneServer2016, lTables?: {
        [lootSpawner: string]: import("types/zoneserver").LootSpawner;
    }): void;
    createContainerLoot(server: ZoneServer2016): void;
}
