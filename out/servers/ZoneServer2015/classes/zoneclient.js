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
exports.ZoneClient = void 0;
const character_1 = require("./character");
class ZoneClient {
    constructor(sessionId, soeClientId, loginSessionId, characterId, generatedTransient) {
        this.firstLoading = false;
        this.isLoading = true;
        this.isInteracting = false;
        this.isAdmin = false;
        this.posAtLastRoutine = new Float32Array();
        this.posAtLogoutStart = new Float32Array();
        this.spawnedDTOs = [];
        this.spawnedEntities = [];
        this.managedObjects = [];
        this.npcsToSpawn = [];
        this.sessionId = sessionId;
        this.soeClientId = soeClientId;
        this.isLoading = true;
        this.firstLoading = true;
        this.loginSessionId = loginSessionId;
        this.vehicle = {
            vehicleState: 0,
            falling: -1,
            vehicleSeat: 0,
        };
        this.character = new character_1.Character(characterId, generatedTransient);
        this.spawnedEntities = [];
        this.managedObjects = [];
        this.clearTimers = () => {
            clearTimeout(this.npcsToSpawnTimer);
        };
        this.clearHudTimer = () => {
            clearTimeout(this.hudTimer);
            this.hudTimer = null;
            this.isInteracting = false;
        };
    }
}
exports.ZoneClient = ZoneClient;
//# sourceMappingURL=zoneclient.js.map