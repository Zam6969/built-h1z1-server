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
exports.createAllEntities = void 0;
const debug = require("debug")("baseEntityCreator");
const Z1_vehicles = require("../../../../data/2015/sampleData/vehicleLocations.json");
const Z1_items = require("../../../../data/2015/zoneData/Z1_items.json");
const z1_doors = require("../../../../data/2015/zoneData/Z1_doors.json");
const Z1_npcs = require("../../../../data/2015/zoneData/Z1_npcs.json");
const z1_Props = require("../../../../data/2015/zoneData/z1_Props.json");
const models = require("../../../../data/2015/dataSources/Models.json");
const modelToName = require("../../../../data/2015/sampleData/ModelToName.json");
const textures = require("../../../../data/2015/sampleData/textures.json");
const Z1_destroyablePS = require("../../../../data/2015/zoneData/Z1_destroyablePS.json");
const Z1_destroyable = require("../../../../data/2015/zoneData/Z1_destroyable.json");
const utils_1 = require("../../../utils/utils");
const vehicle_1 = require("../classes/vehicle");
const npcs = {};
const objects = {};
const vehicles = {};
const doors = {};
const props = {};
const destroyable = {};
const chancePumpShotgun = 50;
const chanceAR15 = 50;
const chanceTools = 50;
const chance1911 = 100;
const chanceM24 = 50;
const chanceConsumables = 50;
const chanceClothes = 50;
const chanceResidential = 10;
const chanceRare = 10;
const chanceIndustrial = 10;
const chanceWorld = 10;
const chanceLog = 10;
const chanceCommercial = 10;
const chanceFarm = 10;
let numberOfSpawnedEntity = 0;
function createEntity(server, modelID, position, rotation, scale, texture, zoneId, dictionnary) {
    let stringNameId = 0;
    modelToName.forEach((spawnername) => {
        if (modelID === spawnername.modelId) {
            stringNameId = spawnername.NameId;
        }
    });
    const guid = (0, utils_1.generateRandomGuid)();
    const characterId = (0, utils_1.generateRandomGuid)();
    numberOfSpawnedEntity++;
    if (numberOfSpawnedEntity > 60000) {
        numberOfSpawnedEntity = 1;
    }
    server._transientIds[numberOfSpawnedEntity] = characterId;
    dictionnary[characterId] = {
        worldId: server._worldId,
        zoneId: zoneId,
        characterId: characterId,
        guid: guid,
        transientId: numberOfSpawnedEntity,
        nameId: stringNameId,
        modelId: modelID,
        scale: scale,
        texture: texture,
        position: position,
        rotation: rotation,
    };
}
function createDTO(server, modelID, extraModel, position, rotation, scale, zoneId, renderDistance, dictionnary) {
    let stringNameId = 0;
    modelToName.forEach((spawnername) => {
        if (modelID === spawnername.modelId) {
            stringNameId = spawnername.NameId;
        }
    });
    const guid = (0, utils_1.generateRandomGuid)();
    const characterId = (0, utils_1.generateRandomGuid)();
    server._transientIds[numberOfSpawnedEntity] = characterId;
    dictionnary[characterId] = {
        timestamp: 0,
        worldId: server._worldId,
        zoneId: zoneId,
        characterId: characterId,
        guid: guid,
        transientId: numberOfSpawnedEntity,
        nameId: stringNameId,
        modelId: modelID,
        extraModel: extraModel,
        scale: scale,
        position: position,
        rotation: rotation,
        positionUpdateType: 1,
        renderDistance: renderDistance,
        dontRequestFullData: true,
        color: { g: 127 },
    };
}
function createDoor(server, modelID, position, rotation, startRot, scale, texture, zoneId, dictionnary) {
    let stringNameId = 0;
    modelToName.forEach((spawnername) => {
        if (modelID === spawnername.modelId) {
            stringNameId = spawnername.NameId;
        }
    });
    const guid = (0, utils_1.generateRandomGuid)();
    const characterId = (0, utils_1.generateRandomGuid)();
    numberOfSpawnedEntity++;
    if (numberOfSpawnedEntity > 60000) {
        numberOfSpawnedEntity = 1;
    }
    let openAngle;
    if (startRot[0] <= 0) {
        openAngle = startRot[0] - 1.575;
    }
    else {
        openAngle = startRot[0] + 1.575;
    }
    server._transientIds[numberOfSpawnedEntity] = characterId;
    dictionnary[characterId] = {
        worldId: server._worldId,
        zoneId: zoneId,
        isOpen: false,
        characterId: characterId,
        guid: guid,
        transientId: numberOfSpawnedEntity,
        nameId: stringNameId,
        modelId: modelID,
        scale: scale,
        texture: texture,
        positionUpdateType: 1,
        position: position,
        rotation: rotation,
        rotationRaw: startRot,
        openAngle: openAngle,
        closedAngle: startRot[0],
        color: { g: 127 },
    };
}
function createAllEntities(server) {
    createAllDoors(server);
    createAR15(server);
    createPumpShotgun(server);
    createTools(server);
    create1911(server);
    createM24(server);
    createConsumables(server);
    createClothes(server);
    createResidential(server);
    createRare(server);
    createIndustrial(server);
    createWorld(server);
    createLog(server);
    createCommercial(server);
    createFarm(server);
    createProps(server);
    createAllVehicles(server);
    createSomeNpcs(server);
    createDestroyable(server);
    createDestroyablePS(server);
    return {
        npcs: npcs,
        objects: objects,
        vehicles: vehicles,
        doors: doors,
        props: props,
        destroyable: destroyable,
    };
}
exports.createAllEntities = createAllEntities;
function getRandomVehicleModelId() {
    switch (Math.floor(Math.random() * 3)) {
        case 0:
            return 7225;
        case 1:
            return 9301;
        case 2:
            return 9258;
        default:
            return 9258;
    }
}
function createDestroyable(server) {
    Z1_destroyable.forEach((DTOType) => {
        const authorizedModelId = [];
        switch (DTOType.actorDefinition) {
            case "Common_Props_BarbedWireFence1x2.adr":
                authorizedModelId.push(9114);
                break;
            case "Common_Props_BarbedWireFence1x1.adr":
                authorizedModelId.push(9113);
                break;
            case "Common_Props_Fences_WoodPlanksGreyPosts1x2.adr":
                authorizedModelId.push(8037);
                break;
            case "Common_Props_Fences_WoodPlanksGrey1x1.adr":
                authorizedModelId.push(8033);
                break;
            case "Common_Props_Fences_WoodPlanksGreyPlank.adr":
                authorizedModelId.push(8035);
                break;
            case "Common_Props_Fences_WoodPlanksGreyGap1x1.adr":
                authorizedModelId.push(8034);
                break;
            case "Common_Props_Fences_WoodPlanksGreyPosts1x1.adr":
                authorizedModelId.push(8036);
                break;
            default:
                break;
        }
        if (authorizedModelId.length) {
            DTOType.instances.forEach((DTOInstance) => {
                const spawnModel = authorizedModelId[Math.floor(Math.random() * authorizedModelId.length)];
                createDTO(server, spawnModel, "", DTOInstance.position, (0, utils_1.eul2quatLegacy)(DTOInstance.rotation), DTOInstance.scale, DTOInstance.id, DTOType.renderDistance, destroyable);
            });
        }
    });
    debug("AR15 and ammo items objects created. Spawnrate:" + chanceAR15 + "%");
}
function createDestroyablePS(server) {
    Z1_destroyablePS.forEach((propType) => {
        propType.instances.forEach((propInstance) => {
            createDTO(server, 9084, propType.actorDefinition, propInstance.position, propInstance.rotation, propInstance.scale, propInstance.id, propType.renderDistance, destroyable);
        });
    });
    debug("Props objects created");
}
function createAllVehicles(server) {
    Z1_vehicles.forEach((vehicle) => {
        const characterId = (0, utils_1.generateRandomGuid)();
        numberOfSpawnedEntity++;
        server._transientIds[numberOfSpawnedEntity] = characterId;
        const modelId = getRandomVehicleModelId();
        const { position, rotation } = vehicle;
        vehicles[characterId] = new vehicle_1.Vehicle(server._worldId, characterId, numberOfSpawnedEntity, modelId, new Float32Array(position), new Float32Array(rotation));
    });
    debug("All vehicles created");
}
function createSomeNpcs(server) {
    // This is only for giving the world some life
    Z1_npcs.forEach((spawnerType) => {
        const authorizedModelId = [];
        switch (spawnerType.actorDefinition) {
            case "NPCSpawner_ZombieLazy.adr":
                authorizedModelId.push(9001);
                authorizedModelId.push(9193);
                authorizedModelId.push(9188);
                break;
            case "NPCSpawner_ZombieWalker.adr":
                authorizedModelId.push(9001);
                authorizedModelId.push(9193);
                authorizedModelId.push(9188);
                break;
            case "NPCSpawner_Deer001.adr":
                authorizedModelId.push(9002);
                break;
            default:
                break;
        }
        if (authorizedModelId.length) {
            spawnerType.instances.forEach((itemInstance) => {
                const spawnchance = Math.floor(Math.random() * 100) + 1; // temporary spawnchance
                if (spawnchance <= 40) {
                    // temporary spawnchance
                    const spawnModel = authorizedModelId[Math.floor(Math.random() * authorizedModelId.length)];
                    const model_index = textures.findIndex((x) => x.modelName === spawnModel);
                    const texturelist = textures[model_index]?.textures;
                    let randomTexture = "";
                    if (texturelist) {
                        randomTexture =
                            texturelist[Math.floor(Math.random() * texturelist.length)];
                    }
                    createEntity(server, spawnModel, itemInstance.position, itemInstance.rotation, itemInstance.scale, randomTexture, itemInstance.id, npcs);
                }
            });
        }
    });
    debug("All npcs objects created");
}
function createAR15(server) {
    Z1_items.forEach((spawnerType) => {
        const authorizedModelId = [];
        switch (spawnerType.actorDefinition) {
            case "ItemSpawner_Weapon_M16A4.adr":
                authorizedModelId.push(23);
                break;
            case "ItemSpawner_AmmoBox02_M16A4.adr":
                authorizedModelId.push(10);
                break;
            case "ItemSpawner_AmmoBox02.adr":
                authorizedModelId.push(10);
                break;
            default:
                break;
        }
        if (authorizedModelId.length) {
            spawnerType.instances.forEach((itemInstance) => {
                const chance = Math.floor(Math.random() * 100) + 1; // temporary spawnchance
                if (chance <= chanceAR15) {
                    // temporary spawnchance
                    const spawnModel = authorizedModelId[Math.floor(Math.random() * authorizedModelId.length)];
                    const model_index = textures.findIndex((x) => x.modelName === spawnModel);
                    const texturelist = textures[model_index]?.textures;
                    let randomTexture = "";
                    if (texturelist) {
                        randomTexture =
                            texturelist[Math.floor(Math.random() * texturelist.length)];
                    }
                    createEntity(server, spawnModel, itemInstance.position, itemInstance.rotation, itemInstance.scale, randomTexture, itemInstance.id, objects);
                }
            });
        }
    });
    debug("AR15 and ammo items objects created. Spawnrate:" + chanceAR15 + "%");
}
function createPumpShotgun(server) {
    Z1_items.forEach((spawnerType) => {
        const authorizedModelId = [];
        switch (spawnerType.actorDefinition) {
            case "ItemSpawner_Weapon_PumpShotgun01.adr":
                authorizedModelId.push(9286);
                break;
            case "ItemSpawner_AmmoBox02_12GaShotgun.adr":
                authorizedModelId.push(8023);
                break;
            default:
                break;
        }
        if (authorizedModelId.length) {
            spawnerType.instances.forEach((itemInstance) => {
                const chance = Math.floor(Math.random() * 100) + 1; // temporary spawnchance
                if (chance <= chancePumpShotgun) {
                    // temporary spawnchance
                    const spawnModel = authorizedModelId[Math.floor(Math.random() * authorizedModelId.length)];
                    const model_index = textures.findIndex((x) => x.modelName === spawnModel);
                    const texturelist = textures[model_index]?.textures;
                    let randomTexture = "";
                    if (texturelist) {
                        randomTexture =
                            texturelist[Math.floor(Math.random() * texturelist.length)];
                    }
                    createEntity(server, spawnModel, itemInstance.position, itemInstance.rotation, itemInstance.scale, randomTexture, itemInstance.id, objects);
                }
            });
        }
    });
    debug("PumpShotgun and ammo items objects created. Spawnrate:" +
        chancePumpShotgun +
        "%");
}
function createTools(server) {
    Z1_items.forEach((spawnerType) => {
        const authorizedModelId = [];
        switch (spawnerType.actorDefinition) {
            case "ItemSpawner_Weapon_Crowbar01.adr":
                authorizedModelId.push(18);
                break;
            case "ItemSpawner_Weapon_CombatKnife01.adr":
                authorizedModelId.push(21);
                break;
            case "ItemSpawner_Weapon_Machete01.adr":
                authorizedModelId.push(24);
                break;
            case "ItemSpawner_Weapon_Bat01.adr":
                authorizedModelId.push(42);
                break;
            case "ItemSpawner_BackpackOnGround001.adr":
                authorizedModelId.push(9093);
                break;
            case "ItemSpawner_GasCan01.adr":
                authorizedModelId.push(9135);
                break;
            case "ItemSpawner_Weapon_Guitar01.adr":
                authorizedModelId.push(9318);
                break;
            case "ItemSpawner_Weapon_WoodAxe01.adr":
                authorizedModelId.push(27);
                break;
            case "ItemSpawner_Weapon_FireAxe01.adr":
                authorizedModelId.push(9325);
                break;
            case "ItemSpawner_Weapon_ClawHammer01.adr":
                authorizedModelId.push(9252);
                break;
            case "ItemSpawner_Weapon_Hatchet01.adr":
                authorizedModelId.push(22);
                break;
            case "ItemSpawner_Weapon_Pipe01.adr":
                authorizedModelId.push(9209);
                break;
            case "ItemSpawner_Weapon_Bat02.adr":
                authorizedModelId.push(9313);
                break;
            default:
                break;
        }
        if (authorizedModelId.length) {
            spawnerType.instances.forEach((itemInstance) => {
                const chance = Math.floor(Math.random() * 100) + 1; // temporary spawnchance
                if (chance <= chanceTools) {
                    // temporary spawnchance
                    const spawnModel = authorizedModelId[Math.floor(Math.random() * authorizedModelId.length)];
                    const model_index = textures.findIndex((x) => x.modelName === spawnModel);
                    const texturelist = textures[model_index]?.textures;
                    let randomTexture = "";
                    if (texturelist) {
                        randomTexture =
                            texturelist[Math.floor(Math.random() * texturelist.length)];
                    }
                    createEntity(server, spawnModel, itemInstance.position, itemInstance.rotation, itemInstance.scale, randomTexture, itemInstance.id, objects);
                }
            });
        }
    });
    debug("Tools items objects created. Spawnrate:" + chanceTools + "%");
}
function create1911(server) {
    Z1_items.forEach((spawnerType) => {
        const authorizedModelId = [];
        switch (spawnerType.actorDefinition) {
            case "ItemSpawner_Weapon_45Auto.adr":
                authorizedModelId.push(17);
                break;
            case "ItemSpawner_AmmoBox02_1911.adr":
                authorizedModelId.push(10);
                break;
            default:
                break;
        }
        if (authorizedModelId.length) {
            spawnerType.instances.forEach((itemInstance) => {
                const chance = Math.floor(Math.random() * 100) + 1; // temporary spawnchance
                if (chance <= chance1911) {
                    // temporary spawnchance
                    const spawnModel = authorizedModelId[Math.floor(Math.random() * authorizedModelId.length)];
                    const model_index = textures.findIndex((x) => x.modelName === spawnModel);
                    const texturelist = textures[model_index]?.textures;
                    let randomTexture = "";
                    if (texturelist) {
                        randomTexture =
                            texturelist[Math.floor(Math.random() * texturelist.length)];
                    }
                    createEntity(server, spawnModel, itemInstance.position, itemInstance.rotation, itemInstance.scale, randomTexture, itemInstance.id, objects);
                }
            });
        }
    });
    debug("1911 and ammo items objects created. Spawnrate:" + chance1911 + "%");
}
function createM24(server) {
    Z1_items.forEach((spawnerType) => {
        const authorizedModelId = [];
        switch (spawnerType.actorDefinition) {
            case "ItemSpawner_Weapon_M24.adr":
                authorizedModelId.push(9204);
                break;
            case "ItemSpawner_AmmoBox02_308Rifle.adr":
                authorizedModelId.push(9287);
                break;
            default:
                break;
        }
        if (authorizedModelId.length) {
            spawnerType.instances.forEach((itemInstance) => {
                const chance = Math.floor(Math.random() * 100) + 1; // temporary spawnchance
                if (chance <= chanceM24) {
                    // temporary spawnchance
                    const spawnModel = authorizedModelId[Math.floor(Math.random() * authorizedModelId.length)];
                    const model_index = textures.findIndex((x) => x.modelName === spawnModel);
                    const texturelist = textures[model_index]?.textures;
                    let randomTexture = "";
                    if (texturelist) {
                        randomTexture =
                            texturelist[Math.floor(Math.random() * texturelist.length)];
                    }
                    createEntity(server, spawnModel, itemInstance.position, itemInstance.rotation, itemInstance.scale, randomTexture, itemInstance.id, objects);
                }
            });
        }
    });
    debug("SniperRifle and ammo items objects created. Spawnrate:" + chanceM24 + "%");
}
function createConsumables(server) {
    Z1_items.forEach((spawnerType) => {
        const authorizedModelId = [];
        switch (spawnerType.actorDefinition) {
            case "ItemSpawner_FirstAidKit.adr":
                authorizedModelId.push(9221);
                break;
            case "ItemSpawner_CannedFood.adr":
                authorizedModelId.push(7);
                authorizedModelId.push(8020);
                break;
            case "ItemSpawner_WaterContainer_Small_Purified.adr":
                authorizedModelId.push(9159);
                break;
            default:
                break;
        }
        if (authorizedModelId.length) {
            spawnerType.instances.forEach((itemInstance) => {
                const chance = Math.floor(Math.random() * 100) + 1; // temporary spawnchance
                if (chance <= chanceConsumables) {
                    // temporary spawnchance
                    const spawnModel = authorizedModelId[Math.floor(Math.random() * authorizedModelId.length)];
                    const model_index = textures.findIndex((x) => x.modelName === spawnModel);
                    const texturelist = textures[model_index]?.textures;
                    let randomTexture = "";
                    if (texturelist) {
                        randomTexture =
                            texturelist[Math.floor(Math.random() * texturelist.length)];
                    }
                    createEntity(server, spawnModel, itemInstance.position, itemInstance.rotation, itemInstance.scale, randomTexture, itemInstance.id, objects);
                }
            });
        }
    });
    debug("Consumable items objects created. Spawnrate:" + chanceConsumables + "%");
}
function createClothes(server) {
    Z1_items.forEach((spawnerType) => {
        const authorizedModelId = [];
        switch (spawnerType.actorDefinition) {
            case "ItemSpawner_Clothes_MotorcycleHelmet.adr":
                authorizedModelId.push(68);
                break;
            case "ItemSpawner_Clothes_BaseballCap.adr":
                authorizedModelId.push(66);
                break;
            case "ItemSpawner_Clothes_FoldedShirt.adr":
                authorizedModelId.push(9249);
                break;
            case "ItemSpawner_Clothes_Beanie.adr":
                authorizedModelId.push(67);
                break;
            default:
                break;
        }
        if (authorizedModelId.length) {
            spawnerType.instances.forEach((itemInstance) => {
                const chance = Math.floor(Math.random() * 100) + 1; // temporary spawnchance
                if (chance <= chanceClothes) {
                    // temporary spawnchance
                    const spawnModel = authorizedModelId[Math.floor(Math.random() * authorizedModelId.length)];
                    const model_index = textures.findIndex((x) => x.modelName === spawnModel);
                    const texturelist = textures[model_index]?.textures;
                    let randomTexture = "";
                    if (texturelist) {
                        randomTexture =
                            texturelist[Math.floor(Math.random() * texturelist.length)];
                    }
                    createEntity(server, spawnModel, itemInstance.position, itemInstance.rotation, itemInstance.scale, randomTexture, itemInstance.id, objects);
                }
            });
        }
    });
    debug("Clothes items objects created. Spawnrate:" + chanceClothes + "%");
}
function createResidential(server) {
    Z1_items.forEach((spawnerType) => {
        const authorizedModelId = [];
        switch (spawnerType.actorDefinition) {
            case "ItemSpawnerResidential_Tier00.adr":
                authorizedModelId.push(9064);
                authorizedModelId.push(9249);
                authorizedModelId.push(70);
                authorizedModelId.push(21);
                authorizedModelId.push(66);
                authorizedModelId.push(67);
                authorizedModelId.push(68);
                authorizedModelId.push(8020);
                authorizedModelId.push(9065);
                authorizedModelId.push(9039);
                authorizedModelId.push(9182);
                authorizedModelId.push(9156);
                authorizedModelId.push(9159);
                authorizedModelId.push(10);
                authorizedModelId.push(72);
                authorizedModelId.push(9163);
                authorizedModelId.push(9250);
                authorizedModelId.push(9221);
                authorizedModelId.push(9199);
                authorizedModelId.push(9313);
                break;
            default:
                break;
        }
        if (authorizedModelId.length) {
            spawnerType.instances.forEach((itemInstance) => {
                const chance = Math.floor(Math.random() * 100) + 1; // temporary spawnchance
                if (chance <= chanceResidential) {
                    // temporary spawnchance
                    const spawnModel = authorizedModelId[Math.floor(Math.random() * authorizedModelId.length)];
                    const model_index = textures.findIndex((x) => x.modelName === spawnModel);
                    const texturelist = textures[model_index]?.textures;
                    let randomTexture = "";
                    if (texturelist) {
                        randomTexture =
                            texturelist[Math.floor(Math.random() * texturelist.length)];
                    }
                    createEntity(server, spawnModel, itemInstance.position, itemInstance.rotation, itemInstance.scale, randomTexture, itemInstance.id, objects);
                }
            });
        }
    });
    debug("Residential Areas items objects created. Spawnrate:" +
        chanceResidential +
        "%");
}
function createRare(server) {
    Z1_items.forEach((spawnerType) => {
        const authorizedModelId = [];
        switch (spawnerType.actorDefinition) {
            case "ItemSpawnerRare_Tier00.adr":
                authorizedModelId.push(10);
                authorizedModelId.push(9287);
                authorizedModelId.push(8023);
                authorizedModelId.push(17);
                authorizedModelId.push(9204);
                authorizedModelId.push(9286);
                authorizedModelId.push(23);
                break;
            default:
                break;
        }
        if (authorizedModelId.length) {
            spawnerType.instances.forEach((itemInstance) => {
                const chance = Math.floor(Math.random() * 100) + 1; // temporary spawnchance
                if (chance <= chanceRare) {
                    // temporary spawnchance
                    const spawnModel = authorizedModelId[Math.floor(Math.random() * authorizedModelId.length)];
                    const model_index = textures.findIndex((x) => x.modelName === spawnModel);
                    const texturelist = textures[model_index]?.textures;
                    let randomTexture = "";
                    if (texturelist) {
                        randomTexture =
                            texturelist[Math.floor(Math.random() * texturelist.length)];
                    }
                    createEntity(server, spawnModel, itemInstance.position, itemInstance.rotation, itemInstance.scale, randomTexture, itemInstance.id, objects);
                }
            });
        }
    });
    debug("Rare items objects created. Spawnrate:" + chanceRare + "%");
}
function createIndustrial(server) {
    Z1_items.forEach((spawnerType) => {
        const authorizedModelId = [];
        switch (spawnerType.actorDefinition) {
            case "ItemSpawnerIndustrial_Tier00.adr":
                authorizedModelId.push(70);
                authorizedModelId.push(71);
                authorizedModelId.push(72);
                authorizedModelId.push(73);
                authorizedModelId.push(9156);
                authorizedModelId.push(64);
                authorizedModelId.push(11);
                authorizedModelId.push(30);
                authorizedModelId.push(9209);
                authorizedModelId.push(27);
                authorizedModelId.push(54);
                break;
            default:
                break;
        }
        if (authorizedModelId.length) {
            spawnerType.instances.forEach((itemInstance) => {
                const chance = Math.floor(Math.random() * 100) + 1; // temporary spawnchance
                if (chance <= chanceIndustrial) {
                    // temporary spawnchance
                    const spawnModel = authorizedModelId[Math.floor(Math.random() * authorizedModelId.length)];
                    const model_index = textures.findIndex((x) => x.modelName === spawnModel);
                    const texturelist = textures[model_index]?.textures;
                    let randomTexture = "";
                    if (texturelist) {
                        randomTexture =
                            texturelist[Math.floor(Math.random() * texturelist.length)];
                    }
                    createEntity(server, spawnModel, itemInstance.position, itemInstance.rotation, itemInstance.scale, randomTexture, itemInstance.id, objects);
                }
            });
        }
    });
    debug("Industrial Areas items objects created. Spawnrate:" +
        chanceIndustrial +
        "%");
}
function createWorld(server) {
    Z1_items.forEach((spawnerType) => {
        const authorizedModelId = [];
        switch (spawnerType.actorDefinition) {
            case "ItemSpawnerWorld_Tier00.adr":
                authorizedModelId.push(24);
                authorizedModelId.push(9156);
                authorizedModelId.push(9159);
                authorizedModelId.push(9249);
                authorizedModelId.push(9250);
                authorizedModelId.push(22);
                authorizedModelId.push(66);
                authorizedModelId.push(67);
                authorizedModelId.push(68);
                authorizedModelId.push(8020);
                break;
            default:
                break;
        }
        if (authorizedModelId.length) {
            spawnerType.instances.forEach((itemInstance) => {
                const chance = Math.floor(Math.random() * 100) + 1; // temporary spawnchance
                if (chance <= chanceWorld) {
                    // temporary spawnchance
                    const spawnModel = authorizedModelId[Math.floor(Math.random() * authorizedModelId.length)];
                    const model_index = textures.findIndex((x) => x.modelName === spawnModel);
                    const texturelist = textures[model_index]?.textures;
                    let randomTexture = "";
                    if (texturelist) {
                        randomTexture =
                            texturelist[Math.floor(Math.random() * texturelist.length)];
                    }
                    createEntity(server, spawnModel, itemInstance.position, itemInstance.rotation, itemInstance.scale, randomTexture, itemInstance.id, objects);
                }
            });
        }
    });
    debug("World Areas items objects created. Spawnrate:" + chanceWorld + "%");
}
function createLog(server) {
    Z1_items.forEach((spawnerType) => {
        const authorizedModelId = [];
        switch (spawnerType.actorDefinition) {
            case "ItemSpawner_Log01.adr":
                authorizedModelId.push(9043);
                authorizedModelId.push(64);
                authorizedModelId.push(65);
                break;
            default:
                break;
        }
        if (authorizedModelId.length) {
            spawnerType.instances.forEach((itemInstance) => {
                const chance = Math.floor(Math.random() * 100) + 1; // temporary spawnchance
                if (chance <= chanceLog) {
                    // temporary spawnchance
                    const spawnModel = authorizedModelId[Math.floor(Math.random() * authorizedModelId.length)];
                    const model_index = textures.findIndex((x) => x.modelName === spawnModel);
                    const texturelist = textures[model_index]?.textures;
                    let randomTexture = "";
                    if (texturelist) {
                        randomTexture =
                            texturelist[Math.floor(Math.random() * texturelist.length)];
                    }
                    createEntity(server, spawnModel, itemInstance.position, itemInstance.rotation, itemInstance.scale, randomTexture, itemInstance.id, objects);
                }
            });
        }
    });
    debug("Log Areas items objects created. Spawnrate:" + chanceWorld + "%");
}
function createCommercial(server) {
    Z1_items.forEach((spawnerType) => {
        const authorizedModelId = [];
        switch (spawnerType.actorDefinition) {
            case "ItemSpawnerCommercial_Tier00.adr":
                authorizedModelId.push(70);
                authorizedModelId.push(72);
                authorizedModelId.push(9159);
                authorizedModelId.push(9156);
                authorizedModelId.push(68);
                authorizedModelId.push(9064);
                authorizedModelId.push(9065);
                authorizedModelId.push(8020);
                break;
            default:
                break;
        }
        if (authorizedModelId.length) {
            spawnerType.instances.forEach((itemInstance) => {
                const chance = Math.floor(Math.random() * 100) + 1; // temporary spawnchance
                if (chance <= chanceCommercial) {
                    // temporary spawnchance
                    const spawnModel = authorizedModelId[Math.floor(Math.random() * authorizedModelId.length)];
                    const model_index = textures.findIndex((x) => x.modelName === spawnModel);
                    const texturelist = textures[model_index]?.textures;
                    let randomTexture = "";
                    if (texturelist) {
                        randomTexture =
                            texturelist[Math.floor(Math.random() * texturelist.length)];
                    }
                    createEntity(server, spawnModel, itemInstance.position, itemInstance.rotation, itemInstance.scale, randomTexture, itemInstance.id, objects);
                }
            });
        }
    });
    debug("Commercial Areas items objects created. Spawnrate:" +
        chanceCommercial +
        "%");
}
function createFarm(server) {
    Z1_items.forEach((spawnerType) => {
        const authorizedModelId = [];
        switch (spawnerType.actorDefinition) {
            case "ItemSpawnerFarm.adr":
                authorizedModelId.push(15);
                authorizedModelId.push(27);
                authorizedModelId.push(9163);
                authorizedModelId.push(22);
                authorizedModelId.push(9156);
                break;
            default:
                break;
        }
        if (authorizedModelId.length) {
            spawnerType.instances.forEach((itemInstance) => {
                const chance = Math.floor(Math.random() * 100) + 1; // temporary spawnchance
                if (chance <= chanceFarm) {
                    // temporary spawnchance
                    const spawnModel = authorizedModelId[Math.floor(Math.random() * authorizedModelId.length)];
                    const model_index = textures.findIndex((x) => x.modelName === spawnModel);
                    const texturelist = textures[model_index]?.textures;
                    let randomTexture = "";
                    if (texturelist) {
                        randomTexture =
                            texturelist[Math.floor(Math.random() * texturelist.length)];
                    }
                    createEntity(server, spawnModel, itemInstance.position, itemInstance.rotation, itemInstance.scale, randomTexture, itemInstance.id, objects);
                }
            });
        }
    });
    debug("Farm Areas items objects created. Spawnrate:" + chanceFarm + "%");
}
function createProps(server) {
    z1_Props.forEach((propType) => {
        const model_index = textures.findIndex((x) => x.modelName === propType.actorDefinition);
        const texturelist = textures[model_index]?.textures;
        const modelId = utils_1._.find(models, (model) => {
            return model.MODEL_FILE_NAME === propType.actorDefinition;
        })?.ID;
        propType.instances.forEach((propInstance) => {
            let randomTexture = "";
            if (texturelist) {
                randomTexture =
                    texturelist[Math.floor(Math.random() * texturelist.length)];
            }
            createEntity(server, modelId, propInstance.position, propInstance.rotation, propInstance.scale, randomTexture, propInstance.id, props);
        });
    });
    debug("Props objects created");
}
function createAllDoors(server) {
    z1_doors.forEach((doorType) => {
        const modelId = utils_1._.find(models, (model) => {
            return (model.MODEL_FILE_NAME ===
                doorType.actorDefinition.replace("_Placer", ""));
        })?.ID;
        doorType.instances.forEach((doorInstance) => {
            createDoor(server, modelId ? modelId : 9183, doorInstance.position, (0, utils_1.eul2quatLegacy)(doorInstance.rotation), doorInstance.rotation, doorInstance.scale, "", doorInstance.id, doors);
        });
    });
    debug("All doors objects created");
}
//# sourceMappingURL=createBaseEntities.js.map