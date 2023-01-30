"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
/* eslint-disable @typescript-eslint/no-unused-vars */
// TODO enable @typescript-eslint/no-unused-vars
const debug = require("debug")("zonepacketHandlers");
const utils_1 = require("../../../utils/utils");
const admin = {
    list: function (server, client, args) {
        server.sendChatText(client, `/admin commands list: \n/admin ${Object.keys(this).join("\n/admin ")}`);
    },
    shutdown: async function (server, client, args) {
        const timeLeft = args[1] ? args[1] : 0;
        const message = args[2] ? args[2] : " ";
        const startedTime = Date.now();
        await (0, utils_1.zoneShutdown)(server, startedTime, timeLeft, message);
    },
};
exports.default = admin;
//# sourceMappingURL=admin.js.map