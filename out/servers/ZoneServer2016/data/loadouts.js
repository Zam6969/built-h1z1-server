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
exports.lootableContainerDefaultLoadouts = exports.vehicleDefaultLoadouts = exports.characterBuildKitLoadout = exports.characterKitLoadout = exports.characterDefaultLoadout = void 0;
const enums_1 = require("../models/enums");
exports.characterDefaultLoadout = [
    { item: enums_1.Items.WEAPON_FISTS },
    { item: enums_1.Items.WEAPON_FLASHLIGHT },
    { item: enums_1.Items.SHIRT_DEFAULT },
    { item: enums_1.Items.WAIST_PACK },
    { item: enums_1.Items.PANTS_DEFAULT },
    { item: enums_1.Items.MAP },
    { item: enums_1.Items.COMPASS },
    { item: enums_1.Items.GAUZE, count: 5 },
];
exports.characterKitLoadout = [
    { item: enums_1.Items.BACKPACK_RASTA },
    { item: enums_1.Items.WEAPON_308 },
    { item: enums_1.Items.WEAPON_SHOTGUN },
    { item: enums_1.Items.WEAPON_AR15 },
    { item: enums_1.Items.FIRST_AID, count: 10 },
    { item: enums_1.Items.BANDAGE_DRESSED, count: 10 },
    { item: enums_1.Items.AMMO_12GA, count: 60 },
    { item: enums_1.Items.AMMO_308, count: 50 },
    { item: enums_1.Items.AMMO_223, count: 120 },
    { item: enums_1.Items.KEVLAR_DEFAULT },
    { item: enums_1.Items.HELMET_MOTORCYCLE },
    { item: enums_1.Items.KEVLAR_DEFAULT },
    { item: enums_1.Items.HELMET_MOTORCYCLE },
    { item: enums_1.Items.CONVEYS_BLUE },
];
exports.characterBuildKitLoadout = [
    { item: enums_1.Items.FOUNDATION, count: 10 },
    { item: enums_1.Items.FOUNDATION_EXPANSION, count: 40 },
    { item: enums_1.Items.SHELTER, count: 40 },
    { item: enums_1.Items.SHELTER_LARGE, count: 40 },
    { item: enums_1.Items.SHELTER_UPPER, count: 40 },
    { item: enums_1.Items.SHELTER_UPPER_LARGE, count: 40 },
    { item: enums_1.Items.DOOR_METAL, count: 40 },
    { item: enums_1.Items.DOOR_WOOD, count: 40 },
    { item: enums_1.Items.DOOR_BASIC, count: 10 },
    { item: enums_1.Items.SHACK, count: 10 },
    { item: enums_1.Items.SHACK_SMALL, count: 10 },
    { item: enums_1.Items.SHACK_BASIC, count: 10 },
    { item: enums_1.Items.STRUCTURE_STAIRS, count: 40 },
    { item: enums_1.Items.STRUCTURE_STAIRS_UPPER, count: 40 },
    { item: enums_1.Items.FOUNDATION_RAMP, count: 40 },
    { item: enums_1.Items.FOUNDATION_STAIRS, count: 40 },
    { item: enums_1.Items.FURNACE, count: 40 },
    { item: enums_1.Items.STORAGE_BOX, count: 40 },
    { item: enums_1.Items.LOOKOUT_TOWER, count: 40 },
    { item: enums_1.Items.METAL_GATE, count: 40 },
    { item: enums_1.Items.METAL_WALL, count: 40 },
    { item: enums_1.Items.METAL_WALL_UPPER, count: 40 },
    { item: enums_1.Items.METAL_DOORWAY, count: 40 },
    { item: enums_1.Items.GROUND_TAMPER, count: 10 },
    { item: enums_1.Items.WEAPON_HAMMER_DEMOLITION },
];
exports.vehicleDefaultLoadouts = {
    offroader: [
        { item: enums_1.Items.CONTAINER_VEHICLE_OFFROADER },
        { item: enums_1.Items.VEHICLE_MOTOR_OFFROADER },
        { item: enums_1.Items.VEHICLE_HOTWIRE },
        { item: enums_1.Items.VEHICLE_HORN },
    ],
    policecar: [
        { item: enums_1.Items.CONTAINER_VEHICLE_POLICECAR },
        { item: enums_1.Items.VEHICLE_MOTOR_POLICECAR },
        { item: enums_1.Items.VEHICLE_HOTWIRE },
        { item: enums_1.Items.VEHICLE_HORN_POLICECAR },
        { item: enums_1.Items.VEHICLE_SIREN_POLICECAR },
    ],
    atv: [
        { item: enums_1.Items.CONTAINER_VEHICLE_ATV },
        { item: enums_1.Items.VEHICLE_MOTOR_ATV },
        { item: enums_1.Items.VEHICLE_HOTWIRE },
        { item: enums_1.Items.VEHICLE_HORN },
    ],
    pickup: [
        { item: enums_1.Items.CONTAINER_VEHICLE_PICKUP },
        { item: enums_1.Items.VEHICLE_MOTOR_PICKUP },
        { item: enums_1.Items.VEHICLE_HOTWIRE },
        { item: enums_1.Items.VEHICLE_HORN },
    ],
};
exports.lootableContainerDefaultLoadouts = {
    storage: [{ item: enums_1.Items.CONTAINER_STORAGE }],
    furnace: [{ item: enums_1.Items.CONTAINER_FURNACE }],
    barbeque: [{ item: enums_1.Items.CONTAINER_BARBEQUE }],
    campfire: [{ item: enums_1.Items.CONTAINER_CAMPFIRE }],
    lootbag: [{ item: enums_1.Items.CONTAINER_DROPPED_ITEMS }],
    dew_collector: [{ item: enums_1.Items.CONTAINER_DEW_COLLECTOR }],
    animal_trap: [{ item: enums_1.Items.CONTAINER_ANIMAL_TRAP }],
};
//# sourceMappingURL=loadouts.js.map