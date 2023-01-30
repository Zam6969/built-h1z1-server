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
exports.ZoneClient2016 = void 0;
const utils_1 = require("../../../utils/utils");
const character_1 = require("../entities/character");
class ZoneClient2016 {
    constructor(sessionId, soeClientId, loginSessionId, characterId, transientId, server) {
        this.firstLoading = false;
        this.isLoading = true;
        this.characterReleased = false;
        this.isInteracting = false;
        this.isAdmin = false;
        this.isDebugMode = false;
        this.banType = "";
        this.HWID = "";
        this.posAtLastRoutine = new Float32Array();
        this.posAtLogoutStart = new Float32Array();
        this.oldPos = {
            position: new Float32Array(),
            time: 0,
        };
        this.speedWarnsNumber = 0;
        this.allowedProjectiles = 0;
        this.pvpStats = { shotsFired: 0, shotsHit: 0, head: 0, spine: 0, legs: 0, hands: 0 };
        this.clientLogs = [];
        this.reports = 0;
        this.spawnedDTOs = [];
        this.spawnedEntities = [];
        this.searchedProps = [];
        this.managedObjects = [];
        this.vehicle = {};
        this.radio = false;
        this.lastKeepAliveTime = 0;
        this.pings = [];
        this.avgPing = 0;
        this.avgPingLen = 4;
        this.pingWarnings = 0;
        this.isWeaponLock = false;
        this.avgPingReady = false;
        this.chunkRenderDistance = 400;
        this.routineCounter = 0;
        this.sessionId = sessionId;
        this.soeClientId = soeClientId;
        this.isLoading = true;
        this.firstLoading = true;
        this.loginSessionId = loginSessionId;
        this.spawnedEntities = [];
        this.managedObjects = [];
        this.clearTimers = () => {
            clearTimeout(this.npcsToSpawnTimer);
        };
        this.clearHudTimer = () => {
            if (this.hudTimer) {
                clearTimeout(this.hudTimer);
            }
            this.hudTimer = null;
            this.isInteracting = false;
        };
        this.character = new character_1.Character2016(characterId, transientId, server);
    }
    addPing(ping) {
        if (ping > 0) {
            this.pings.push(ping);
        }
        if (this.pings.length > this.avgPingLen) {
            this.pings.shift();
        }
        if (this.pings.length === this.avgPingLen) {
            this.updateAvgPing();
        }
        else {
            this.avgPingReady = false;
        }
    }
    updateAvgPing() {
        this.avgPing = (0, utils_1.toInt)(utils_1._.sum(this.pings) / this.pings.length);
        this.avgPingReady = true;
    }
}
exports.ZoneClient2016 = ZoneClient2016;
//# sourceMappingURL=zoneclient.js.map