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
exports.H1emuClient = void 0;
class H1emuClient {
    constructor(remote) {
        this.sessionId = 0;
        this.lastPing = 0;
        this.address = remote.address;
        this.port = remote.port;
        this.clientId = `${remote.address}:${remote.port}`;
    }
}
exports.H1emuClient = H1emuClient;
//# sourceMappingURL=h1emuclient.js.map