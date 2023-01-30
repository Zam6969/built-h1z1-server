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
exports.DB_COLLECTIONS = exports.NAME_VALIDATION_STATUS = exports.GAME_VERSIONS = void 0;
var GAME_VERSIONS;
(function (GAME_VERSIONS) {
    GAME_VERSIONS[GAME_VERSIONS["H1Z1_15janv_2015"] = 1] = "H1Z1_15janv_2015";
    GAME_VERSIONS[GAME_VERSIONS["H1Z1_6dec_2016"] = 2] = "H1Z1_6dec_2016";
    GAME_VERSIONS[GAME_VERSIONS["H1Z1_KOTK_PS3"] = 3] = "H1Z1_KOTK_PS3";
})(GAME_VERSIONS = exports.GAME_VERSIONS || (exports.GAME_VERSIONS = {}));
var NAME_VALIDATION_STATUS;
(function (NAME_VALIDATION_STATUS) {
    NAME_VALIDATION_STATUS[NAME_VALIDATION_STATUS["AVAILABLE"] = 1] = "AVAILABLE";
    NAME_VALIDATION_STATUS[NAME_VALIDATION_STATUS["TAKEN"] = 2] = "TAKEN";
    NAME_VALIDATION_STATUS[NAME_VALIDATION_STATUS["INVALID"] = 3] = "INVALID";
    NAME_VALIDATION_STATUS[NAME_VALIDATION_STATUS["PROFANE"] = 4] = "PROFANE";
    NAME_VALIDATION_STATUS[NAME_VALIDATION_STATUS["RESERVED"] = 5] = "RESERVED";
})(NAME_VALIDATION_STATUS = exports.NAME_VALIDATION_STATUS || (exports.NAME_VALIDATION_STATUS = {}));
var DB_COLLECTIONS;
(function (DB_COLLECTIONS) {
    DB_COLLECTIONS["ADMINS"] = "admins";
    DB_COLLECTIONS["BANNED"] = "banned";
    DB_COLLECTIONS["BLACK_LIST_ENTRIES"] = "blackListEntries";
    DB_COLLECTIONS["CHARACTERS"] = "characters";
    DB_COLLECTIONS["CHARACTERS_LIGHT"] = "characters-light";
    DB_COLLECTIONS["CHAT"] = "chat";
    DB_COLLECTIONS["CONSTRUCTION"] = "construction";
    DB_COLLECTIONS["CONSTRUCTION_TEMP"] = "construction-temp";
    DB_COLLECTIONS["CROPS"] = "crops";
    DB_COLLECTIONS["CROPS_TEMP"] = "crops-temp";
    DB_COLLECTIONS["FINGERPRINTS"] = "fingerprints";
    DB_COLLECTIONS["PROPS"] = "props";
    DB_COLLECTIONS["SERVERS"] = "servers";
    DB_COLLECTIONS["USERS_SESSIONS"] = "user-sessions";
    DB_COLLECTIONS["VEHICLES"] = "vehicles";
    DB_COLLECTIONS["WEATHERS"] = "weathers";
    DB_COLLECTIONS["WORLD_CONSTRUCTIONS"] = "worldconstruction";
    DB_COLLECTIONS["WORLD_CONSTRUCTIONS_TEMP"] = "worldconstruction-temp";
    DB_COLLECTIONS["WORLDS"] = "worlds";
    DB_COLLECTIONS["COMMAND_USED"] = "commands-used";
    DB_COLLECTIONS["FAIRPLAY"] = "fairplay-logs";
    DB_COLLECTIONS["KILLS"] = "kills";
})(DB_COLLECTIONS = exports.DB_COLLECTIONS || (exports.DB_COLLECTIONS = {}));
//# sourceMappingURL=enums.js.map