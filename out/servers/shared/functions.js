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
exports.getCharacterModelData = void 0;
const enums_1 = require("../ZoneServer2016/models/enums");
function getCharacterModelData(payload) {
    switch (payload.headType) {
        case enums_1.Characters.FEMALE_BLACK:
            return {
                modelId: 9474,
                headActor: "SurvivorFemale_Head_03.adr",
                hairModel: "SurvivorFemale_Hair_ShortMessy.adr",
            };
        case enums_1.Characters.MALE_BLACK:
            return {
                modelId: 9240,
                headActor: "SurvivorMale_Head_03.adr",
                hairModel: "",
            };
        case enums_1.Characters.FEMALE_WHITE:
            return {
                modelId: 9474,
                headActor: "SurvivorFemale_Head_02.adr",
                hairModel: "SurvivorFemale_Hair_ShortBun.adr",
            };
        case enums_1.Characters.FEMALE_WHITE_YOUNG:
            return {
                modelId: 9474,
                headActor: "SurvivorFemale_Head_02.adr",
                hairModel: "SurvivorFemale_Hair_ShortBun.adr",
            };
        case enums_1.Characters.MALE_WHITE_BALD:
            return {
                modelId: 9240,
                headActor: "SurvivorMale_Head_02.adr",
                hairModel: "",
            };
        case enums_1.Characters.MALE_WHITE:
        default:
            return {
                modelId: 9240,
                headActor: "SurvivorMale_Head_01.adr",
                hairModel: "SurvivorMale_Hair_ShortMessy.adr",
            };
    }
}
exports.getCharacterModelData = getCharacterModelData;
//# sourceMappingURL=functions.js.map