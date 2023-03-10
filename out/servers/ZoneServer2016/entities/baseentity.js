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
exports.BaseEntity = void 0;
function getRenderDistance(actorModelId) {
    let range = 0;
    switch (actorModelId) {
        case 9115: // tamper
            range = 1000;
            break;
        case 9492: // expansion
        case 9181: // shack door
        case 9180: // metal shack
        case 9192: // small shack
        case 55: // dew collector
        case 9223: // wood shack
        case 63: // wood shack door
            range = 500;
            break;
        case 9487: // ramp
            range = 450;
            break;
        case 9488: // foundation stairs
        case 49: // metal gate
        case 50: // metal wall
        case 9407: // upper metal wall
        case 51: // shelter
        case 52: // large shelter
        case 9408: // upper level shelter
        case 9411: // upper level large shelter
        case 53: // structure stairs
        case 9493: // tower
        case 9130: // foundation, lod distance is 2250, tho i dont think we need it to be that high
            range = 750;
            break;
    }
    return range ? range : undefined;
}
class BaseEntity {
    constructor(characterId, transientId, actorModelId, position, rotation, server) {
        this.scale = new Float32Array([1, 1, 1, 1]);
        this.characterId = characterId;
        this.transientId = transientId;
        this.actorModelId = actorModelId;
        this.state = {
            position: position,
            rotation: rotation,
        };
        this.npcRenderDistance = getRenderDistance(actorModelId);
        server.pushToGridCell(this);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    damage(server, damageInfo) {
        // default: do nothing
    }
    /* eslint-disable @typescript-eslint/no-unused-vars */
    OnPlayerSelect(server, client, isInstant) {
        // default: do nothing
    }
    /* eslint-enable @typescript-eslint/no-unused-vars */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    OnInteractionString(server, client) {
        // default: do nothing
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    OnProjectileHit(server, damageInfo) {
        // default: do nothing
    }
}
exports.BaseEntity = BaseEntity;
//# sourceMappingURL=baseentity.js.map