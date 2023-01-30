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
exports.recipes = exports.smeltingData = void 0;
const enums_1 = require("../models/enums");
exports.smeltingData = {
    1: {
        filterId: enums_1.FilterIds.COOKING,
        rewardId: enums_1.Items.BLACKBERRY_PIE,
        components: [
            {
                itemDefinitionId: enums_1.Items.SUGAR,
                requiredAmount: 1,
            },
            {
                itemDefinitionId: enums_1.Items.BLACKBERRY,
                requiredAmount: 8,
            },
            {
                itemDefinitionId: enums_1.Items.FLOUR,
                requiredAmount: 1,
            },
        ],
    },
    2: {
        filterId: enums_1.FilterIds.COOKING,
        rewardId: enums_1.Items.COFFEE,
        components: [
            {
                itemDefinitionId: enums_1.Items.GROUND_COFFEE,
                requiredAmount: 1,
            },
            {
                itemDefinitionId: enums_1.Items.WATER_PURE,
                requiredAmount: 1,
            },
        ],
    },
    3: {
        filterId: enums_1.FilterIds.COOKING,
        rewardId: enums_1.Items.STEAK_RABBIT,
        components: [
            {
                itemDefinitionId: enums_1.Items.MEAT_RABBIT,
                requiredAmount: 1,
            },
        ],
    },
    4: {
        filterId: enums_1.FilterIds.COOKING,
        rewardId: enums_1.Items.JERKY_DEER,
        components: [
            {
                itemDefinitionId: enums_1.Items.MEAT_VENISON,
                requiredAmount: 1,
            },
            {
                itemDefinitionId: enums_1.Items.SALT,
                requiredAmount: 1,
            },
        ],
    },
    5: {
        filterId: enums_1.FilterIds.COOKING,
        rewardId: enums_1.Items.STEAK_DEER,
        components: [
            {
                itemDefinitionId: enums_1.Items.MEAT_VENISON,
                requiredAmount: 1,
            },
        ],
    },
    6: {
        filterId: enums_1.FilterIds.COOKING,
        rewardId: enums_1.Items.WATER_PURE,
        components: [
            {
                itemDefinitionId: enums_1.Items.WATER_STAGNANT,
                requiredAmount: 1,
            },
        ],
    },
    7: {
        filterId: enums_1.FilterIds.COOKING,
        rewardId: enums_1.Items.WATER_PURE,
        components: [
            {
                itemDefinitionId: enums_1.Items.WATER_DIRTY,
                requiredAmount: 1,
            },
        ],
    },
    8: {
        filterId: enums_1.FilterIds.COOKING,
        rewardId: enums_1.Items.STEW_RABBIT,
        components: [
            {
                itemDefinitionId: enums_1.Items.SALT,
                requiredAmount: 1,
            },
            {
                itemDefinitionId: enums_1.Items.STEAK_RABBIT,
                requiredAmount: 1,
            },
            {
                itemDefinitionId: enums_1.Items.WATER_PURE,
                requiredAmount: 1,
            },
        ],
    },
    9: {
        filterId: enums_1.FilterIds.COOKING,
        rewardId: enums_1.Items.CORN_ROASTED,
        components: [
            {
                itemDefinitionId: enums_1.Items.CORN,
                requiredAmount: 1,
            },
        ],
    },
    10: {
        filterId: enums_1.FilterIds.COOKING,
        rewardId: enums_1.Items.SURVIVAL_BORSCHT,
        components: [
            {
                itemDefinitionId: enums_1.Items.CANNED_FOOD01,
                requiredAmount: 1,
            },
            {
                itemDefinitionId: enums_1.Items.SALT,
                requiredAmount: 1,
            },
            {
                itemDefinitionId: enums_1.Items.WATER_PURE,
                requiredAmount: 1,
            },
        ],
    },
    11: {
        filterId: enums_1.FilterIds.COOKING,
        rewardId: enums_1.Items.SURVIVAL_BREAD,
        components: [
            {
                itemDefinitionId: enums_1.Items.WATER_PURE,
                requiredAmount: 1,
            },
            {
                itemDefinitionId: enums_1.Items.YEAST,
                requiredAmount: 1,
            },
            {
                itemDefinitionId: enums_1.Items.FLOUR,
                requiredAmount: 1,
            },
        ],
    },
    12: {
        filterId: enums_1.FilterIds.COOKING,
        rewardId: enums_1.Items.SWIZZLE,
        components: [
            {
                itemDefinitionId: enums_1.Items.SUGAR,
                requiredAmount: 1,
            },
            {
                itemDefinitionId: enums_1.Items.WATER_PURE,
                requiredAmount: 1,
            },
            {
                itemDefinitionId: enums_1.Items.COLD_MEDICINE,
                requiredAmount: 1,
            },
        ],
    },
    13: {
        filterId: enums_1.FilterIds.COOKING,
        rewardId: enums_1.Items.STEAK_WOLF,
        components: [
            {
                itemDefinitionId: enums_1.Items.MEAT_WOLF,
                requiredAmount: 1,
            },
        ],
    },
    14: {
        filterId: enums_1.FilterIds.FURNACE,
        rewardId: enums_1.Items.METAL_BAR,
        components: [
            {
                itemDefinitionId: enums_1.Items.NAIL,
                requiredAmount: 4,
            },
        ],
    },
    15: {
        filterId: enums_1.FilterIds.FURNACE,
        rewardId: enums_1.Items.METAL_BAR,
        components: [
            {
                itemDefinitionId: enums_1.Items.METAL_SCRAP,
                requiredAmount: 1,
            },
        ],
    },
    16: {
        filterId: enums_1.FilterIds.FURNACE,
        rewardId: enums_1.Items.METAL_BAR,
        components: [
            {
                itemDefinitionId: enums_1.Items.BROKEN_METAL_ITEM,
                requiredAmount: 1,
            },
        ],
    },
    17: {
        filterId: enums_1.FilterIds.FURNACE,
        rewardId: enums_1.Items.METAL_BAR,
        components: [
            {
                itemDefinitionId: enums_1.Items.WEAPON_1911,
                requiredAmount: 1,
            },
        ],
    },
    18: {
        filterId: enums_1.FilterIds.FURNACE,
        rewardId: enums_1.Items.METAL_BAR,
        components: [
            {
                itemDefinitionId: enums_1.Items.WEAPON_308,
                requiredAmount: 1,
            },
        ],
    },
    19: {
        filterId: enums_1.FilterIds.FURNACE,
        rewardId: enums_1.Items.METAL_BAR,
        components: [
            {
                itemDefinitionId: enums_1.Items.WEAPON_AK47,
                requiredAmount: 1,
            },
        ],
    },
    20: {
        filterId: enums_1.FilterIds.FURNACE,
        rewardId: enums_1.Items.METAL_BAR,
        components: [
            {
                itemDefinitionId: enums_1.Items.WEAPON_AK47_MODIFIED,
                requiredAmount: 1,
            },
        ],
    },
    21: {
        filterId: enums_1.FilterIds.FURNACE,
        rewardId: enums_1.Items.METAL_BAR,
        components: [
            {
                itemDefinitionId: enums_1.Items.WEAPON_AR15,
                requiredAmount: 1,
            },
        ],
    },
    22: {
        filterId: enums_1.FilterIds.FURNACE,
        rewardId: enums_1.Items.METAL_BAR,
        components: [
            {
                itemDefinitionId: enums_1.Items.WEAPON_AXE_FIRE,
                requiredAmount: 1,
            },
        ],
    },
    23: {
        filterId: enums_1.FilterIds.FURNACE,
        rewardId: enums_1.Items.METAL_BAR,
        components: [
            {
                itemDefinitionId: enums_1.Items.WEAPON_AXE_WOOD,
                requiredAmount: 1,
            },
        ],
    },
    24: {
        filterId: enums_1.FilterIds.FURNACE,
        rewardId: enums_1.Items.METAL_BAR,
        components: [
            {
                itemDefinitionId: enums_1.Items.WEAPON_BAT_ALUM,
                requiredAmount: 1,
            },
        ],
    },
    25: {
        filterId: enums_1.FilterIds.FURNACE,
        rewardId: enums_1.Items.METAL_BAR,
        components: [
            {
                itemDefinitionId: enums_1.Items.WEAPON_BLAZE,
                requiredAmount: 1,
            },
        ],
    },
    26: {
        filterId: enums_1.FilterIds.FURNACE,
        rewardId: enums_1.Items.METAL_BAR,
        components: [
            {
                itemDefinitionId: enums_1.Items.WEAPON_COMBATKNIFE,
                requiredAmount: 1,
            },
        ],
    },
    27: {
        filterId: enums_1.FilterIds.FURNACE,
        rewardId: enums_1.Items.METAL_BAR,
        components: [
            {
                itemDefinitionId: enums_1.Items.WEAPON_CROWBAR,
                requiredAmount: 1,
            },
        ],
    },
    28: {
        filterId: enums_1.FilterIds.FURNACE,
        rewardId: enums_1.Items.METAL_BAR,
        components: [
            {
                itemDefinitionId: enums_1.Items.WEAPON_FROSTBITE,
                requiredAmount: 1,
            },
        ],
    },
    29: {
        filterId: enums_1.FilterIds.FURNACE,
        rewardId: enums_1.Items.METAL_BAR,
        components: [
            {
                itemDefinitionId: enums_1.Items.WEAPON_HAMMER,
                requiredAmount: 1,
            },
        ],
    },
    30: {
        filterId: enums_1.FilterIds.FURNACE,
        rewardId: enums_1.Items.METAL_BAR,
        components: [
            {
                itemDefinitionId: enums_1.Items.WEAPON_HAMMER_DEMOLITION,
                requiredAmount: 1,
            },
        ],
    },
    31: {
        filterId: enums_1.FilterIds.FURNACE,
        rewardId: enums_1.Items.METAL_BAR,
        components: [
            {
                itemDefinitionId: enums_1.Items.WEAPON_HATCHET,
                requiredAmount: 1,
            },
        ],
    },
    32: {
        filterId: enums_1.FilterIds.FURNACE,
        rewardId: enums_1.Items.METAL_BAR,
        components: [
            {
                itemDefinitionId: enums_1.Items.WEAPON_HATCHET_MAKESHIFT,
                requiredAmount: 1,
            },
        ],
    },
    33: {
        filterId: enums_1.FilterIds.FURNACE,
        rewardId: enums_1.Items.METAL_BAR,
        components: [
            {
                itemDefinitionId: enums_1.Items.WEAPON_KATANA,
                requiredAmount: 1,
            },
        ],
    },
    34: {
        filterId: enums_1.FilterIds.FURNACE,
        rewardId: enums_1.Items.METAL_BAR,
        components: [
            {
                itemDefinitionId: enums_1.Items.WEAPON_M9,
                requiredAmount: 1,
            },
        ],
    },
    35: {
        filterId: enums_1.FilterIds.FURNACE,
        rewardId: enums_1.Items.METAL_BAR,
        components: [
            {
                itemDefinitionId: enums_1.Items.WEAPON_MACHETE01,
                requiredAmount: 1,
            },
        ],
    },
    36: {
        filterId: enums_1.FilterIds.FURNACE,
        rewardId: enums_1.Items.METAL_BAR,
        components: [
            {
                itemDefinitionId: enums_1.Items.WEAPON_MAGNUM,
                requiredAmount: 1,
            },
        ],
    },
    37: {
        filterId: enums_1.FilterIds.FURNACE,
        rewardId: enums_1.Items.METAL_BAR,
        components: [
            {
                itemDefinitionId: enums_1.Items.WEAPON_PIPE,
                requiredAmount: 1,
            },
        ],
    },
    38: {
        filterId: enums_1.FilterIds.FURNACE,
        rewardId: enums_1.Items.METAL_BAR,
        components: [
            {
                itemDefinitionId: enums_1.Items.WEAPON_REAPER,
                requiredAmount: 1,
            },
        ],
    },
    39: {
        filterId: enums_1.FilterIds.FURNACE,
        rewardId: enums_1.Items.METAL_BAR,
        components: [
            {
                itemDefinitionId: enums_1.Items.WEAPON_SHOTGUN,
                requiredAmount: 1,
            },
        ],
    },
    40: {
        filterId: enums_1.FilterIds.FURNACE,
        rewardId: enums_1.Items.METAL_BAR,
        components: [
            {
                itemDefinitionId: enums_1.Items.WEAPON_WRENCH,
                requiredAmount: 1,
            },
        ],
    },
    41: {
        filterId: enums_1.FilterIds.FURNACE,
        rewardId: enums_1.Items.METAL_BAR,
        components: [
            {
                itemDefinitionId: enums_1.Items.METAL_PIPE,
                requiredAmount: 1,
            },
        ],
    },
};
exports.recipes = {
    [enums_1.Items.AMMO_223]: {
        filterId: enums_1.FilterIds.WEAPONS,
        components: [
            {
                itemDefinitionId: enums_1.Items.SHARD_METAL,
                requiredAmount: 1,
            },
            {
                itemDefinitionId: enums_1.Items.ALLOY_LEAD,
                requiredAmount: 2,
            },
            {
                itemDefinitionId: enums_1.Items.SHARD_BRASS,
                requiredAmount: 3,
            },
            {
                itemDefinitionId: enums_1.Items.GUNPOWDER_REFINED,
                requiredAmount: 2,
            },
        ],
    },
    [enums_1.Items.AMMO_308]: {
        filterId: enums_1.FilterIds.WEAPONS,
        components: [
            {
                itemDefinitionId: enums_1.Items.SHARD_METAL,
                requiredAmount: 1,
            },
            {
                itemDefinitionId: enums_1.Items.ALLOY_LEAD,
                requiredAmount: 2,
            },
            {
                itemDefinitionId: enums_1.Items.SHARD_BRASS,
                requiredAmount: 3,
            },
            {
                itemDefinitionId: enums_1.Items.GUNPOWDER_REFINED,
                requiredAmount: 4,
            },
        ],
    },
    [enums_1.Items.AMMO_380]: {
        filterId: enums_1.FilterIds.WEAPONS,
        components: [
            {
                itemDefinitionId: enums_1.Items.ALLOY_LEAD,
                requiredAmount: 1,
            },
            {
                itemDefinitionId: enums_1.Items.SHARD_BRASS,
                requiredAmount: 1,
            },
            {
                itemDefinitionId: enums_1.Items.GUNPOWDER_REFINED,
                requiredAmount: 1,
            },
        ],
    },
    [enums_1.Items.AMMO_44]: {
        filterId: enums_1.FilterIds.WEAPONS,
        components: [
            {
                itemDefinitionId: enums_1.Items.SHARD_METAL,
                requiredAmount: 1,
            },
            {
                itemDefinitionId: enums_1.Items.ALLOY_LEAD,
                requiredAmount: 2,
            },
            {
                itemDefinitionId: enums_1.Items.SHARD_BRASS,
                requiredAmount: 1,
            },
            {
                itemDefinitionId: enums_1.Items.GUNPOWDER_REFINED,
                requiredAmount: 2,
            },
        ],
    },
    [enums_1.Items.AMMO_45]: {
        filterId: enums_1.FilterIds.WEAPONS,
        components: [
            {
                itemDefinitionId: enums_1.Items.ALLOY_LEAD,
                requiredAmount: 1,
            },
            {
                itemDefinitionId: enums_1.Items.SHARD_BRASS,
                requiredAmount: 2,
            },
            {
                itemDefinitionId: enums_1.Items.GUNPOWDER_REFINED,
                requiredAmount: 2,
            },
        ],
    },
    [enums_1.Items.AMMO_12GA]: {
        filterId: enums_1.FilterIds.WEAPONS,
        components: [
            {
                itemDefinitionId: enums_1.Items.SHARD_PLASTIC,
                requiredAmount: 2,
            },
            {
                itemDefinitionId: enums_1.Items.ALLOY_LEAD,
                requiredAmount: 2,
            },
            {
                itemDefinitionId: enums_1.Items.SHARD_BRASS,
                requiredAmount: 2,
            },
            {
                itemDefinitionId: enums_1.Items.GUNPOWDER_REFINED,
                requiredAmount: 4,
            },
        ],
    },
    [enums_1.Items.AMMO_762]: {
        filterId: enums_1.FilterIds.WEAPONS,
        components: [
            {
                itemDefinitionId: enums_1.Items.SHARD_METAL,
                requiredAmount: 1,
            },
            {
                itemDefinitionId: enums_1.Items.ALLOY_LEAD,
                requiredAmount: 3,
            },
            {
                itemDefinitionId: enums_1.Items.SHARD_BRASS,
                requiredAmount: 2,
            },
            {
                itemDefinitionId: enums_1.Items.GUNPOWDER_REFINED,
                requiredAmount: 2,
            },
        ],
    },
    [enums_1.Items.AMMO_9MM]: {
        filterId: enums_1.FilterIds.WEAPONS,
        components: [
            {
                itemDefinitionId: enums_1.Items.ALLOY_LEAD,
                requiredAmount: 2,
            },
            {
                itemDefinitionId: enums_1.Items.SHARD_BRASS,
                requiredAmount: 1,
            },
            {
                itemDefinitionId: enums_1.Items.GUNPOWDER_REFINED,
                requiredAmount: 1,
            },
        ],
    },
    [enums_1.Items.WEAPON_BLAZE]: {
        filterId: enums_1.FilterIds.WEAPONS,
        components: [
            {
                itemDefinitionId: enums_1.Items.WEAPON_AR15,
                requiredAmount: 1,
            },
            {
                itemDefinitionId: enums_1.Items.PROTOTYPE_MECHANISM,
                requiredAmount: 1,
            },
            {
                itemDefinitionId: enums_1.Items.PROTOTYPE_TRIGGER_ASSEMBLY,
                requiredAmount: 1,
            },
            {
                itemDefinitionId: enums_1.Items.PROTOTYPE_RECEIVER,
                requiredAmount: 1,
            },
        ],
    },
    [enums_1.Items.WEAPON_FROSTBITE]: {
        filterId: enums_1.FilterIds.WEAPONS,
        components: [
            {
                itemDefinitionId: enums_1.Items.WEAPON_AK47,
                requiredAmount: 1,
            },
            {
                itemDefinitionId: enums_1.Items.PROTOTYPE_MECHANISM,
                requiredAmount: 1,
            },
            {
                itemDefinitionId: enums_1.Items.PROTOTYPE_TRIGGER_ASSEMBLY,
                requiredAmount: 1,
            },
            {
                itemDefinitionId: enums_1.Items.PROTOTYPE_RECEIVER,
                requiredAmount: 1,
            },
        ],
    },
    [enums_1.Items.WEAPON_NAGAFENS_RAGE]: {
        filterId: enums_1.FilterIds.WEAPONS,
        components: [
            {
                itemDefinitionId: enums_1.Items.WEAPON_SHOTGUN,
                requiredAmount: 1,
            },
            {
                itemDefinitionId: enums_1.Items.PROTOTYPE_MECHANISM,
                requiredAmount: 1,
            },
            {
                itemDefinitionId: enums_1.Items.PROTOTYPE_TRIGGER_ASSEMBLY,
                requiredAmount: 1,
            },
            {
                itemDefinitionId: enums_1.Items.PROTOTYPE_RECEIVER,
                requiredAmount: 1,
            },
        ],
    },
    [enums_1.Items.WEAPON_PURGE]: {
        filterId: enums_1.FilterIds.WEAPONS,
        components: [
            {
                itemDefinitionId: enums_1.Items.WEAPON_M9,
                requiredAmount: 1,
            },
            {
                itemDefinitionId: enums_1.Items.PROTOTYPE_MECHANISM,
                requiredAmount: 1,
            },
            {
                itemDefinitionId: enums_1.Items.PROTOTYPE_TRIGGER_ASSEMBLY,
                requiredAmount: 1,
            },
            {
                itemDefinitionId: enums_1.Items.PROTOTYPE_RECEIVER,
                requiredAmount: 1,
            },
        ],
    },
    [enums_1.Items.WEAPON_REAPER]: {
        filterId: enums_1.FilterIds.WEAPONS,
        components: [
            {
                itemDefinitionId: enums_1.Items.WEAPON_308,
                requiredAmount: 1,
            },
            {
                itemDefinitionId: enums_1.Items.PROTOTYPE_MECHANISM,
                requiredAmount: 1,
            },
            {
                itemDefinitionId: enums_1.Items.PROTOTYPE_TRIGGER_ASSEMBLY,
                requiredAmount: 1,
            },
            {
                itemDefinitionId: enums_1.Items.PROTOTYPE_RECEIVER,
                requiredAmount: 1,
            },
        ],
    },
    [enums_1.Items.AIRDROP_CODE]: {
        filterId: enums_1.FilterIds.SURVIVAL,
        components: [
            {
                itemDefinitionId: enums_1.Items.CODED_MESSAGE,
                requiredAmount: 4,
            },
        ],
    },
    [enums_1.Items.ANIMAL_TRAP]: {
        filterId: enums_1.FilterIds.SURVIVAL,
        components: [
            {
                itemDefinitionId: enums_1.Items.WOOD_PLANK,
                requiredAmount: 4,
            },
            {
                itemDefinitionId: enums_1.Items.WOOD_STICK,
                requiredAmount: 1,
            },
            {
                itemDefinitionId: enums_1.Items.NAIL,
                requiredAmount: 4,
            },
        ],
    },
    [enums_1.Items.BACKPACK_FRAME]: {
        filterId: enums_1.FilterIds.COMPONENT,
        components: [
            {
                itemDefinitionId: enums_1.Items.METAL_BRACKET,
                requiredAmount: 3,
            },
            {
                itemDefinitionId: enums_1.Items.WOOD_STICK,
                requiredAmount: 3,
            },
            {
                itemDefinitionId: enums_1.Items.NAIL,
                requiredAmount: 3,
            },
        ],
    },
    [enums_1.Items.BANDAGE]: {
        filterId: enums_1.FilterIds.SURVIVAL,
        components: [
            {
                itemDefinitionId: enums_1.Items.CLOTH,
                requiredAmount: 2,
            },
        ],
    },
    [enums_1.Items.BARBED_WIRE]: {
        filterId: enums_1.FilterIds.SURVIVAL,
        components: [
            {
                itemDefinitionId: enums_1.Items.WOOD_PLANK,
                requiredAmount: 4,
            },
            {
                itemDefinitionId: enums_1.Items.SHARD_METAL,
                requiredAmount: 16,
            },
        ],
    },
    [enums_1.Items.BARBEQUE]: {
        filterId: enums_1.FilterIds.HOUSING,
        components: [
            {
                itemDefinitionId: enums_1.Items.METAL_PIPE,
                requiredAmount: 3,
            },
            {
                itemDefinitionId: enums_1.Items.METAL_SCRAP,
                requiredAmount: 8,
            },
        ],
    },
    [enums_1.Items.BANDANA_BASIC]: {
        filterId: enums_1.FilterIds.SURVIVAL,
        components: [
            {
                itemDefinitionId: enums_1.Items.CLOTH,
                requiredAmount: 2,
            },
        ],
    },
    [enums_1.Items.SHACK_BASIC]: {
        filterId: enums_1.FilterIds.HOUSING,
        components: [
            {
                itemDefinitionId: enums_1.Items.WOOD_PLANK,
                requiredAmount: 20,
            },
            {
                itemDefinitionId: enums_1.Items.WOOD_STICK,
                requiredAmount: 10,
            },
        ],
    },
    [enums_1.Items.DOOR_BASIC]: {
        filterId: enums_1.FilterIds.HOUSING,
        components: [
            {
                itemDefinitionId: enums_1.Items.WOOD_PLANK,
                requiredAmount: 3,
            },
            {
                itemDefinitionId: enums_1.Items.WOOD_STICK,
                requiredAmount: 5,
            },
        ],
    },
    [enums_1.Items.SANDWICH_BEAR]: {
        filterId: enums_1.FilterIds.SURVIVAL,
        components: [
            {
                itemDefinitionId: enums_1.Items.STEAK_BEAR,
                requiredAmount: 1,
            },
            {
                itemDefinitionId: enums_1.Items.SURVIVAL_BREAD,
                requiredAmount: 2,
            },
        ],
    },
    [enums_1.Items.STEAK_BEAR]: {
        filterId: enums_1.FilterIds.SURVIVAL,
        components: [
            {
                itemDefinitionId: enums_1.Items.MEAT_BEAR,
                requiredAmount: 1,
            },
        ],
    },
    [enums_1.Items.BEE_BOX]: {
        filterId: enums_1.FilterIds.HOUSING,
        components: [
            {
                itemDefinitionId: enums_1.Items.WOOD_PLANK,
                requiredAmount: 4,
            },
            {
                itemDefinitionId: enums_1.Items.NAIL,
                requiredAmount: 4,
            },
            {
                itemDefinitionId: enums_1.Items.METAL_BRACKET,
                requiredAmount: 4,
            },
            {
                itemDefinitionId: enums_1.Items.TARP,
                requiredAmount: 1,
            },
        ],
    },
    [enums_1.Items.FUEL_BIOFUEL]: {
        filterId: enums_1.FilterIds.WEAPONS,
        components: [
            {
                itemDefinitionId: enums_1.Items.ANIMAL_FAT,
                requiredAmount: 1,
            },
            {
                itemDefinitionId: enums_1.Items.WATER_EMPTY,
                requiredAmount: 1,
            },
        ],
    },
    [enums_1.Items.BLACKBERRY_JUICE]: {
        filterId: enums_1.FilterIds.SURVIVAL,
        components: [
            {
                itemDefinitionId: enums_1.Items.BLACKBERRY,
                requiredAmount: 1,
            },
            {
                itemDefinitionId: enums_1.Items.WATER_EMPTY,
                requiredAmount: 1,
            },
        ],
    },
    [enums_1.Items.BLACKBERRY_PIE]: {
        filterId: enums_1.FilterIds.COOKING,
        components: [
            {
                itemDefinitionId: enums_1.Items.SUGAR,
                requiredAmount: 1,
            },
            {
                itemDefinitionId: enums_1.Items.BLACKBERRY,
                requiredAmount: 8,
            },
            {
                itemDefinitionId: enums_1.Items.FLOUR,
                requiredAmount: 1,
            },
        ],
    },
    [enums_1.Items.BOW_DRILL]: {
        filterId: enums_1.FilterIds.SURVIVAL,
        components: [
            {
                itemDefinitionId: enums_1.Items.CLOTH,
                requiredAmount: 1,
            },
            {
                itemDefinitionId: enums_1.Items.WOOD_PLANK,
                requiredAmount: 1,
            },
            {
                itemDefinitionId: enums_1.Items.WOOD_STICK,
                requiredAmount: 1,
            },
        ],
    },
    [enums_1.Items.CAMPFIRE]: {
        filterId: enums_1.FilterIds.SURVIVAL,
        components: [
            {
                itemDefinitionId: enums_1.Items.WOOD_LOG,
                requiredAmount: 2,
            },
        ],
    },
    [enums_1.Items.CANDLE]: {
        filterId: enums_1.FilterIds.HOUSING,
        components: [
            {
                itemDefinitionId: enums_1.Items.CLOTH,
                requiredAmount: 1,
            },
            {
                itemDefinitionId: enums_1.Items.WAX,
                requiredAmount: 2,
            },
        ],
    },
    [enums_1.Items.PHONE_CHARGED]: {
        filterId: enums_1.FilterIds.SURVIVAL,
        components: [
            {
                itemDefinitionId: enums_1.Items.PHONE_DEAD,
                requiredAmount: 1,
            },
            {
                itemDefinitionId: enums_1.Items.PHONE_BATTERY,
                requiredAmount: 3,
            },
        ],
    },
    [enums_1.Items.COFFEE]: {
        filterId: enums_1.FilterIds.COOKING,
        components: [
            {
                itemDefinitionId: enums_1.Items.GROUND_COFFEE,
                requiredAmount: 1,
            },
            {
                itemDefinitionId: enums_1.Items.WATER_PURE,
                requiredAmount: 1,
            },
        ],
    },
    [enums_1.Items.COFFEE_SUGAR]: {
        filterId: enums_1.FilterIds.SURVIVAL,
        components: [
            {
                itemDefinitionId: enums_1.Items.COFFEE,
                requiredAmount: 1,
            },
            {
                itemDefinitionId: enums_1.Items.SUGAR,
                requiredAmount: 1,
            },
        ],
    },
    [enums_1.Items.WEAPON_COMBATKNIFE]: {
        filterId: enums_1.FilterIds.WEAPONS,
        components: [
            {
                itemDefinitionId: enums_1.Items.METAL_SHEET,
                requiredAmount: 1,
            },
            {
                itemDefinitionId: enums_1.Items.WOOD_STICK,
                requiredAmount: 1,
            },
        ],
        requireWorkbench: true,
    },
    [enums_1.Items.STEAK_RABBIT]: {
        filterId: enums_1.FilterIds.COOKING,
        components: [
            {
                itemDefinitionId: enums_1.Items.MEAT_RABBIT,
                requiredAmount: 1,
            },
        ],
    },
    [enums_1.Items.CORN_MASH]: {
        filterId: enums_1.FilterIds.SURVIVAL,
        components: [
            {
                itemDefinitionId: enums_1.Items.CORN,
                requiredAmount: 1,
            },
            {
                itemDefinitionId: enums_1.Items.WATER_PURE,
                requiredAmount: 1,
            },
            {
                itemDefinitionId: enums_1.Items.YEAST,
                requiredAmount: 1,
            },
        ],
    },
    [enums_1.Items.FOUNDATION]: {
        filterId: enums_1.FilterIds.SURVIVAL,
        components: [
            {
                itemDefinitionId: enums_1.Items.WOOD_LOG,
                requiredAmount: 4,
            },
            {
                itemDefinitionId: enums_1.Items.WOOD_PLANK,
                requiredAmount: 16,
            },
            {
                itemDefinitionId: enums_1.Items.NAIL,
                requiredAmount: 20,
            },
            {
                itemDefinitionId: enums_1.Items.METAL_BRACKET,
                requiredAmount: 8,
            },
        ],
    },
    [enums_1.Items.JERKY_DEER]: {
        filterId: enums_1.FilterIds.COOKING,
        components: [
            {
                itemDefinitionId: enums_1.Items.MEAT_VENISON,
                requiredAmount: 1,
            },
            {
                itemDefinitionId: enums_1.Items.SALT,
                requiredAmount: 1,
            },
        ],
    },
    [enums_1.Items.SANDWICH_DEER]: {
        filterId: enums_1.FilterIds.SURVIVAL,
        components: [
            {
                itemDefinitionId: enums_1.Items.STEAK_DEER,
                requiredAmount: 1,
            },
            {
                itemDefinitionId: enums_1.Items.SURVIVAL_BREAD,
                requiredAmount: 1,
            },
        ],
    },
    [enums_1.Items.DEER_SCENT]: {
        filterId: enums_1.FilterIds.SURVIVAL,
        components: [
            {
                itemDefinitionId: enums_1.Items.CLOTH,
                requiredAmount: 1,
            },
            {
                itemDefinitionId: enums_1.Items.DEER_BLADDER,
                requiredAmount: 1,
            },
        ],
    },
    [enums_1.Items.STEAK_DEER]: {
        filterId: enums_1.FilterIds.COOKING,
        components: [
            {
                itemDefinitionId: enums_1.Items.MEAT_VENISON,
                requiredAmount: 1,
            },
        ],
    },
    [enums_1.Items.WEAPON_HAMMER_DEMOLITION]: {
        filterId: enums_1.FilterIds.WEAPONS,
        components: [
            {
                itemDefinitionId: enums_1.Items.METAL_PIPE,
                requiredAmount: 1,
            },
        ],
    },
    [enums_1.Items.DEW_COLLECTOR]: {
        filterId: enums_1.FilterIds.HOUSING,
        components: [
            {
                itemDefinitionId: enums_1.Items.WOOD_PLANK,
                requiredAmount: 4,
            },
            {
                itemDefinitionId: enums_1.Items.WOOD_STICK,
                requiredAmount: 4,
            },
            {
                itemDefinitionId: enums_1.Items.TARP,
                requiredAmount: 1,
            },
        ],
    },
    [enums_1.Items.BANDAGE_DRESSED]: {
        filterId: enums_1.FilterIds.SURVIVAL,
        components: [
            {
                itemDefinitionId: enums_1.Items.BANDAGE,
                requiredAmount: 5,
            },
            {
                itemDefinitionId: enums_1.Items.HONEY,
                requiredAmount: 1,
            },
        ],
    },
    [enums_1.Items.FUEL_ETHANOL]: {
        filterId: enums_1.FilterIds.WEAPONS,
        components: [
            {
                itemDefinitionId: enums_1.Items.CORN,
                requiredAmount: 1,
            },
            {
                itemDefinitionId: enums_1.Items.WATER_PURE,
                requiredAmount: 1,
            },
            {
                itemDefinitionId: enums_1.Items.YEAST,
                requiredAmount: 1,
            },
        ],
    },
    [enums_1.Items.WEAPON_TORCH_ETHANOL]: {
        filterId: enums_1.FilterIds.WEAPONS,
        components: [
            {
                itemDefinitionId: enums_1.Items.CLOTH,
                requiredAmount: 1,
            },
            {
                itemDefinitionId: enums_1.Items.WOOD_STICK,
                requiredAmount: 1,
            },
            {
                itemDefinitionId: enums_1.Items.FUEL_ETHANOL,
                requiredAmount: 1,
            },
        ],
    },
    [enums_1.Items.AMMO_ARROW_EXPLOSIVE]: {
        filterId: enums_1.FilterIds.WEAPONS,
        bundleCount: 10,
        components: [
            {
                itemDefinitionId: enums_1.Items.AMMO_ARROW,
                requiredAmount: 10,
            },
            {
                itemDefinitionId: enums_1.Items.DUCT_TAPE,
                requiredAmount: 1,
            },
            {
                itemDefinitionId: enums_1.Items.AMMO_12GA,
                requiredAmount: 10,
            },
        ],
    },
    [enums_1.Items.GLOVES_FINGERLESS]: {
        filterId: enums_1.FilterIds.SURVIVAL,
        components: [
            {
                itemDefinitionId: enums_1.Items.CLOTH,
                requiredAmount: 2,
            },
            {
                itemDefinitionId: enums_1.Items.SHARD_METAL,
                requiredAmount: 2,
            },
        ],
    },
    [enums_1.Items.TRAP_FIRE]: {
        filterId: enums_1.FilterIds.WEAPONS,
        components: [
            {
                itemDefinitionId: enums_1.Items.WEAPON_MOLOTOV,
                requiredAmount: 3,
            },
            {
                itemDefinitionId: enums_1.Items.TRAP_IGNITION_KIT,
                requiredAmount: 1,
            },
        ],
    },
    [enums_1.Items.FIRST_AID]: {
        filterId: enums_1.FilterIds.SURVIVAL,
        components: [
            {
                itemDefinitionId: enums_1.Items.BANDAGE,
                requiredAmount: 1,
            },
            {
                itemDefinitionId: enums_1.Items.SALINE,
                requiredAmount: 1,
            },
        ],
    },
    [enums_1.Items.AMMO_ARROW_FLAMING]: {
        filterId: enums_1.FilterIds.WEAPONS,
        bundleCount: 10,
        components: [
            {
                itemDefinitionId: enums_1.Items.CLOTH,
                requiredAmount: 2,
            },
            {
                itemDefinitionId: enums_1.Items.FUEL_BIOFUEL,
                requiredAmount: 1,
            },
            {
                itemDefinitionId: enums_1.Items.AMMO_ARROW,
                requiredAmount: 10,
            },
        ],
    },
    [enums_1.Items.FLARE]: {
        filterId: enums_1.FilterIds.SURVIVAL,
        components: [
            {
                itemDefinitionId: enums_1.Items.CLOTH,
                requiredAmount: 1,
            },
            {
                itemDefinitionId: enums_1.Items.FERTILIZER,
                requiredAmount: 1,
            },
            {
                itemDefinitionId: enums_1.Items.SUGAR,
                requiredAmount: 1,
            },
        ],
    },
    [enums_1.Items.TRAP_FLASH]: {
        filterId: enums_1.FilterIds.WEAPONS,
        components: [
            {
                itemDefinitionId: enums_1.Items.GRENADE_FLASH,
                requiredAmount: 3,
            },
            {
                itemDefinitionId: enums_1.Items.TRAP_IGNITION_KIT,
                requiredAmount: 1,
            },
        ],
    },
    [enums_1.Items.FLOUR]: {
        filterId: enums_1.FilterIds.SURVIVAL,
        components: [
            {
                itemDefinitionId: enums_1.Items.WHEAT,
                requiredAmount: 1,
            },
        ],
    },
    [enums_1.Items.FOUNDATION_EXPANSION]: {
        filterId: enums_1.FilterIds.HOUSING,
        components: [
            {
                itemDefinitionId: enums_1.Items.WOOD_LOG,
                requiredAmount: 2,
            },
            {
                itemDefinitionId: enums_1.Items.WOOD_PLANK,
                requiredAmount: 8,
            },
            {
                itemDefinitionId: enums_1.Items.NAIL,
                requiredAmount: 4,
            },
            {
                itemDefinitionId: enums_1.Items.METAL_BRACKET,
                requiredAmount: 4,
            },
        ],
    },
    [enums_1.Items.FOUNDATION_RAMP]: {
        filterId: enums_1.FilterIds.HOUSING,
        components: [
            {
                itemDefinitionId: enums_1.Items.WOOD_PLANK,
                requiredAmount: 12,
            },
            {
                itemDefinitionId: enums_1.Items.NAIL,
                requiredAmount: 20,
            },
            {
                itemDefinitionId: enums_1.Items.METAL_BRACKET,
                requiredAmount: 4,
            },
        ],
    },
    [enums_1.Items.FOUNDATION_STAIRS]: {
        filterId: enums_1.FilterIds.HOUSING,
        components: [
            {
                itemDefinitionId: enums_1.Items.WOOD_PLANK,
                requiredAmount: 20,
            },
            {
                itemDefinitionId: enums_1.Items.NAIL,
                requiredAmount: 12,
            },
            {
                itemDefinitionId: enums_1.Items.METAL_BRACKET,
                requiredAmount: 4,
            },
        ],
    },
    [enums_1.Items.BACKPACK_FRAMED]: {
        filterId: enums_1.FilterIds.SURVIVAL,
        components: [
            {
                itemDefinitionId: enums_1.Items.CLOTH,
                requiredAmount: 8,
            },
            {
                itemDefinitionId: enums_1.Items.TWINE,
                requiredAmount: 1,
            },
            {
                itemDefinitionId: enums_1.Items.BACKPACK_FRAME,
                requiredAmount: 1,
            },
        ],
    },
    [enums_1.Items.FURNACE]: {
        filterId: enums_1.FilterIds.HOUSING,
        components: [
            {
                itemDefinitionId: enums_1.Items.METAL_SCRAP,
                requiredAmount: 8,
            },
            {
                itemDefinitionId: enums_1.Items.METAL_BRACKET,
                requiredAmount: 1,
            },
        ],
    },
    [enums_1.Items.TRAP_GAS]: {
        filterId: enums_1.FilterIds.WEAPONS,
        components: [
            {
                itemDefinitionId: enums_1.Items.GRENADE_GAS,
                requiredAmount: 3,
            },
            {
                itemDefinitionId: enums_1.Items.TRAP_IGNITION_KIT,
                requiredAmount: 1,
            },
        ],
    },
    [enums_1.Items.GROUND_TAMPER]: {
        filterId: enums_1.FilterIds.HOUSING,
        components: [
            {
                itemDefinitionId: enums_1.Items.METAL_SHEET,
                requiredAmount: 2,
            },
            {
                itemDefinitionId: enums_1.Items.NAIL,
                requiredAmount: 4,
            },
            {
                itemDefinitionId: enums_1.Items.METAL_BRACKET,
                requiredAmount: 2,
            },
            {
                itemDefinitionId: enums_1.Items.WEAPON_BRANCH,
                requiredAmount: 1,
            },
        ],
    },
    [enums_1.Items.GROUND_TILLER]: {
        filterId: enums_1.FilterIds.HOUSING,
        components: [
            {
                itemDefinitionId: enums_1.Items.METAL_PIPE,
                requiredAmount: 1,
            },
            {
                itemDefinitionId: enums_1.Items.WOOD_STICK,
                requiredAmount: 1,
            },
            {
                itemDefinitionId: enums_1.Items.SHARD_METAL,
                requiredAmount: 4,
            },
        ],
    },
    // TODO GUN PARTS
    [enums_1.Items.REPAIR_KIT_GUN]: {
        filterId: enums_1.FilterIds.WEAPONS,
        components: [
            {
                itemDefinitionId: enums_1.Items.GUN_PART,
                requiredAmount: 2,
            },
        ],
    },
    [enums_1.Items.UPGRADE_KIT_GUN]: {
        filterId: enums_1.FilterIds.WEAPONS,
        components: [
            {
                itemDefinitionId: enums_1.Items.SHARD_METAL,
                requiredAmount: 5,
            },
            {
                itemDefinitionId: enums_1.Items.REPAIR_KIT_GUN,
                requiredAmount: 1,
            },
        ],
    },
    [enums_1.Items.GUNPOWDER]: {
        filterId: enums_1.FilterIds.COMPONENT,
        components: [
            {
                itemDefinitionId: enums_1.Items.FERTILIZER,
                requiredAmount: 1,
            },
            {
                itemDefinitionId: enums_1.Items.CHARCOAL,
                requiredAmount: 1,
            },
        ],
    },
    [enums_1.Items.WEAPON_HAMMER]: {
        filterId: enums_1.FilterIds.WEAPONS,
        components: [
            {
                itemDefinitionId: enums_1.Items.METAL_BAR,
                requiredAmount: 1,
            },
            {
                itemDefinitionId: enums_1.Items.WOOD_STICK,
                requiredAmount: 1,
            },
        ],
    },
    [enums_1.Items.HAND_SHOVEL]: {
        filterId: enums_1.FilterIds.SURVIVAL,
        components: [
            {
                itemDefinitionId: enums_1.Items.METAL_SHEET,
                requiredAmount: 1,
            },
            {
                itemDefinitionId: enums_1.Items.WOOD_STICK,
                requiredAmount: 1,
            },
        ],
    },
    [enums_1.Items.BLACKBERRY_HANDFUL]: {
        filterId: enums_1.FilterIds.SURVIVAL,
        components: [
            {
                itemDefinitionId: enums_1.Items.BLACKBERRY,
                requiredAmount: 10,
            },
        ],
    },
    [enums_1.Items.ANTI_VIRAL_BOTTLE]: {
        filterId: enums_1.FilterIds.COMPONENT,
        components: [
            {
                itemDefinitionId: enums_1.Items.HANDWRITTEN_NOTE_CAROLINE,
                requiredAmount: 1,
            },
            {
                itemDefinitionId: enums_1.Items.ANTI_VIRAL_BOTTLE_EMPTY,
                requiredAmount: 3,
            },
        ],
    },
    [enums_1.Items.IED]: {
        filterId: enums_1.FilterIds.WEAPONS,
        components: [
            {
                itemDefinitionId: enums_1.Items.CLOTH,
                requiredAmount: 1,
            },
            {
                itemDefinitionId: enums_1.Items.LANDMINE,
                requiredAmount: 1,
            },
        ],
        requireWorkbench: true,
    },
    [enums_1.Items.COMPASS_IMPROVISED]: {
        filterId: enums_1.FilterIds.SURVIVAL,
        components: [
            {
                itemDefinitionId: enums_1.Items.SHARD_METAL,
                requiredAmount: 1,
            },
            {
                itemDefinitionId: enums_1.Items.WATER_PURE,
                requiredAmount: 1,
            },
        ],
    },
    [enums_1.Items.SKINNING_KNIFE]: {
        filterId: enums_1.FilterIds.SURVIVAL,
        components: [
            {
                itemDefinitionId: enums_1.Items.METAL_SCRAP,
                requiredAmount: 3,
            },
            {
                itemDefinitionId: enums_1.Items.WOOD_STICK,
                requiredAmount: 1,
            },
        ],
    },
    [enums_1.Items.LANDMINE]: {
        filterId: enums_1.FilterIds.WEAPONS,
        components: [
            {
                itemDefinitionId: enums_1.Items.GUNPOWDER,
                requiredAmount: 1,
            },
            {
                itemDefinitionId: enums_1.Items.METAL_SHEET,
                requiredAmount: 1,
            },
            {
                itemDefinitionId: enums_1.Items.SHARD_METAL,
                requiredAmount: 1,
            },
        ],
        requireWorkbench: true,
    },
    [enums_1.Items.SHELTER_LARGE]: {
        filterId: enums_1.FilterIds.HOUSING,
        components: [
            {
                itemDefinitionId: enums_1.Items.METAL_SHEET,
                requiredAmount: 8,
            },
            {
                itemDefinitionId: enums_1.Items.WOOD_PLANK,
                requiredAmount: 8,
            },
            {
                itemDefinitionId: enums_1.Items.NAIL,
                requiredAmount: 16,
            },
            {
                itemDefinitionId: enums_1.Items.METAL_BRACKET,
                requiredAmount: 8,
            },
        ],
    },
    [enums_1.Items.LOOKOUT_TOWER]: {
        filterId: enums_1.FilterIds.HOUSING,
        components: [
            {
                itemDefinitionId: enums_1.Items.METAL_SHEET,
                requiredAmount: 4,
            },
            {
                itemDefinitionId: enums_1.Items.WOOD_PLANK,
                requiredAmount: 20,
            },
            {
                itemDefinitionId: enums_1.Items.NAIL,
                requiredAmount: 40,
            },
        ],
    },
    [enums_1.Items.WEAPON_MACHETE01]: {
        filterId: enums_1.FilterIds.WEAPONS,
        components: [
            {
                itemDefinitionId: enums_1.Items.METAL_SHEET,
                requiredAmount: 2,
            },
            {
                itemDefinitionId: enums_1.Items.WOOD_PLANK,
                requiredAmount: 2,
            },
        ],
        requireWorkbench: true,
    },
    [enums_1.Items.WEAPON_BOW_MAKESHIFT]: {
        filterId: enums_1.FilterIds.WEAPONS,
        components: [
            {
                itemDefinitionId: enums_1.Items.CLOTH,
                requiredAmount: 1,
            },
            {
                itemDefinitionId: enums_1.Items.WOOD_STICK,
                requiredAmount: 1,
            },
        ],
    },
    [enums_1.Items.WEAPON_HATCHET_MAKESHIFT]: {
        filterId: enums_1.FilterIds.WEAPONS,
        components: [
            {
                itemDefinitionId: enums_1.Items.METAL_SCRAP,
                requiredAmount: 1,
            },
            {
                itemDefinitionId: enums_1.Items.WOOD_STICK,
                requiredAmount: 1,
            },
        ],
    },
    [enums_1.Items.METAL_BAR]: {
        filterId: enums_1.FilterIds.FURNACE,
        components: [
            {
                itemDefinitionId: enums_1.Items.METAL_SCRAP,
                requiredAmount: 1,
            },
        ],
    },
    [enums_1.Items.METAL_BRACKET]: {
        filterId: enums_1.FilterIds.COMPONENT,
        components: [
            {
                itemDefinitionId: enums_1.Items.METAL_SCRAP,
                requiredAmount: 1,
            },
        ],
    },
    [enums_1.Items.DOOR_METAL]: {
        filterId: enums_1.FilterIds.HOUSING,
        components: [
            {
                itemDefinitionId: enums_1.Items.METAL_SHEET,
                requiredAmount: 2,
            },
            {
                itemDefinitionId: enums_1.Items.METAL_BRACKET,
                requiredAmount: 2,
            },
        ],
    },
    [enums_1.Items.METAL_DOORWAY]: {
        filterId: enums_1.FilterIds.HOUSING,
        components: [
            {
                itemDefinitionId: enums_1.Items.METAL_SHEET,
                requiredAmount: 4,
            },
            {
                itemDefinitionId: enums_1.Items.WOOD_PLANK,
                requiredAmount: 4,
            },
            {
                itemDefinitionId: enums_1.Items.METAL_BRACKET,
                requiredAmount: 2,
            },
        ],
    },
    [enums_1.Items.METAL_GATE]: {
        filterId: enums_1.FilterIds.HOUSING,
        components: [
            {
                itemDefinitionId: enums_1.Items.METAL_SHEET,
                requiredAmount: 2,
            },
            {
                itemDefinitionId: enums_1.Items.WOOD_PLANK,
                requiredAmount: 2,
            },
            {
                itemDefinitionId: enums_1.Items.METAL_BRACKET,
                requiredAmount: 2,
            },
        ],
    },
    [enums_1.Items.SHARD_METAL]: {
        filterId: enums_1.FilterIds.COMPONENT,
        bundleCount: 4,
        components: [
            {
                itemDefinitionId: enums_1.Items.METAL_SCRAP,
                requiredAmount: 1,
            },
        ],
    },
    [enums_1.Items.METAL_SHEET]: {
        filterId: enums_1.FilterIds.COMPONENT,
        components: [
            {
                itemDefinitionId: enums_1.Items.METAL_BAR,
                requiredAmount: 2,
            },
        ],
        requireWorkbench: true,
    },
    [enums_1.Items.METAL_WALL]: {
        filterId: enums_1.FilterIds.HOUSING,
        components: [
            {
                itemDefinitionId: enums_1.Items.METAL_SHEET,
                requiredAmount: 4,
            },
            {
                itemDefinitionId: enums_1.Items.WOOD_PLANK,
                requiredAmount: 4,
            },
        ],
    },
    [enums_1.Items.WEAPON_AK47_MODIFIED]: {
        filterId: enums_1.FilterIds.WEAPONS,
        components: [
            {
                itemDefinitionId: enums_1.Items.WEAPON_AK47,
                requiredAmount: 1,
            },
            {
                itemDefinitionId: enums_1.Items.UPGRADE_KIT_GUN,
                requiredAmount: 1,
            },
        ],
    },
    [enums_1.Items.WEAPON_MOLOTOV]: {
        filterId: enums_1.FilterIds.WEAPONS,
        components: [
            {
                itemDefinitionId: enums_1.Items.CLOTH,
                requiredAmount: 1,
            },
            {
                itemDefinitionId: enums_1.Items.MOONSHINE,
                requiredAmount: 1,
            },
        ],
    },
    [enums_1.Items.NAIL]: {
        filterId: enums_1.FilterIds.COMPONENT,
        bundleCount: 4,
        components: [
            {
                itemDefinitionId: enums_1.Items.SHARD_METAL,
                requiredAmount: 1,
            },
        ],
    },
    [enums_1.Items.FLARE_PARACHUTE]: {
        filterId: enums_1.FilterIds.SURVIVAL,
        components: [
            {
                itemDefinitionId: enums_1.Items.CLOTH,
                requiredAmount: 1,
            },
            {
                itemDefinitionId: enums_1.Items.FLARE,
                requiredAmount: 1,
            },
        ],
    },
    [enums_1.Items.METAL_PIPE]: {
        filterId: enums_1.FilterIds.COMPONENT,
        components: [
            {
                itemDefinitionId: enums_1.Items.METAL_SHEET,
                requiredAmount: 2,
            },
        ],
        requireWorkbench: true,
    },
    [enums_1.Items.SHARD_PLASTIC]: {
        filterId: enums_1.FilterIds.COMPONENT,
        components: [
            {
                itemDefinitionId: enums_1.Items.WATER_EMPTY,
                requiredAmount: 3,
            },
        ],
    },
    [enums_1.Items.ARMOR_PLATED]: {
        filterId: enums_1.FilterIds.SURVIVAL,
        components: [
            {
                itemDefinitionId: enums_1.Items.CLOTH,
                requiredAmount: 10,
            },
            {
                itemDefinitionId: enums_1.Items.METAL_SHEET,
                requiredAmount: 6,
            },
            {
                itemDefinitionId: enums_1.Items.WOOD_PLANK,
                requiredAmount: 6,
            },
            {
                itemDefinitionId: enums_1.Items.DUCT_TAPE,
                requiredAmount: 1,
            },
        ],
    },
    // TODO: find PUNJI_STICK_ROW def for 20 sticks
    [enums_1.Items.PUNJI_STICKS]: {
        filterId: enums_1.FilterIds.SURVIVAL,
        components: [
            {
                itemDefinitionId: enums_1.Items.WOOD_STICK,
                requiredAmount: 8,
            },
        ],
    },
    [enums_1.Items.WATER_PURE]: {
        filterId: enums_1.FilterIds.COOKING,
        components: [
            {
                itemDefinitionId: enums_1.Items.WATER_STAGNANT,
                requiredAmount: 1,
            },
        ],
    },
    [enums_1.Items.SANDWICH_RABBIT]: {
        filterId: enums_1.FilterIds.SURVIVAL,
        components: [
            {
                itemDefinitionId: enums_1.Items.STEAK_RABBIT,
                requiredAmount: 1,
            },
            {
                itemDefinitionId: enums_1.Items.SURVIVAL_BREAD,
                requiredAmount: 1,
            },
        ],
    },
    [enums_1.Items.STEW_RABBIT]: {
        filterId: enums_1.FilterIds.COOKING,
        components: [
            {
                itemDefinitionId: enums_1.Items.SALT,
                requiredAmount: 1,
            },
            {
                itemDefinitionId: enums_1.Items.STEAK_RABBIT,
                requiredAmount: 1,
            },
            {
                itemDefinitionId: enums_1.Items.WATER_PURE,
                requiredAmount: 1,
            },
        ],
    },
    [enums_1.Items.REPAIR_BOX]: {
        filterId: enums_1.FilterIds.HOUSING,
        components: [
            {
                itemDefinitionId: enums_1.Items.WOOD_PLANK,
                requiredAmount: 8,
            },
            {
                itemDefinitionId: enums_1.Items.NAIL,
                requiredAmount: 6,
            },
            {
                itemDefinitionId: enums_1.Items.METAL_BRACKET,
                requiredAmount: 6,
            },
        ],
    },
    [enums_1.Items.RIGGED_LIGHT]: {
        filterId: enums_1.FilterIds.SURVIVAL,
        components: [
            {
                itemDefinitionId: enums_1.Items.HEADLIGHTS_OFFROADER,
                requiredAmount: 1,
            },
            {
                itemDefinitionId: enums_1.Items.BATTERY,
                requiredAmount: 1,
            },
        ],
    },
    [enums_1.Items.CORN_ROASTED]: {
        filterId: enums_1.FilterIds.COOKING,
        components: [
            {
                itemDefinitionId: enums_1.Items.CORN,
                requiredAmount: 1,
            },
        ],
    },
    [enums_1.Items.SALINE]: {
        filterId: enums_1.FilterIds.COMPONENT,
        components: [
            {
                itemDefinitionId: enums_1.Items.SALT,
                requiredAmount: 1,
            },
            {
                itemDefinitionId: enums_1.Items.WATER_PURE,
                requiredAmount: 1,
            },
        ],
    },
    [enums_1.Items.BACKPACK_SATCHEL]: {
        filterId: enums_1.FilterIds.SURVIVAL,
        components: [
            {
                itemDefinitionId: enums_1.Items.CLOTH,
                requiredAmount: 6,
            },
        ],
    },
    [enums_1.Items.GRENADE_SCREAM]: {
        filterId: enums_1.FilterIds.WEAPONS,
        components: [
            {
                itemDefinitionId: enums_1.Items.GRENADE_SONIC_BROKEN,
                requiredAmount: 1,
            },
            {
                itemDefinitionId: enums_1.Items.VIAL_H1Z1_B_PLASMA,
                requiredAmount: 1,
            },
        ],
    },
    [enums_1.Items.SHACK]: {
        filterId: enums_1.FilterIds.HOUSING,
        components: [
            {
                itemDefinitionId: enums_1.Items.METAL_SHEET,
                requiredAmount: 2,
            },
            {
                itemDefinitionId: enums_1.Items.WOOD_PLANK,
                requiredAmount: 8,
            },
            {
                itemDefinitionId: enums_1.Items.NAIL,
                requiredAmount: 16,
            },
        ],
    },
    [enums_1.Items.SHELTER]: {
        filterId: enums_1.FilterIds.HOUSING,
        components: [
            {
                itemDefinitionId: enums_1.Items.METAL_SHEET,
                requiredAmount: 8,
            },
            {
                itemDefinitionId: enums_1.Items.WOOD_PLANK,
                requiredAmount: 8,
            },
            {
                itemDefinitionId: enums_1.Items.NAIL,
                requiredAmount: 16,
            },
        ],
    },
    [enums_1.Items.TRAP_SHOCK]: {
        filterId: enums_1.FilterIds.WEAPONS,
        components: [
            {
                itemDefinitionId: enums_1.Items.METAL_SHEET,
                requiredAmount: 5,
            },
            {
                itemDefinitionId: enums_1.Items.BARBED_WIRE,
                requiredAmount: 3,
            },
            {
                itemDefinitionId: enums_1.Items.TRAP_IGNITION_KIT,
                requiredAmount: 1,
            },
            {
                itemDefinitionId: enums_1.Items.BATTERIES_AA,
                requiredAmount: 2,
            },
        ],
    },
    // MEDICAL SKINS HERE TODO
    [enums_1.Items.SLEEPING_MAT]: {
        filterId: enums_1.FilterIds.SURVIVAL,
        components: [
            {
                itemDefinitionId: enums_1.Items.CLOTH,
                requiredAmount: 10,
            },
            {
                itemDefinitionId: enums_1.Items.TARP,
                requiredAmount: 1,
            },
        ],
    },
    [enums_1.Items.SHACK_SMALL]: {
        filterId: enums_1.FilterIds.HOUSING,
        components: [
            {
                itemDefinitionId: enums_1.Items.WOOD_PLANK,
                requiredAmount: 4,
            },
            {
                itemDefinitionId: enums_1.Items.NAIL,
                requiredAmount: 4,
            },
            {
                itemDefinitionId: enums_1.Items.METAL_BRACKET,
                requiredAmount: 2,
            },
        ],
    },
    [enums_1.Items.FLARE_SMOKE]: {
        filterId: enums_1.FilterIds.SURVIVAL,
        components: [
            {
                itemDefinitionId: enums_1.Items.CLOTH,
                requiredAmount: 1,
            },
            {
                itemDefinitionId: enums_1.Items.FERTILIZER,
                requiredAmount: 1,
            },
            {
                itemDefinitionId: enums_1.Items.SUGAR,
                requiredAmount: 1,
            },
        ],
    },
    [enums_1.Items.SNARE]: {
        filterId: enums_1.FilterIds.SURVIVAL,
        components: [
            {
                itemDefinitionId: enums_1.Items.METAL_SHEET,
                requiredAmount: 1,
            },
            {
                itemDefinitionId: enums_1.Items.SHARD_METAL,
                requiredAmount: 8,
            },
        ],
        requireWorkbench: true,
    },
    [enums_1.Items.STORAGE_BOX]: {
        filterId: enums_1.FilterIds.HOUSING,
        components: [
            {
                itemDefinitionId: enums_1.Items.WOOD_PLANK,
                requiredAmount: 6,
            },
            {
                itemDefinitionId: enums_1.Items.NAIL,
                requiredAmount: 4,
            },
            {
                itemDefinitionId: enums_1.Items.METAL_BRACKET,
                requiredAmount: 4,
            },
        ],
    },
    [enums_1.Items.STRUCTURE_STAIRS]: {
        filterId: enums_1.FilterIds.HOUSING,
        components: [
            {
                itemDefinitionId: enums_1.Items.WOOD_PLANK,
                requiredAmount: 12,
            },
            {
                itemDefinitionId: enums_1.Items.NAIL,
                requiredAmount: 8,
            },
            {
                itemDefinitionId: enums_1.Items.METAL_BRACKET,
                requiredAmount: 4,
            },
        ],
    },
    [enums_1.Items.SURVIVAL_BORSCHT]: {
        filterId: enums_1.FilterIds.COOKING,
        components: [
            {
                itemDefinitionId: enums_1.Items.CANNED_FOOD01,
                requiredAmount: 1,
            },
            {
                itemDefinitionId: enums_1.Items.SALT,
                requiredAmount: 1,
            },
            {
                itemDefinitionId: enums_1.Items.WATER_PURE,
                requiredAmount: 1,
            },
        ],
    },
    [enums_1.Items.SURVIVAL_BREAD]: {
        filterId: enums_1.FilterIds.COOKING,
        components: [
            {
                itemDefinitionId: enums_1.Items.WATER_PURE,
                requiredAmount: 1,
            },
            {
                itemDefinitionId: enums_1.Items.YEAST,
                requiredAmount: 1,
            },
            {
                itemDefinitionId: enums_1.Items.FLOUR,
                requiredAmount: 1,
            },
        ],
    },
    [enums_1.Items.SWIZZLE]: {
        filterId: enums_1.FilterIds.COOKING,
        components: [
            {
                itemDefinitionId: enums_1.Items.SUGAR,
                requiredAmount: 1,
            },
            {
                itemDefinitionId: enums_1.Items.WATER_PURE,
                requiredAmount: 1,
            },
            {
                itemDefinitionId: enums_1.Items.COLD_MEDICINE,
                requiredAmount: 1,
            },
        ],
    },
    [enums_1.Items.SYRINGE_H1Z1_REDUCER]: {
        filterId: enums_1.FilterIds.SURVIVAL,
        components: [
            {
                itemDefinitionId: enums_1.Items.SYRINGE_EMPTY,
                requiredAmount: 1,
            },
            {
                itemDefinitionId: enums_1.Items.VIAL_H1Z1_REDUCER,
                requiredAmount: 1,
            },
        ],
    },
    [enums_1.Items.GHILLIE_SUIT_TAN]: {
        filterId: enums_1.FilterIds.SURVIVAL,
        components: [
            {
                itemDefinitionId: enums_1.Items.CLOTH,
                requiredAmount: 20,
            },
            {
                itemDefinitionId: enums_1.Items.DUCT_TAPE,
                requiredAmount: 2,
            },
            {
                itemDefinitionId: enums_1.Items.TWINE,
                requiredAmount: 4,
            },
        ],
    },
    [enums_1.Items.WEAPON_TORCH]: {
        filterId: enums_1.FilterIds.WEAPONS,
        components: [
            {
                itemDefinitionId: enums_1.Items.CLOTH,
                requiredAmount: 1,
            },
            {
                itemDefinitionId: enums_1.Items.ANIMAL_FAT,
                requiredAmount: 1,
            },
            {
                itemDefinitionId: enums_1.Items.WEAPON_BRANCH,
                requiredAmount: 1,
            },
        ],
    },
    [enums_1.Items.TRAP_IGNITION_KIT]: {
        filterId: enums_1.FilterIds.COMPONENT,
        components: [
            {
                itemDefinitionId: enums_1.Items.GUNPOWDER,
                requiredAmount: 2,
            },
            {
                itemDefinitionId: enums_1.Items.WOOD_STICK,
                requiredAmount: 5,
            },
            {
                itemDefinitionId: enums_1.Items.SHARD_METAL,
                requiredAmount: 12,
            },
            {
                itemDefinitionId: enums_1.Items.TWINE,
                requiredAmount: 2,
            },
        ],
    },
    [enums_1.Items.BRAIN_TREATED]: {
        filterId: enums_1.FilterIds.COMPONENT,
        components: [
            {
                itemDefinitionId: enums_1.Items.SYRINGE_INFECTED_BLOOD,
                requiredAmount: 1,
            },
            {
                itemDefinitionId: enums_1.Items.VIAL_H1Z1_REDUCER,
                requiredAmount: 1,
            },
            {
                itemDefinitionId: enums_1.Items.EMPTY_SPECIMEN_BAG,
                requiredAmount: 1,
            },
            {
                itemDefinitionId: enums_1.Items.BRAIN_INFECTED,
                requiredAmount: 1,
            },
        ],
    },
    [enums_1.Items.SHELTER_UPPER_LARGE]: {
        filterId: enums_1.FilterIds.HOUSING,
        components: [
            {
                itemDefinitionId: enums_1.Items.METAL_SHEET,
                requiredAmount: 6,
            },
            {
                itemDefinitionId: enums_1.Items.WOOD_PLANK,
                requiredAmount: 8,
            },
            {
                itemDefinitionId: enums_1.Items.NAIL,
                requiredAmount: 16,
            },
            {
                itemDefinitionId: enums_1.Items.METAL_BRACKET,
                requiredAmount: 8,
            },
        ],
    },
    [enums_1.Items.SHELTER_UPPER]: {
        filterId: enums_1.FilterIds.HOUSING,
        components: [
            {
                itemDefinitionId: enums_1.Items.METAL_SHEET,
                requiredAmount: 6,
            },
            {
                itemDefinitionId: enums_1.Items.NAIL,
                requiredAmount: 16,
            },
            {
                itemDefinitionId: enums_1.Items.METAL_BRACKET,
                requiredAmount: 8,
            },
        ],
    },
    [enums_1.Items.STRUCTURE_STAIRS_UPPER]: {
        filterId: enums_1.FilterIds.HOUSING,
        components: [
            {
                itemDefinitionId: enums_1.Items.WOOD_PLANK,
                requiredAmount: 8,
            },
            {
                itemDefinitionId: enums_1.Items.WOOD_STICK,
                requiredAmount: 8,
            },
            {
                itemDefinitionId: enums_1.Items.NAIL,
                requiredAmount: 8,
            },
            {
                itemDefinitionId: enums_1.Items.METAL_BRACKET,
                requiredAmount: 4,
            },
        ],
    },
    [enums_1.Items.METAL_WALL_UPPER]: {
        filterId: enums_1.FilterIds.HOUSING,
        components: [
            {
                itemDefinitionId: enums_1.Items.METAL_SHEET,
                requiredAmount: 4,
            },
            {
                itemDefinitionId: enums_1.Items.WOOD_PLANK,
                requiredAmount: 4,
            },
        ],
    },
    [enums_1.Items.WORKBENCH_WEAPON]: {
        filterId: enums_1.FilterIds.HOUSING,
        components: [
            {
                itemDefinitionId: enums_1.Items.METAL_SHEET,
                requiredAmount: 2,
            },
            {
                itemDefinitionId: enums_1.Items.METAL_SCRAP,
                requiredAmount: 4,
            },
            {
                itemDefinitionId: enums_1.Items.WOOD_PLANK,
                requiredAmount: 4,
            },
            {
                itemDefinitionId: enums_1.Items.WATER_EMPTY,
                requiredAmount: 1,
            },
        ],
    },
    [enums_1.Items.SANDWICH_WOLF]: {
        filterId: enums_1.FilterIds.SURVIVAL,
        components: [
            {
                itemDefinitionId: enums_1.Items.STEAK_WOLF,
                requiredAmount: 1,
            },
            {
                itemDefinitionId: enums_1.Items.SURVIVAL_BREAD,
                requiredAmount: 1,
            },
        ],
    },
    [enums_1.Items.STEAK_WOLF]: {
        filterId: enums_1.FilterIds.COOKING,
        components: [
            {
                itemDefinitionId: enums_1.Items.MEAT_WOLF,
                requiredAmount: 1,
            },
        ],
    },
    [enums_1.Items.WOOD_PLANK]: {
        filterId: enums_1.FilterIds.COMPONENT,
        bundleCount: 2,
        components: [
            {
                itemDefinitionId: enums_1.Items.WOOD_LOG,
                requiredAmount: 1,
            },
        ],
    },
    [enums_1.Items.WEAPON_SPEAR]: {
        filterId: enums_1.FilterIds.WEAPONS,
        components: [
            {
                itemDefinitionId: enums_1.Items.SHARD_METAL,
                requiredAmount: 1,
            },
            {
                itemDefinitionId: enums_1.Items.WEAPON_BRANCH,
                requiredAmount: 1,
            },
        ],
    },
    [enums_1.Items.WOOD_STICK]: {
        filterId: enums_1.FilterIds.COMPONENT,
        bundleCount: 2,
        components: [
            {
                itemDefinitionId: enums_1.Items.WOOD_PLANK,
                requiredAmount: 1,
            },
        ],
    },
    [enums_1.Items.AMMO_ARROW]: {
        filterId: enums_1.FilterIds.WEAPONS,
        components: [
            {
                itemDefinitionId: enums_1.Items.WOOD_STICK,
                requiredAmount: 1,
            },
        ],
    },
    [enums_1.Items.BARRICADE]: {
        filterId: enums_1.FilterIds.SURVIVAL,
        components: [
            {
                itemDefinitionId: enums_1.Items.WOOD_PLANK,
                requiredAmount: 2,
            },
            {
                itemDefinitionId: enums_1.Items.NAIL,
                requiredAmount: 4,
            },
        ],
    },
    [enums_1.Items.ARMOR_WOODEN]: {
        filterId: enums_1.FilterIds.SURVIVAL,
        components: [
            {
                itemDefinitionId: enums_1.Items.CLOTH,
                requiredAmount: 10,
            },
            {
                itemDefinitionId: enums_1.Items.WOOD_PLANK,
                requiredAmount: 6,
            },
            {
                itemDefinitionId: enums_1.Items.DUCT_TAPE,
                requiredAmount: 1,
            },
        ],
    },
    [enums_1.Items.WEAPON_BOW_WOOD]: {
        filterId: enums_1.FilterIds.WEAPONS,
        components: [
            {
                itemDefinitionId: enums_1.Items.CLOTH,
                requiredAmount: 1,
            },
            {
                itemDefinitionId: enums_1.Items.WOOD_STICK,
                requiredAmount: 2,
            },
            {
                itemDefinitionId: enums_1.Items.TWINE,
                requiredAmount: 1,
            },
        ],
    },
    [enums_1.Items.DOOR_WOOD]: {
        filterId: enums_1.FilterIds.HOUSING,
        components: [
            {
                itemDefinitionId: enums_1.Items.WOOD_PLANK,
                requiredAmount: 4,
            },
            {
                itemDefinitionId: enums_1.Items.NAIL,
                requiredAmount: 2,
            },
            {
                itemDefinitionId: enums_1.Items.METAL_BRACKET,
                requiredAmount: 2,
            },
        ],
    },
    [enums_1.Items.WORKBENCH]: {
        filterId: enums_1.FilterIds.HOUSING,
        components: [
            {
                itemDefinitionId: enums_1.Items.WOOD_PLANK,
                requiredAmount: 4,
            },
            {
                itemDefinitionId: enums_1.Items.WOOD_STICK,
                requiredAmount: 4,
            },
            {
                itemDefinitionId: enums_1.Items.NAIL,
                requiredAmount: 8,
            },
            {
                itemDefinitionId: enums_1.Items.METAL_BRACKET,
                requiredAmount: 4,
            },
        ],
    },
    [enums_1.Items.YEAST]: {
        filterId: enums_1.FilterIds.COMPONENT,
        components: [
            {
                itemDefinitionId: enums_1.Items.SUGAR,
                requiredAmount: 1,
            },
            {
                itemDefinitionId: enums_1.Items.WATER_PURE,
                requiredAmount: 1,
            },
            {
                itemDefinitionId: enums_1.Items.WHEAT,
                requiredAmount: 1,
            },
        ],
    },
};
//# sourceMappingURL=Recipes.js.map