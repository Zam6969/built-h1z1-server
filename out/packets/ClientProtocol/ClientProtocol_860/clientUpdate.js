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
exports.clientUpdatePackets = void 0;
const shared_1 = require("./shared");
const shared_2 = require("./shared");
exports.clientUpdatePackets = [
    ["ClientUpdate.Hitpoints", 0x110100, {}],
    [
        "ClientUpdate.ItemAdd",
        0x110200,
        {
            fields: [
                { name: "guid", type: "uint64string", defaultValue: "0" },
                { name: "unknown1", type: "uint32", defaultValue: 7 }, // need to be > 0
            ],
        },
    ],
    ["ClientUpdate.ItemUpdate", 0x110300, {}],
    ["ClientUpdate.ItemDelete", 0x110400, {}],
    [
        "ClientUpdate.UpdateStat",
        0x110500,
        {
            fields: [
                {
                    name: "stats",
                    type: "array",
                    defaultValue: [],
                    fields: shared_2.statDataSchema,
                },
            ],
        },
    ],
    ["ClientUpdate.CollectionStart", 0x110600, {}],
    ["ClientUpdate.CollectionRemove", 0x110700, {}],
    [
        "ClientUpdate.CollectionAddEntry",
        0x110800,
        {
            fields: [
                { name: "unknownDword1", type: "uint32", defaultValue: 0 },
                { name: "unknownDword2", type: "uint32", defaultValue: 0 },
                { name: "unknownDword3", type: "uint32", defaultValue: 0 },
                { name: "unknownDword4", type: "uint32", defaultValue: 0 },
                { name: "unknownDword5", type: "uint32", defaultValue: 0 },
                { name: "unknownDword6", type: "uint32", defaultValue: 0 },
                { name: "unknownDword7", type: "uint32", defaultValue: 0 },
                { name: "unknownBoolean1", type: "boolean", defaultValue: false },
            ],
        },
    ],
    [
        "ClientUpdate.CollectionRemoveEntry",
        0x110900,
        {
            fields: [
                { name: "unknownDword1", type: "uint32", defaultValue: 0 },
                { name: "unknownDword2", type: "uint32", defaultValue: 0 },
            ],
        },
    ],
    [
        "ClientUpdate.UpdateLocation",
        0x110a00,
        {
            fields: [
                { name: "position", type: "floatvector4", defaultValue: [0, 50, 0, 1] },
                { name: "rotation", type: "floatvector4", defaultValue: [0, 0, 0, 1] },
                { name: "unknownBool1", type: "boolean", defaultValue: true },
                { name: "movementVersion", type: "uint8", defaultValue: 0 },
            ],
        },
    ],
    [
        "ClientUpdate.Mana",
        0x110b00,
        {
            fields: [{ name: "mana", type: "uint32", defaultValue: 10 }],
        },
    ],
    ["ClientUpdate.UpdateProfileExperience", 0x110c00, {}],
    [
        "ClientUpdate.AddProfileAbilitySetApl",
        0x110d00,
        {
            fields: [
                { name: "unknownDword1", type: "uint32", defaultValue: 4 },
                {
                    name: "profiles",
                    type: "array",
                    defaultValue: [],
                    fields: shared_2.profileDataSchema,
                },
            ],
        },
    ],
    [
        "ClientUpdate.AddEffectTag",
        0x110e00,
        {
            fields: [
                { name: "unknownDword1", type: "uint32", defaultValue: 1111389 },
                { name: "unknownDword2", type: "uint32", defaultValue: 4 },
                { name: "unknownDword3", type: "uint32", defaultValue: 3 },
            ],
        },
    ],
    ["ClientUpdate.RemoveEffectTag", 0x110f00, {}],
    ["ClientUpdate.UpdateProfileRank", 0x111000, {}],
    ["ClientUpdate.CoinCount", 0x111100, {}],
    ["ClientUpdate.DeleteProfile", 0x111200, {}],
    [
        "ClientUpdate.ActivateProfile",
        0x111300,
        {
            fields: [
                {
                    name: "profiles",
                    type: "byteswithlength",
                    fields: shared_2.profileDataSchema,
                },
                {
                    name: "attachmentData",
                    type: "array",
                    defaultValue: [],
                    fields: [
                        { name: "modelName", type: "string", defaultValue: "" },
                        { name: "defaultTextureAlias", type: "string", defaultValue: "" },
                        { name: "tintAlias", type: "string", defaultValue: "" },
                        { name: "unknownString2", type: "string", defaultValue: "#" },
                        { name: "unknownDword1", type: "uint32", defaultValue: 0 },
                        { name: "enableDebug", type: "uint32", defaultValue: 0 },
                        { name: "slotId", type: "uint32", defaultValue: 2 },
                    ],
                },
                //{ name: "unknownDword1", type: "uint32", defaultValue: 0 },
                { name: "unknownDword1", type: "uint32", defaultValue: 1 },
                { name: "unknownDword3", type: "uint32", defaultValue: 1 },
                { name: "actorModel", type: "uint32", defaultValue: 9240 },
                { name: "unknownString1", type: "string", defaultValue: "" },
                { name: "unknownString2", type: "string", defaultValue: "#" },
            ],
        },
    ],
    ["ClientUpdate.AddAbility", 0x111400, {}],
    [
        "ClientUpdate.NotifyPlayer",
        0x111500,
        {
            fields: [{ name: "message", type: "string", defaultValue: "hello" }],
        },
    ],
    ["ClientUpdate.UpdateProfileAbilitySetApl", 0x111600, {}],
    ["ClientUpdate.RemoveActionBars", 0x111700, {}],
    ["ClientUpdate.UpdateActionBarSlot", 0x111800, {}],
    [
        "ClientUpdate.DoneSendingPreloadCharacters",
        0x111900,
        {
            fields: [{ name: "unknownBoolean1", type: "uint8", defaultValue: 0 }],
        },
    ],
    ["ClientUpdate.SetGrandfatheredStatus", 0x111a00, {}],
    ["ClientUpdate.UpdateActionBarSlotUsed", 0x111b00, {}],
    ["ClientUpdate.PhaseChange", 0x111c00, {}],
    ["ClientUpdate.UpdateKingdomExperience", 0x111d00, {}],
    [
        "ClientUpdate.DamageInfo",
        0x111e00,
        {
            fields: [
                { name: "unknownDword1", type: "uint32", defaultValue: 1 },
                {
                    name: "transientId",
                    type: "custom",
                    parser: shared_1.readUnsignedIntWith2bitLengthValue,
                    packer: shared_1.packUnsignedIntWith2bitLengthValue,
                    defaultValue: 1,
                },
                { name: "unknownDword2", type: "int32", defaultValue: 1 },
                { name: "orientationToSource", type: "float", defaultValue: -1.7 },
                { name: "unknownDword4", type: "uint32", defaultValue: 0 },
                { name: "unknownBoolean2", type: "boolean", defaultValue: 1 },
                { name: "unknownBoolean3", type: "boolean", defaultValue: 1 },
                { name: "unknownDword5", type: "uint32", defaultValue: 0 },
                { name: "unknownDword6", type: "uint32", defaultValue: 0 },
            ],
        },
    ],
    [
        "ClientUpdate.ZonePopulation",
        0x111f00,
        {
            fields: [
                {
                    name: "populations",
                    type: "array",
                    defaultValue: [],
                    elementType: "uint8",
                },
            ],
        },
    ],
    [
        "ClientUpdate.RespawnLocations",
        0x112000,
        {
            fields: [
                {
                    name: "locations",
                    type: "array",
                    defaultValue: [],
                    fields: shared_2.respawnLocationDataSchema,
                },
                {
                    name: "locations2",
                    type: "array",
                    defaultValue: [],
                    fields: shared_2.respawnLocationDataSchema,
                },
            ],
        },
    ],
    [
        "ClientUpdate.ModifyMovementSpeed",
        0x112100,
        {
            fields: [
                { name: "speed", type: "float", defaultValue: 10 },
                { name: "movementVersion", type: "uint8", defaultValue: 1 },
            ],
        },
    ],
    [
        "ClientUpdate.ModifyTurnRate",
        0x112200,
        {
            fields: [
                { name: "speed", type: "float", defaultValue: 10 },
                { name: "movementVersion", type: "uint8", defaultValue: 1 },
            ],
        },
    ],
    [
        "ClientUpdate.ModifyStrafeSpeed",
        0x112300,
        {
            fields: [
                { name: "speed", type: "float", defaultValue: 10 },
                { name: "movementVersion", type: "uint8", defaultValue: 1 },
            ],
        },
    ],
    [
        "ClientUpdate.UpdateManagedLocation",
        0x112400,
        {
            fields: [
                { name: "characterId", type: "uint64string", defaultValue: "0" },
                { name: "position", type: "floatvector4", defaultValue: [0, 0, 0, 0] },
                { name: "rotation", type: "floatvector4", defaultValue: [0, 0, 0, 0] },
                { name: "unk1", type: "uint8", defaultValue: 1 },
                { name: "unk2", type: "uint8", defaultValue: 1 },
            ],
        },
    ],
    [
        "ClientUpdate.ScreenEffect",
        0x112500,
        {
            fields: [
                { name: "unknown1", type: "uint32", defaultValue: 0 },
                {
                    name: "unknownUint",
                    type: "custom",
                    parser: shared_1.readUnsignedIntWith2bitLengthValue,
                    packer: shared_1.packUnsignedIntWith2bitLengthValue,
                },
                { name: "unknown2", type: "boolean", defaultValue: 0 },
                { name: "unknown3", type: "boolean", defaultValue: 0 },
                { name: "unknown4", type: "boolean", defaultValue: 0 },
                { name: "unknown5", type: "boolean", defaultValue: 0 },
                { name: "unknown6", type: "boolean", defaultValue: 0 },
                { name: "unknown7", type: "uint32", defaultValue: 0 },
                { name: "unknown8", type: "uint32", defaultValue: 0 },
                {
                    name: "vector1",
                    type: "floatvector4",
                    defaultValue: [0, 0, 0, 1],
                },
            ],
        },
    ],
    [
        "ClientUpdate.MovementVersion",
        0x112600,
        {
            fields: [{ name: "version", type: "uint32", defaultValue: 0 }],
        },
    ],
    [
        "ClientUpdate.ManagedMovementVersion",
        0x112700,
        {
            fields: [
                {
                    name: "version",
                    type: "custom",
                    parser: shared_1.readUnsignedIntWith2bitLengthValue,
                    packer: shared_1.packUnsignedIntWith2bitLengthValue,
                },
                { name: "movementVersion", type: "uint8", defaultValue: 1 },
            ],
        },
    ],
    [
        "ClientUpdate.UpdateWeaponAddClips",
        0x112800,
        {
            fields: [
                { name: "unknownDword1", type: "uint32", defaultValue: 0 },
                { name: "unknownByte1", type: "uint8", defaultValue: 0 },
                { name: "unknownFloat1", type: "float", defaultValue: 0.0 },
            ],
        },
    ],
    ["ClientUpdate.SpotProbation", 0x112900, {}],
    [
        "ClientUpdate.DailyRibbonCount",
        0x112a00,
        {
            fields: [
                { name: "unknownDword1", type: "uint32", defaultValue: 0 },
                { name: "unknownDword2", type: "uint32", defaultValue: 0 },
                { name: "unknownBoolean1", type: "boolean", defaultValue: 0 },
            ],
        },
    ],
    [
        "ClientUpdate.DespawnNpcUpdate",
        0x112c00,
        {
            fields: [
                { name: "characterId", type: "uint64string", defaultValue: "0" },
                { name: "timeBeforeDespawn", type: "uint32", defaultValue: 0 },
            ],
        },
    ],
    // ["ClientUpdate.LoyaltyPoints", 0x112c00, {}],
    ["ClientUpdate.Membership", 0x112d00, {}],
    ["ClientUpdate.ResetMissionRespawnTimer", 0x112e00, {}],
    [
        "ClientUpdate.Freeze",
        0x112f00,
        {
            fields: [{ name: "frozen", type: "uint8", defaultValue: 1 }], // 0 unfreeze jump & > 1 freeze jump ( don't know how it was used )
        },
    ],
    ["ClientUpdate.InGamePurchaseResult", 0x113000, {}],
    ["ClientUpdate.QuizComplete", 0x113100, {}],
    [
        "ClientUpdate.StartTimer",
        0x113200,
        {
            fields: [
                { name: "stringId", type: "uint32", defaultValue: 0 },
                { name: "time", type: "uint32", defaultValue: 10000 },
                { name: "message", type: "string", defaultValue: "hello" },
            ],
        },
    ],
    [
        "ClientUpdate.CompleteLogoutProcess",
        0x113300,
        {
            fields: [],
        },
    ],
    [
        "ClientUpdate.ProximateItems",
        0x113400,
        {
            fields: [
                {
                    name: "items",
                    type: "array",
                    defaultValue: [],
                    fields: [
                        { name: "itemDefId", type: "uint32", defaultValue: 6 },
                        {
                            name: "itemData",
                            type: "schema",
                            defaultValue: {},
                            fields: shared_2.itemDataSchema,
                        },
                        {
                            name: "unknownQword1",
                            type: "uint64string",
                            defaultValue: "0x0",
                        },
                    ],
                },
            ],
        },
    ],
    [
        "ClientUpdate.TextAlert",
        0x113500,
        {
            fields: [{ name: "message", type: "string", defaultValue: "hello" }],
        },
    ],
    ["ClientUpdate.ClearEntitlementValues", 0x113600, []],
    ["ClientUpdate.AddEntitlementValue", 0x113700, []],
];
//# sourceMappingURL=clientUpdate.js.map