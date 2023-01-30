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
exports.Vehicle2016 = void 0;
const utils_1 = require("../../../utils/utils");
const enums_1 = require("../models/enums");
const baselootableentity_1 = require("./baselootableentity");
const loadouts_1 = require("../data/loadouts");
function getActorModelId(vehicleId) {
    switch (vehicleId) {
        case enums_1.VehicleIds.OFFROADER:
            return 7225;
        case enums_1.VehicleIds.PICKUP:
            return 9258;
        case enums_1.VehicleIds.POLICECAR:
            return 9301;
        case enums_1.VehicleIds.ATV:
            return 9588;
        case enums_1.VehicleIds.PARACHUTE:
            return 9374;
        case enums_1.VehicleIds.SPECTATE:
            return 9371;
        default:
            return 7225;
    }
}
function getVehicleName(ModelId) {
    switch (ModelId) {
        case 7225:
            return enums_1.StringIds.OFFROADER;
        case 9258: // pickup
            return enums_1.StringIds.PICKUP_TRUCK;
        case 9301: // policecar
            return enums_1.StringIds.POLICE_CAR;
        case 9588: // atv
            return enums_1.StringIds.ATV;
        default:
            return enums_1.StringIds.OFFROADER;
    }
}
function getVehicleLoadoutId(vehicleId) {
    switch (vehicleId) {
        case enums_1.VehicleIds.OFFROADER:
            return enums_1.LoadoutIds.VEHICLE_OFFROADER;
        case enums_1.VehicleIds.PICKUP:
            return enums_1.LoadoutIds.VEHICLE_PICKUP;
        case enums_1.VehicleIds.POLICECAR:
            return enums_1.LoadoutIds.VEHICLE_POLICECAR;
        case enums_1.VehicleIds.ATV:
            return enums_1.LoadoutIds.VEHICLE_ATV;
        case enums_1.VehicleIds.PARACHUTE:
        case enums_1.VehicleIds.SPECTATE:
        default:
            return 5; // idk if this is right but these vehicles dont have a loadout
    }
}
function getDefaultLoadout(loadoutId) {
    switch (loadoutId) {
        case enums_1.LoadoutIds.VEHICLE_OFFROADER:
            return loadouts_1.vehicleDefaultLoadouts.offroader;
        case enums_1.LoadoutIds.VEHICLE_PICKUP:
            return loadouts_1.vehicleDefaultLoadouts.pickup;
        case enums_1.LoadoutIds.VEHICLE_POLICECAR:
            return loadouts_1.vehicleDefaultLoadouts.policecar;
        case enums_1.LoadoutIds.VEHICLE_ATV:
            return loadouts_1.vehicleDefaultLoadouts.atv;
        default:
            return [];
    }
}
class Vehicle2016 extends baselootableentity_1.BaseLootableEntity {
    constructor(characterId, transientId, actorModelId, position, rotation, server, gameTime, vehicleId) {
        super(characterId, transientId, actorModelId, position, rotation, server);
        this.isManaged = false;
        this.destroyedEffect = 0;
        this.destroyedModel = 0;
        this.minorDamageEffect = 0;
        this.majorDamageEffect = 0;
        this.criticalDamageEffect = 0;
        this.supercriticalDamageEffect = 0;
        this.engineOn = false;
        this.isLocked = 0;
        this.engineRPM = 0;
        this.isInvulnerable = false;
        this.seats = {};
        this.destroyedState = 0;
        this.positionUpdateType = 1;
        this.currentDamageEffect = 0;
        this._resources = {
            [enums_1.ResourceIds.CONDITION]: 100000,
            [enums_1.ResourceIds.FUEL]: 7590,
        };
        this.state = {
            position: position,
            rotation: rotation,
            lookAt: new Float32Array([0, 0, 0, 1]),
        };
        this.vehicleId = vehicleId;
        if (!this.actorModelId)
            this.actorModelId = getActorModelId(this.vehicleId);
        this.loadoutId = getVehicleLoadoutId(this.vehicleId);
        this.defaultLoadout = getDefaultLoadout(this.loadoutId);
        this.npcRenderDistance = 250;
        this.isInvulnerable =
            this.vehicleId == enums_1.VehicleIds.SPECTATE ||
                this.vehicleId == enums_1.VehicleIds.PARACHUTE;
        switch (this.vehicleId) {
            case enums_1.VehicleIds.OFFROADER:
            case enums_1.VehicleIds.PICKUP:
            case enums_1.VehicleIds.POLICECAR:
                this.seats = {
                    0: "",
                    1: "",
                    2: "",
                    3: "",
                    4: "",
                };
                break;
            case enums_1.VehicleIds.ATV:
                this.seats = {
                    0: "",
                    1: "",
                };
                break;
            default:
                this.seats = {
                    0: "",
                };
                break;
        }
        Object.seal(this.seats); // object can't be edited, but properties can
        this.positionUpdate = {
            ...(0, utils_1.createPositionUpdate)(this.state.position, this.state.rotation, gameTime),
            vehicle: this,
            get position() {
                return this.vehicle.state.position;
            },
        };
        this.nameId = getVehicleName(this.actorModelId);
        switch (this.vehicleId) {
            case enums_1.VehicleIds.PICKUP:
                this.destroyedEffect = 326;
                this.destroyedModel = 9315;
                this.minorDamageEffect = 325;
                this.majorDamageEffect = 324;
                this.criticalDamageEffect = 323;
                this.supercriticalDamageEffect = 5228;
                break;
            case enums_1.VehicleIds.POLICECAR:
                this.destroyedEffect = 286;
                this.destroyedModel = 9316;
                this.minorDamageEffect = 285;
                this.majorDamageEffect = 284;
                this.criticalDamageEffect = 283;
                this.supercriticalDamageEffect = 5229;
                break;
            case enums_1.VehicleIds.ATV:
                this.destroyedEffect = 357;
                this.destroyedModel = 9593;
                this.minorDamageEffect = 360;
                this.majorDamageEffect = 359;
                this.criticalDamageEffect = 358;
                this.supercriticalDamageEffect = 5226;
                break;
            case enums_1.VehicleIds.OFFROADER:
            default:
                this.destroyedEffect = 135;
                this.destroyedModel = 7226;
                this.minorDamageEffect = 182;
                this.majorDamageEffect = 181;
                this.criticalDamageEffect = 180;
                this.supercriticalDamageEffect = 5227;
                break;
        }
    }
    getSeatCount() {
        return Object.keys(this.seats).length;
    }
    getNextSeatId(server) {
        for (const seatId in this.seats) {
            const seat = this.seats[seatId], passenger = seat ? server._characters[seat] : undefined;
            if (!this.seats[seatId] || !passenger?.isAlive) {
                return seatId;
            }
        }
        return -1;
    }
    getCharacterSeat(characterId) {
        for (const seatId in this.seats) {
            if (this.seats[seatId] === characterId) {
                return seatId;
            }
        }
    }
    getPassengerList() {
        const passengers = [];
        for (const seatId in this.seats) {
            if (this.seats[seatId]) {
                passengers.push(this.seats[seatId]);
            }
        }
        return passengers;
    }
    removePassenger(characterId) {
        for (const seatId in this.seats) {
            if (this.seats[seatId] === characterId) {
                this.seats[seatId] = "";
                break;
            }
        }
    }
    pGetLightweightVehicle() {
        return {
            npcData: {
                ...this.pGetLightweight(),
                position: this.state.position,
                vehicleId: this.vehicleId,
            },
            positionUpdate: {
                ...this.positionUpdate,
                position: this.state.position, // trying to fix invisible characters/vehicles until they move
            },
        };
    }
    pGetFullVehicle(server) {
        return {
            npcData: {
                ...this.pGetFull(server),
            },
            positionUpdate: {
                ...this.positionUpdate,
                sequenceTime: server.getGameTime(),
                position: this.state.position, // trying to fix invisible characters/vehicles until they move
            },
            unknownArray1: [],
            unknownArray2: [],
            unknownArray3: [],
            unknownArray4: [],
            unknownArray5: [
                {
                    unknownData1: {
                        unknownData1: {},
                    },
                },
            ],
            unknownArray6: [],
            unknownArray7: [],
            unknownArray8: [
                {
                    unknownArray1: [],
                },
            ],
        };
    }
    pGetPassengers(server) {
        return this.getPassengerList().map((passenger) => {
            return {
                characterId: passenger,
                identity: {
                    characterName: server._characters[passenger].name,
                },
                unknownString1: server._characters[passenger].name,
                unknownByte1: 1,
            };
        });
    }
    getInventoryItemId() {
        switch (this.loadoutId) {
            case enums_1.LoadoutIds.VEHICLE_OFFROADER:
                return enums_1.Items.VEHICLE_CONTAINER_OFFROADER;
            case enums_1.LoadoutIds.VEHICLE_PICKUP:
                return enums_1.Items.VEHICLE_CONTAINER_PICKUP;
            case enums_1.LoadoutIds.VEHICLE_POLICECAR:
                return enums_1.Items.VEHICLE_CONTAINER_POLICECAR;
            case enums_1.LoadoutIds.VEHICLE_ATV:
                return enums_1.Items.VEHICLE_CONTAINER_ATV;
            default:
                return 0;
        }
    }
    getTurboItemId() {
        switch (this.loadoutId) {
            case enums_1.LoadoutIds.VEHICLE_OFFROADER:
                return enums_1.Items.TURBO_OFFROADER;
            case enums_1.LoadoutIds.VEHICLE_PICKUP:
                return enums_1.Items.TURBO_PICKUP;
            case enums_1.LoadoutIds.VEHICLE_POLICECAR:
                return enums_1.Items.TURBO_POLICE;
            case enums_1.LoadoutIds.VEHICLE_ATV:
                return enums_1.Items.TURBO_ATV;
            default:
                return 0;
        }
    }
    getHeadlightsItemId() {
        switch (this.loadoutId) {
            case enums_1.LoadoutIds.VEHICLE_OFFROADER:
                return enums_1.Items.HEADLIGHTS_OFFROADER;
            case enums_1.LoadoutIds.VEHICLE_PICKUP:
                return enums_1.Items.HEADLIGHTS_PICKUP;
            case enums_1.LoadoutIds.VEHICLE_POLICECAR:
                return enums_1.Items.HEADLIGHTS_POLICE;
            case enums_1.LoadoutIds.VEHICLE_ATV:
                return enums_1.Items.HEADLIGHTS_ATV;
            default:
                return 0;
        }
    }
    getMotorItemId() {
        switch (this.loadoutId) {
            case enums_1.LoadoutIds.VEHICLE_OFFROADER:
                return enums_1.Items.VEHICLE_MOTOR_OFFROADER;
            case enums_1.LoadoutIds.VEHICLE_PICKUP:
                return enums_1.Items.VEHICLE_MOTOR_PICKUP;
            case enums_1.LoadoutIds.VEHICLE_POLICECAR:
                return enums_1.Items.VEHICLE_MOTOR_POLICECAR;
            case enums_1.LoadoutIds.VEHICLE_ATV:
                return enums_1.Items.VEHICLE_MOTOR_ATV;
            default:
                return 0;
        }
    }
    startDamageDelay(server) {
        this.damageTimeout = setTimeout(() => {
            this.damage(server, { entity: "", damage: 1000 });
            if (this._resources[enums_1.ResourceIds.CONDITION] < 20000 &&
                this._resources[enums_1.ResourceIds.CONDITION] > 0) {
                this.damageTimeout.refresh();
            }
            else {
                delete this.damageTimeout;
            }
        }, 1000);
    }
    damage(server, damageInfo) {
        if (this.isInvulnerable)
            return;
        const oldHealth = this._resources[enums_1.ResourceIds.CONDITION];
        this._resources[enums_1.ResourceIds.CONDITION] -= damageInfo.damage;
        const client = server.getClientByCharId(damageInfo.entity);
        if (client) {
            client.character.addCombatlogEntry(server.generateDamageRecord(this.characterId, damageInfo, oldHealth));
        }
        if (this._resources[enums_1.ResourceIds.CONDITION] <= 0) {
            this.destroy(server);
        }
        else {
            let damageeffect = 0;
            let allowSend = false;
            let startDamageTimeout = false;
            if (this._resources[enums_1.ResourceIds.CONDITION] <= 50000 &&
                this._resources[enums_1.ResourceIds.CONDITION] > 35000) {
                if (this.destroyedState != 1) {
                    damageeffect = this.minorDamageEffect;
                    allowSend = true;
                    this.destroyedState = 1;
                }
            }
            else if (this._resources[enums_1.ResourceIds.CONDITION] <= 35000 &&
                this._resources[enums_1.ResourceIds.CONDITION] > 20000) {
                if (this.destroyedState != 2) {
                    damageeffect = this.majorDamageEffect;
                    allowSend = true;
                    this.destroyedState = 2;
                }
            }
            else if (this._resources[enums_1.ResourceIds.CONDITION] <= 20000 &&
                this._resources[enums_1.ResourceIds.CONDITION] > 10000) {
                if (this.destroyedState != 3) {
                    damageeffect = this.criticalDamageEffect;
                    allowSend = true;
                    startDamageTimeout = true;
                    this.destroyedState = 3;
                }
            }
            else if (this._resources[enums_1.ResourceIds.CONDITION] <= 10000) {
                if (this.destroyedState != 4) {
                    damageeffect = this.supercriticalDamageEffect;
                    allowSend = true;
                    startDamageTimeout = true;
                    this.destroyedState = 4;
                }
            }
            else if (this._resources[enums_1.ResourceIds.CONDITION] > 50000 &&
                this.destroyedState != 0) {
                this.destroyedState = 0;
                damageeffect = 0;
                this.currentDamageEffect = 0;
                allowSend = true;
            }
            if (allowSend) {
                this.currentDamageEffect = damageeffect;
                server.sendDataToAllWithSpawnedEntity(server._vehicles, this.characterId, "Command.PlayDialogEffect", {
                    characterId: this.characterId,
                    effectId: damageeffect,
                });
                if (!this.damageTimeout && startDamageTimeout) {
                    this.startDamageDelay(server);
                }
            }
            server.updateResourceToAllWithSpawnedEntity(this.characterId, this._resources[enums_1.ResourceIds.CONDITION], enums_1.ResourceIds.CONDITION, enums_1.ResourceTypes.CONDITION, server._vehicles);
        }
    }
    /* eslint-disable @typescript-eslint/no-unused-vars */
    OnPlayerSelect(server, client, isInstant
    /* eslint-enable @typescript-eslint/no-unused-vars */
    ) {
        !client.vehicle.mountedVehicle
            ? server.mountVehicle(client, this.characterId)
            : server.dismountVehicle(client);
    }
    OnInteractionString(server, client) {
        if (!client.vehicle.mountedVehicle) {
            server.sendData(client, "Command.InteractionString", {
                guid: this.characterId,
                stringId: 15,
            });
        }
    }
    OnFullCharacterDataRequest(server, client) {
        if (this.vehicleId == enums_1.VehicleIds.SPECTATE ||
            this.vehicleId == enums_1.VehicleIds.PARACHUTE)
            return;
        server.sendData(client, "LightweightToFullVehicle", this.pGetFullVehicle(server));
        this.updateLoadout(server);
        // fix seat change crash related to our managed object workaround
        if (this.droppedManagedClient == client) {
            const seatId = this.getCharacterSeat(client.character.characterId);
            server.sendData(client, "Mount.MountResponse", {
                characterId: client.character.characterId,
                vehicleGuid: this.characterId,
                seatId: seatId,
                isDriver: seatId === "0" ? 1 : 0,
                identity: {},
            });
            delete this.droppedManagedClient;
        }
        // prevents cars from spawning in under the map for other characters
        /*
        server.sendData(client, "PlayerUpdatePosition", {
          transientId: vehicle.transientId,
          positionUpdate: vehicle.positionUpdate,
        });
        */
        server.sendData(client, "ResourceEvent", {
            eventData: {
                type: 1,
                value: {
                    characterId: this.characterId,
                    characterResources: this.pGetResources(),
                },
            },
        });
        // disable this workaround for now
        /*for (const a in this.seats) {
          const seatId = this.getCharacterSeat(this.seats[a]);
          if (!this.seats[a]) continue;
          server.sendData(client, "Mount.MountResponse", {
            // mounts character
            characterId: this.seats[a],
            vehicleGuid: this.characterId, // vehicle guid
            seatId: seatId,
            unknownDword3: seatId === "0" ? 1 : 0, //isDriver
            identity: {},
          });
        }*/
        if (this.currentDamageEffect != 0) {
            server.sendData(client, "Command.PlayDialogEffect", {
                characterId: this.characterId,
                effectId: this.currentDamageEffect,
            });
        }
        if (this.engineOn) {
            server.sendData(client, "Vehicle.Engine", {
                guid2: this.characterId,
                engineOn: true,
            });
        }
        if (this.onReadyCallback) {
            this.onReadyCallback(client);
            delete this.onReadyCallback;
        }
    }
    destroy(server, disableExplosion = false) {
        if (!server._vehicles[this.characterId])
            return;
        this._resources[enums_1.ResourceIds.CONDITION] = 0;
        for (const c in server._clients) {
            if (this.characterId === server._clients[c].vehicle.mountedVehicle) {
                server.dismountVehicle(server._clients[c]);
            }
        }
        server.sendDataToAllWithSpawnedEntity(server._vehicles, this.characterId, "Character.Destroyed", {
            characterId: this.characterId,
            destroyedEffect: this.destroyedEffect,
            destroyedModel: this.destroyedModel,
            unknown3: 0,
            disableWeirdPhysics: false,
        });
        server.deleteEntity(this.characterId, server._vehicles);
        if (!disableExplosion) {
            server.explosionDamage(this.state.position, this.characterId);
        }
        this.state.position[1] -= 0.4;
        // fix floating vehicle lootbags
        Object.values(this._loadout).forEach((item) => {
            delete this._loadout[item.slotId];
        });
        // delete vehicle loadout parts from lootbag
        server.worldObjectManager.createLootbag(server, this);
    }
}
exports.Vehicle2016 = Vehicle2016;
//# sourceMappingURL=vehicle.js.map