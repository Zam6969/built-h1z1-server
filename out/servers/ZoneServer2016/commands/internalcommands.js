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
exports.internalCommands = void 0;
/* eslint-disable @typescript-eslint/no-unused-vars */
const enums_1 = require("../models/enums");
const vehicle_1 = require("../entities/vehicle");
const types_1 = require("./types");
exports.internalCommands = [
    //#region DEFAULT PERMISSIONS
    {
        name: "respawn",
        permissionLevel: types_1.PermissionLevels.DEFAULT,
        execute: (server, client, packetData) => {
            server.respawnPlayer(client);
        },
    },
    {
        name: "spectate",
        permissionLevel: types_1.PermissionLevels.ADMIN,
        execute: (server, client, packetData) => {
            client.character.isSpectator = true;
            const characterId = server.generateGuid();
            const vehicle = new vehicle_1.Vehicle2016(characterId, server.getTransientId(characterId), 9371, client.character.state.position, client.character.state.lookAt, server, server.getGameTime(), enums_1.VehicleIds.SPECTATE);
            for (const a in server._clients) {
                const iteratedClient = server._clients[a];
                if (iteratedClient.spawnedEntities.includes(client.character)) {
                    server.sendData(iteratedClient, "Character.RemovePlayer", {
                        characterId: client.character.characterId,
                    });
                    iteratedClient.spawnedEntities.splice(iteratedClient.spawnedEntities.indexOf(client.character), 1);
                }
            }
            server.sendData(client, "SpectatorBase", {});
            server.sendData(client, "AddLightweightVehicle", {
                ...vehicle,
                npcData: {
                    ...vehicle,
                    ...vehicle.state,
                    actorModelId: vehicle.actorModelId,
                },
            });
            server.sendData(client, "Mount.MountResponse", {
                characterId: client.character.characterId,
                vehicleGuid: vehicle.characterId,
                seatId: 0,
                isDriver: 1,
                identity: {},
            });
            server.sendData(client, "Character.ManagedObject", {
                objectCharacterId: vehicle.characterId,
                characterId: client.character.characterId,
            });
            server.sendData(client, "ClientUpdate.ManagedObjectResponseControl", {
                control: true,
                objectCharacterId: vehicle.characterId,
            });
        },
    },
    {
        name: "run",
        permissionLevel: types_1.PermissionLevels.ADMIN,
        execute: (server, client, packetData) => {
            server.sendData(client, "Command.RunSpeed", {
                runSpeed: packetData.runSpeed,
            });
        },
    },
    {
        name: "vehicle",
        permissionLevel: types_1.PermissionLevels.ADMIN,
        execute: (server, client, packetData) => {
            const allowedIds = [
                enums_1.VehicleIds.POLICECAR,
                enums_1.VehicleIds.PICKUP,
                enums_1.VehicleIds.ATV,
                enums_1.VehicleIds.OFFROADER,
            ];
            if (!allowedIds.includes(packetData.vehicleId)) {
                server.sendChatText(client, "[ERROR] Invalid vehicleId, please choose one of listed below:");
                server.sendChatText(client, `OFFROADER: ${enums_1.VehicleIds.OFFROADER}, PICKUP: ${enums_1.VehicleIds.PICKUP}, POLICECAR: ${enums_1.VehicleIds.POLICECAR}, ATV: ${enums_1.VehicleIds.ATV}`);
                return;
            }
            const characterId = server.generateGuid();
            const vehicle = new vehicle_1.Vehicle2016(characterId, server.getTransientId(characterId), 0, packetData.position, client.character.state.lookAt, server, server.getGameTime(), packetData.vehicleId);
            server.worldObjectManager.createVehicle(server, vehicle);
            client.character.ownedVehicle = vehicle.characterId;
        },
    },
];
//# sourceMappingURL=internalcommands.js.map