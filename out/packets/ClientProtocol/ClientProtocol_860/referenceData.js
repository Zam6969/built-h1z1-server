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
exports.referenceDataPackets = void 0;
const shared_1 = require("./shared");
const shared_2 = require("./shared");
exports.referenceDataPackets = [
    ["ReferenceData.ItemClassDefinitions", 0x1701, {}],
    ["ReferenceData.ItemCategoryDefinitions", 0x1702, {}],
    [
        "ReferenceData.ClientProfileData",
        0x1703,
        {
            fields: [
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
        "ReferenceData.WeaponDefinitions",
        0x1704,
        {
            fields: [{ name: "data", type: "byteswithlength" }],
        },
    ],
    ["ReferenceData.ProjectileDefinitions", 0x1705, {}],
    [
        "ReferenceData.VehicleDefinitions",
        0x1706,
        {
            fields: [
                {
                    name: "data",
                    type: "custom",
                    parser: shared_1.parseVehicleReferenceData,
                    packer: shared_1.packVehicleReferenceData,
                },
            ],
        },
    ],
];
//# sourceMappingURL=referenceData.js.map