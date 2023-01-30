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
exports.Vehicle = void 0;
const utils_1 = require("../../../utils/utils");
function getVehicleId(ModelId) {
    switch (ModelId) {
        case 7225:
            return 1;
        case 9301:
            return 3;
        case 9258:
            return 2;
        case 9374:
            return 13;
        case 9371:
            return 1337;
        default:
            return 1;
    }
}
function getVehicleType(ModelId) {
    switch (ModelId) {
        case 7225:
            return "offroader";
        case 9301:
            return "policecar";
        case 9258:
            return "pickup";
        case 9374:
            return "parachute";
        case 9371:
            return "spectate";
        default:
            return "offroader";
    }
}
class Vehicle {
    constructor(worldId, characterId, transientId, modelId, position, rotation) {
        this.isManaged = false;
        this.destroyedEffect = 0;
        this.engineOn = false;
        this.isLocked = 0;
        this.isInvulnerable = false;
        this.worldId = worldId;
        this.npcData = {
            guid: (0, utils_1.generateRandomGuid)(),
            characterId: characterId,
            transientId: transientId,
            modelId: modelId,
            scale: [1, 1, 1, 1],
            resources: { health: 100000, fuel: 7590 },
            position: position,
            rotation: rotation,
            attachedObject: {},
            vehicleId: getVehicleId(modelId),
            positionUpdateType: 1,
            color: {},
            unknownArray1: [],
            destroyedState: 0,
            array5: [{ unknown1: 0 }],
            array17: [{ unknown1: 0 }],
            array18: [{ unknown1: 0 }],
        };
        this.unknownGuid1 = (0, utils_1.generateRandomGuid)();
        this.positionUpdate = {};
        this.seat = {
            seat1: false,
            seat2: false,
            seat3: false,
            seat4: false,
        };
        this.passengers = {};
        this.vehicleType = getVehicleType(modelId);
    }
}
exports.Vehicle = Vehicle;
//# sourceMappingURL=vehicle.js.map