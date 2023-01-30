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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const packettable_1 = __importDefault(require("../../packettable"));
const abilities_1 = require("./abilities");
const ability_1 = require("./ability");
const achievement_1 = require("./achievement");
const acquaintance_1 = require("./acquaintance");
const activityManager_1 = require("./activityManager");
const activityService_1 = require("./activityService");
const base_1 = require("./base");
const chat_1 = require("./chat");
const clientPcData_1 = require("./clientPcData");
const clientUpdate_1 = require("./clientUpdate");
const coinStore_1 = require("./coinStore");
const collision_1 = require("./collision");
const combat_1 = require("./combat");
const command_1 = require("./command");
const construction_1 = require("./construction");
const container_1 = require("./container");
const currency_1 = require("./currency");
const definitionFilter_1 = require("./definitionFilter");
const deployable_1 = require("./deployable");
const dto_1 = require("./dto");
const effects_1 = require("./effects");
const equipment_1 = require("./equipment");
const experience_1 = require("./experience");
const facility_1 = require("./facility");
const friend_1 = require("./friend");
const guild_1 = require("./guild");
const implant_1 = require("./implant");
const inGamePurchase_1 = require("./inGamePurchase");
const items_1 = require("./items");
const loadout_1 = require("./loadout");
const lobby_1 = require("./lobby");
const lobbyGameDefinition_1 = require("./lobbyGameDefinition");
const loot_1 = require("./loot");
const mapRegion_1 = require("./mapRegion");
const metaGameEvent_1 = require("./metaGameEvent");
const missions_1 = require("./missions");
const mount_1 = require("./mount");
const operation_1 = require("./operation");
const playerUpdate_1 = require("./playerUpdate");
const profileStats_1 = require("./profileStats");
const quickChat_1 = require("./quickChat");
const ragdoll_1 = require("./ragdoll");
const recipe_1 = require("./recipe");
const referenceData_1 = require("./referenceData");
const rewardBuffs_1 = require("./rewardBuffs");
const skill_1 = require("./skill");
const staticFacilityInfo_1 = require("./staticFacilityInfo");
const target_1 = require("./target");
const thrustPad_1 = require("./thrustPad");
const ui_1 = require("./ui");
const vehicle_1 = require("./vehicle");
const voice_1 = require("./voice");
const wallOfData_1 = require("./wallOfData");
const warpgate_1 = require("./warpgate");
const wordFilter_1 = require("./wordFilter");
const zoneSetting_1 = require("./zoneSetting");
const clientPath_1 = require("./clientPath");
const packets = [
    ...base_1.basePackets,
    ...abilities_1.abilitiesPackets,
    ...ability_1.abilityPackets,
    ...achievement_1.achievementPackets,
    ...acquaintance_1.acquaintancePackets,
    ...activityManager_1.activityManagerPackets,
    ...activityService_1.activityServicePackets,
    ...chat_1.chatPackets,
    ...clientPcData_1.clientPcDataPackets,
    ...clientUpdate_1.clientUpdatePackets,
    ...implant_1.implantPackets,
    ...coinStore_1.coinStorePackets,
    ...collision_1.collisionPackets,
    ...combat_1.combatPackets,
    ...command_1.commandPackets,
    ...construction_1.constructionPackets,
    ...container_1.containerPackets,
    ...currency_1.currencyPackets,
    ...definitionFilter_1.definitionFilterPackets,
    ...deployable_1.deployablePackets,
    ...dto_1.dtoPackets,
    ...effects_1.effectsPackets,
    ...equipment_1.equipmentPackets,
    ...experience_1.experiencePackets,
    ...facility_1.facilityPackets,
    ...friend_1.friendPackets,
    ...guild_1.guildPackets,
    ...inGamePurchase_1.inGamePurchasePackets,
    ...items_1.itemsPackets,
    ...loadout_1.loadoutPackets,
    ...lobby_1.lobbyPackets,
    ...lobbyGameDefinition_1.lobbyGameDefinitionPackets,
    ...loot_1.lootPackets,
    ...mapRegion_1.mapRegionPackets,
    ...metaGameEvent_1.MetaGameEventPackets,
    ...missions_1.missionsPackets,
    ...mount_1.mountPackets,
    ...operation_1.operationPackets,
    ...playerUpdate_1.playerUpdatePackets,
    ...profileStats_1.profileStatsPackets,
    ...quickChat_1.quickChatPackets,
    ...ragdoll_1.ragdollPackets,
    ...recipe_1.recipePackets,
    ...referenceData_1.referenceDataPackets,
    ...rewardBuffs_1.rewardBuffsPackets,
    ...skill_1.skillPackets,
    ...staticFacilityInfo_1.staticFacilityInfoPackets,
    ...target_1.targetPackets,
    ...thrustPad_1.ThrustPadPackets,
    ...ui_1.uiPackets,
    ...vehicle_1.vehiclePackets,
    ...voice_1.voicePackets,
    ...wallOfData_1.wallOfDataPackets,
    ...warpgate_1.warpgatePackets,
    ...wordFilter_1.wordFilterPackets,
    ...zoneSetting_1.zoneSettingPackets,
    ...clientPath_1.clientPathPackets,
];
const [packetTypes, packetDescriptors] = (0, packettable_1.default)(packets);
exports.PacketTypes = packetTypes;
exports.Packets = packetDescriptors;
//# sourceMappingURL=h1z1packets.js.map