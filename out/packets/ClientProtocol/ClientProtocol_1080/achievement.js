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
exports.achievementPackets = void 0;
const shared_1 = require("./shared");
exports.achievementPackets = [
    [
        "Achievement.Add",
        0x6602,
        {
            fields: [
                { name: "achievementId", type: "uint32", defaultValue: 0 },
                {
                    name: "achievementData",
                    type: "schema",
                    fields: shared_1.objectiveSchema,
                },
            ],
        },
    ],
    [
        "Achievement.Initialize",
        0x6603,
        {
            fields: [
                {
                    name: "clientAchievements",
                    type: "array",
                    defaultValue: [{}],
                    fields: shared_1.achievementSchema,
                },
                {
                    name: "achievementData",
                    type: "byteswithlength",
                    fields: [
                        {
                            name: "achievements",
                            type: "array",
                            defaultValue: [{}],
                            fields: shared_1.achievementSchema,
                        },
                    ],
                },
            ],
        },
    ],
    ["Achievement.Complete", 0x6604, {}],
    ["Achievement.ObjectiveAdded", 0x6605, {}],
    ["Achievement.ObjectiveActivated", 0x6606, {}],
    ["Achievement.ObjectiveUpdate", 0x6607, {}],
    ["Achievement.ObjectiveComplete", 0x6608, {}],
];
//# sourceMappingURL=achievement.js.map