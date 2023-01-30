"use strict";
// ======================================================================
//
//   GNU GENERAL PUBLIC LICENSE
//   Version 3, 29 June 2007
//   copyright (C) 2020 - 2021 Quentin Gruber
//   copyright (C) 2021 - 2023 H1emu community
//
//   https://github.com/QuentinGruber/h1z1-server
//   https://www.npmjs.com/package/h1z1-server
//
//   Based on https://github.com/psemu/soe-network
// ======================================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorldObjectManager = void 0;
const Z1_doors = require("../../../../data/2016/zoneData/Z1_doors.json");
const Z1_items = require("../../../../data/2016/zoneData/Z1_items.json");
const Z1_vehicles = require("../../../../data/2016/zoneData/Z1_vehicleLocations.json");
const Z1_npcs = require("../../../../data/2016/zoneData/Z1_npcs.json");
const Z1_lootableProps = require("../../../../data/2016/zoneData/Z1_lootableProps.json");
const models = require("../../../../data/2016/dataSources/Models.json");
const bannedZombieModels = require("../../../../data/2016/sampleData/bannedZombiesModels.json");
const utils_1 = require("../../../utils/utils");
const enums_1 = require("../models/enums");
const vehicle_1 = require("../entities/vehicle");
const itemobject_1 = require("../entities/itemobject");
const doorentity_1 = require("../entities/doorentity");
const zombie_1 = require("../entities/zombie");
const explosiveentity_1 = require("../entities/explosiveentity");
const lootspawns_1 = require("../data/lootspawns");
const lootbag_1 = require("../entities/lootbag");
const lootableprop_1 = require("../entities/lootableprop");
const debug = require("debug")("ZoneServer");
function getRandomVehicleId() {
    switch (Math.floor(Math.random() * 4)) {
        case 0: // offroader
            return enums_1.VehicleIds.OFFROADER;
        case 1: // policecar
            return enums_1.VehicleIds.POLICECAR;
        case 2: // pickup
            return enums_1.VehicleIds.PICKUP;
        case 3: // atv
            return enums_1.VehicleIds.ATV;
        default:
            // pickup
            return enums_1.VehicleIds.PICKUP;
    }
}
function getRandomSkin(itemDefinitionId) {
    const allowedItems = [
        enums_1.Items.SHIRT_DEFAULT,
        enums_1.Items.PANTS_DEFAULT,
        enums_1.Items.HAT_BEANIE,
        enums_1.Items.HAT_CAP,
        enums_1.Items.HELMET_MOTORCYCLE,
    ];
    if (!allowedItems.includes(itemDefinitionId))
        return itemDefinitionId;
    let itemDefId = 0;
    let arr = [];
    switch (itemDefinitionId) {
        case enums_1.Items.SHIRT_DEFAULT:
            arr = Object.keys(enums_1.Skins_Shirt);
            break;
        case enums_1.Items.PANTS_DEFAULT:
            arr = Object.keys(enums_1.Skins_Pants);
            break;
        case enums_1.Items.HAT_BEANIE:
            arr = Object.keys(enums_1.Skins_Beanie);
            break;
        case enums_1.Items.HAT_CAP:
            arr = Object.keys(enums_1.Skins_Cap);
            break;
        case enums_1.Items.HELMET_MOTORCYCLE:
            arr = Object.keys(enums_1.Skins_MotorHelmet);
            break;
    }
    itemDefId = Number(arr[Math.floor((Math.random() * arr.length) / 2)]);
    return itemDefId;
}
function getRandomItem(items) {
    //return items[Math.floor(Math.random() * items.length)];
    //items[0].
    const totalWeight = items.reduce((total, item) => total + item.weight, 0), randomWeight = Math.random() * totalWeight;
    let currentWeight = 0;
    for (let i = 0; i < items.length; i++) {
        currentWeight += items[i].weight;
        if (currentWeight > randomWeight) {
            return items[i];
        }
    }
    // This line should never be reached, but is included for type safety
    return;
}
class WorldObjectManager {
    constructor() {
        this._spawnedNpcs = {};
        this._spawnedLootObjects = {};
        this.vehicleSpawnCap = 100;
        this.lastLootRespawnTime = 0;
        this.lastVehicleRespawnTime = 0;
        this.lastNpcRespawnTime = 0;
        this.lootRespawnTimer = 1200000; // 30 min default
        this.vehicleRespawnTimer = 600000; // 10 minutes // 600000
        this.npcRespawnTimer = 600000; // 10 minutes
        // items get despawned after x minutes
        this.itemDespawnTimer = 600000; // 10 minutes
        this.lootDespawnTimer = 3600000; // 60 minutes
        this.deadNpcDespawnTimer = 600000; // 10 minutes
        // objects won't spawn if another object is within this radius
        this.vehicleSpawnRadius = 50;
        this.npcSpawnRadius = 3;
        this.chanceNpc = 100;
        this.chanceScreamer = 5; // 1000 max
        this.zombieSlots = [
            enums_1.EquipSlots.HEAD,
            enums_1.EquipSlots.CHEST,
            enums_1.EquipSlots.LEGS,
            enums_1.EquipSlots.HANDS,
            enums_1.EquipSlots.FEET,
            enums_1.EquipSlots.HAIR,
        ];
    }
    getItemRespawnTimer(server) {
        const playerCount = utils_1._.size(server._characters);
        switch (true) {
            case playerCount <= 20:
                this.lootRespawnTimer = 2400000; // 40 min
                break;
            case playerCount > 20 && playerCount <= 40:
                this.lootRespawnTimer = 1800000; // 30 min
                break;
            case playerCount > 40 && playerCount <= 60:
                this.lootRespawnTimer = 1200000; // 20 min
                break;
            case playerCount > 60 && playerCount < 40:
                this.lootRespawnTimer = 600000; // 10 min
                break;
            default:
                this.lootRespawnTimer = 1200000;
        }
    }
    run(server) {
        debug("WOM::Run");
        this.getItemRespawnTimer(server);
        if (this.lastLootRespawnTime + this.lootRespawnTimer <= Date.now()) {
            //this.createLootOld(server);
            this.createLoot(server);
            this.createContainerLoot(server);
            this.lastLootRespawnTime = Date.now();
            server.divideLargeCells(700);
        }
        if (this.lastNpcRespawnTime + this.npcRespawnTimer <= Date.now()) {
            this.createNpcs(server);
            this.lastNpcRespawnTime = Date.now();
        }
        if (this.lastVehicleRespawnTime + this.vehicleRespawnTimer <= Date.now()) {
            this.createVehicles(server);
            this.lastVehicleRespawnTime = Date.now();
        }
    }
    equipRandomSkins(server, entity, slots, excludedModels = []) {
        server.generateRandomEquipmentsFromAnEntity(entity, slots, excludedModels);
    }
    createZombie(server, modelId, position, rotation, spawnerId = 0) {
        const characterId = (0, utils_1.generateRandomGuid)();
        const zombie = new zombie_1.Zombie(characterId, server.getTransientId(characterId), modelId, position, rotation, server, spawnerId);
        this.equipRandomSkins(server, zombie, this.zombieSlots, bannedZombieModels);
        server._npcs[characterId] = zombie;
        if (spawnerId)
            this._spawnedNpcs[spawnerId] = characterId;
    }
    createLootEntity(server, item, position, rotation, itemSpawnerId = -1) {
        if (!item) {
            debug(`[ERROR] Tried to createLootEntity with invalid item object`);
            return;
        }
        const itemDef = server.getItemDefinition(item.itemDefinitionId);
        if (!itemDef) {
            debug(`[ERROR] Tried to createLootEntity for invalid itemDefId: ${item.itemDefinitionId}`);
            return;
        }
        const characterId = (0, utils_1.generateRandomGuid)(), modelId = itemDef.WORLD_MODEL_ID || 9;
        server._spawnedItems[characterId] = new itemobject_1.ItemObject(characterId, server.getTransientId(characterId), modelId, position, rotation, server, itemSpawnerId || 0, item);
        server._spawnedItems[characterId].nameId = itemDef.NAME_ID;
        if (item.itemDefinitionId === enums_1.Items.FUEL_ETHANOL ||
            item.itemDefinitionId === enums_1.Items.FUEL_BIOFUEL) {
            server._spawnedItems[characterId].flags.projectileCollision = 1;
            server._explosives[characterId] = new explosiveentity_1.ExplosiveEntity(characterId, server.getTransientId(characterId), modelId, position, rotation, server, item.itemDefinitionId);
        }
        if (itemSpawnerId)
            this._spawnedLootObjects[itemSpawnerId] = characterId;
        server._spawnedItems[characterId].creationTime = Date.now();
        return server._spawnedItems[characterId];
    }
    createLootbag(server, entity) {
        const characterId = (0, utils_1.generateRandomGuid)(), isCharacter = !!server._characters[entity.characterId], items = entity.getDeathItems(server);
        if (!utils_1._.size(items))
            return; // don't spawn lootbag if inventory is empty
        const lootbag = new lootbag_1.Lootbag(characterId, server.getTransientId(characterId), isCharacter ? 9581 : 9391, entity.state.position, new Float32Array([0, 0, 0, 0]), server);
        const container = lootbag.getContainer();
        if (container) {
            container.items = items;
        }
        server._lootbags[characterId] = lootbag;
    }
    createProps(server) {
        Z1_lootableProps.forEach((propType) => {
            propType.instances.forEach((propInstance) => {
                const characterId = (0, utils_1.generateRandomGuid)();
                const obj = new lootableprop_1.LootableProp(characterId, server.getTransientId(characterId), // need transient generated for Interaction Replication
                propInstance.modelId, propInstance.position, propInstance.rotation, server, propInstance.scale, propInstance.id, propType.renderDistance);
                server._lootableProps[characterId] = obj;
                obj.equipItem(server, server.generateItem(obj.containerId), false);
                obj._containers["31"].canAcceptItems = false;
                obj.nameId = server.getItemDefinition(obj.containerId).NAME_ID;
            });
        });
        debug("All props created");
    }
    createDoor(server, modelID, position, rotation, scale, spawnerId) {
        const characterId = (0, utils_1.generateRandomGuid)();
        server._doors[characterId] = new doorentity_1.DoorEntity(characterId, server.getTransientId(characterId), modelID, position, rotation, server, scale, spawnerId);
    }
    createDoors(server) {
        Z1_doors.forEach((doorType) => {
            const modelId = utils_1._.find(models, (model) => {
                return (model.MODEL_FILE_NAME ===
                    doorType.actorDefinition.replace("_Placer", ""));
            })?.ID;
            doorType.instances.forEach((doorInstance) => {
                this.createDoor(server, modelId ? modelId : 9183, doorInstance.position, doorInstance.rotation, doorInstance.scale ?? [1, 1, 1, 1], doorInstance.id);
            });
        });
        debug("All doors objects created");
    }
    createVehicle(server, vehicle) {
        vehicle.equipLoadout(server);
        // TODO - Randomize these
        vehicle.equipItem(server, server.generateItem(vehicle.getTurboItemId()));
        vehicle.equipItem(server, server.generateItem(vehicle.getHeadlightsItemId()));
        vehicle.equipItem(server, server.generateItem(enums_1.Items.BATTERY));
        vehicle.equipItem(server, server.generateItem(enums_1.Items.SPARKPLUGS));
        server._vehicles[vehicle.characterId] = vehicle;
    }
    createVehicles(server) {
        if (Object.keys(server._vehicles).length >= this.vehicleSpawnCap)
            return;
        Z1_vehicles.forEach((vehicle) => {
            let spawn = true;
            Object.values(server._vehicles).every((spawnedVehicle) => {
                if ((0, utils_1.isPosInRadius)(this.vehicleSpawnRadius, vehicle.position, spawnedVehicle.state.position)) {
                    spawn = false;
                    return false;
                }
                return true;
            });
            if (!spawn)
                return;
            const characterId = (0, utils_1.generateRandomGuid)(), vehicleData = new vehicle_1.Vehicle2016(characterId, server.getTransientId(characterId), 0, new Float32Array(vehicle.position), new Float32Array(vehicle.rotation), server, server.getGameTime(), getRandomVehicleId());
            this.createVehicle(server, vehicleData); // save vehicle
        });
        debug("All vehicles created");
    }
    createNpcs(server) {
        // This is only for giving the world some life
        Z1_npcs.forEach((spawnerType) => {
            const authorizedModelId = [];
            switch (spawnerType.actorDefinition) {
                case "NPCSpawner_ZombieLazy.adr":
                    authorizedModelId.push(9510);
                    authorizedModelId.push(9634);
                    break;
                case "NPCSpawner_ZombieWalker.adr":
                    authorizedModelId.push(9510);
                    authorizedModelId.push(9634);
                    break;
                case "NPCSpawner_Deer001.adr":
                    authorizedModelId.push(9002);
                    break;
                default:
                    break;
            }
            if (!authorizedModelId.length)
                return;
            spawnerType.instances.forEach((npcInstance) => {
                let spawn = true;
                Object.values(server._npcs).every((spawnedNpc) => {
                    if ((0, utils_1.isPosInRadius)(this.npcSpawnRadius, npcInstance.position, spawnedNpc.state.position)) {
                        spawn = false;
                        return false;
                    }
                    return true;
                });
                if (!spawn)
                    return;
                const spawnchance = Math.floor(Math.random() * 100) + 1; // temporary spawnchance
                if (spawnchance <= this.chanceNpc) {
                    const screamerChance = Math.floor(Math.random() * 1000) + 1; // temporary spawnchance
                    if (screamerChance <= this.chanceScreamer) {
                        authorizedModelId.push(9667);
                    }
                    this.createZombie(server, authorizedModelId[Math.floor(Math.random() * authorizedModelId.length)], npcInstance.position, new Float32Array((0, utils_1.eul2quat)(npcInstance.rotation)), npcInstance.id);
                }
            });
        });
        debug("All npcs objects created");
    }
    createLoot(server, lTables = lootspawns_1.lootTables) {
        // temp logic until item weights are added
        Z1_items.forEach((spawnerType) => {
            const lootTable = lTables[spawnerType.actorDefinition];
            if (lootTable) {
                spawnerType.instances.forEach((itemInstance) => {
                    if (this._spawnedLootObjects[itemInstance.id])
                        return;
                    const chance = Math.floor(Math.random() * 100) + 1; // temporary spawnchance
                    if (chance <= lootTable.spawnChance) {
                        // temporary spawnchance
                        const item = getRandomItem(lootTable.items);
                        if (item) {
                            this.createLootEntity(server, server.generateItem(getRandomSkin(item.item), (0, utils_1.randomIntFromInterval)(item.spawnCount.min, item.spawnCount.max)), itemInstance.position, itemInstance.rotation, itemInstance.id);
                        }
                    }
                });
            }
        });
    }
    createContainerLoot(server) {
        for (const a in server._lootableProps) {
            const prop = server._lootableProps[a];
            const container = prop.getContainer();
            if (!container)
                continue;
            if (!!Object.keys(container.items).length)
                continue; // skip if container is not empty
            const lootTable = lootspawns_1.containerLootSpawners[prop.lootSpawner];
            if (lootTable) {
                for (let x = 0; x < lootTable.maxItems; x++) {
                    const item = getRandomItem(lootTable.items);
                    if (!item)
                        continue;
                    const chance = Math.floor(Math.random() * 100) + 1; // temporary spawnchance
                    let allow = true;
                    Object.values(container.items).forEach((spawnedItem) => {
                        if (item.item == spawnedItem.itemDefinitionId)
                            allow = false; // dont allow the same item to be added twice
                    });
                    if (allow) {
                        if (chance <= item.weight) {
                            const count = Math.floor(Math.random() *
                                (item.spawnCount.max - item.spawnCount.min + 1) +
                                item.spawnCount.min);
                            // temporary spawnchance
                            server.addContainerItemExternal(prop.mountedCharacter ? prop.mountedCharacter : "", server.generateItem(getRandomSkin(item.item)), container, count);
                        }
                    }
                    else {
                        x--;
                    }
                }
            }
            if (Object.keys(container.items).length != 0) {
                // mark prop as unsearched for clients
                Object.values(server._clients).forEach((client) => {
                    const index = client.searchedProps.indexOf(prop);
                    if (index > -1) {
                        client.searchedProps.splice(index, 1);
                    }
                });
            }
        }
    }
}
exports.WorldObjectManager = WorldObjectManager;
//# sourceMappingURL=worldobjectmanager.js.map