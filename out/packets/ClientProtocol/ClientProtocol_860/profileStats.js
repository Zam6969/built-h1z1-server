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
exports.profileStatsPackets = void 0;
const shared_1 = require("./shared");
exports.profileStatsPackets = [
    [
        "ProfileStats.GetPlayerProfileStats",
        0x930000,
        {
            fields: [
                { name: "characterId", type: "uint64string", defaultValue: "0" },
            ],
        },
    ],
    ["ProfileStats.GetZonePlayerProfileStats", 0x930100, {}],
    [
        "ProfileStats.PlayerProfileStats",
        0x930200,
        {
            fields: [
                {
                    name: "unknownData1",
                    type: "schema",
                    fields: [
                        {
                            name: "unknownData1",
                            type: "schema",
                            fields: shared_1.profileStatsSubSchema1,
                        },
                        { name: "unknownDword1", type: "uint32", defaultValue: 0 },
                        {
                            name: "unknownArray1",
                            type: "array",
                            defaultValue: [],
                            elementType: "uint32",
                        },
                        { name: "unknownDword2", type: "uint32", defaultValue: 0 },
                        { name: "characterName", type: "string", defaultValue: "" },
                        { name: "characterId", type: "uint64string", defaultValue: "0" },
                        { name: "battleRank", type: "uint32", defaultValue: 0 },
                        { name: "unknownDword4", type: "uint32", defaultValue: 0 },
                        { name: "unknownDword6", type: "uint32", defaultValue: 0 },
                        { name: "unknownDword7", type: "uint32", defaultValue: 0 },
                        { name: "unknownByte1", type: "uint8", defaultValue: 0 },
                        {
                            name: "unknownArray2",
                            type: "array",
                            defaultValue: [],
                            elementType: "uint32",
                        },
                        { name: "unknownDword8", type: "uint32", defaultValue: 0 },
                        { name: "unknownDword9", type: "uint32", defaultValue: 0 },
                        { name: "unknownDword10", type: "uint32", defaultValue: 0 },
                        { name: "unknownDword11", type: "uint32", defaultValue: 0 },
                        { name: "unknownDword12", type: "uint32", defaultValue: 0 },
                        {
                            name: "unknownArray3",
                            type: "array",
                            defaultValue: [],
                            elementType: "uint32",
                        },
                        { name: "unknownDword13", type: "uint32", defaultValue: 0 },
                        {
                            name: "unknownArray4",
                            type: "array",
                            defaultValue: [],
                            elementType: "uint32",
                        },
                        {
                            name: "unknownArray5",
                            type: "array",
                            defaultValue: [],
                            length: 10,
                            fields: [
                                { name: "unknownDword1", type: "uint32", defaultValue: 0 },
                                {
                                    name: "unknownArray1",
                                    type: "array",
                                    defaultValue: [],
                                    elementType: "uint32",
                                },
                                {
                                    name: "unknownArray2",
                                    type: "array",
                                    defaultValue: [],
                                    elementType: "uint32",
                                },
                                {
                                    name: "unknownArray3",
                                    type: "array",
                                    defaultValue: [],
                                    elementType: "uint32",
                                },
                            ],
                        },
                    ],
                },
                {
                    name: "weaponStats1",
                    type: "array",
                    defaultValue: [],
                    fields: shared_1.weaponStatsDataSchema,
                },
                {
                    name: "weaponStats2",
                    type: "array",
                    defaultValue: [],
                    fields: shared_1.weaponStatsDataSchema,
                },
                {
                    name: "vehicleStats",
                    type: "array",
                    defaultValue: [],
                    fields: shared_1.vehicleStatsDataSchema,
                },
                {
                    name: "facilityStats1",
                    type: "array",
                    defaultValue: [],
                    fields: shared_1.facilityStatsDataSchema,
                },
                {
                    name: "facilityStats2",
                    type: "array",
                    defaultValue: [],
                    fields: shared_1.facilityStatsDataSchema,
                },
            ],
        },
    ],
    ["ProfileStats.ZonePlayerProfileStats", 0x930300, {}],
    ["ProfileStats.UpdatePlayerLeaderboards", 0x930400, {}],
    ["ProfileStats.UpdatePlayerLeaderboardsReply", 0x930500, {}],
    ["ProfileStats.GetLeaderboard", 0x930600, {}],
    ["ProfileStats.Leaderboard", 0x930700, {}],
    ["ProfileStats.GetZoneCharacterStats", 0x930800, {}],
    ["ProfileStats.ZoneCharacterStats", 0x930900, {}],
];
//# sourceMappingURL=profileStats.js.map