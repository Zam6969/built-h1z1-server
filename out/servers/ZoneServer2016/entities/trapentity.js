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
exports.TrapEntity = void 0;
const utils_1 = require("../../../utils/utils");
const enums_1 = require("../models/enums");
const basesimplenpc_1 = require("./basesimplenpc");
class TrapEntity extends basesimplenpc_1.BaseSimpleNpc {
    constructor(characterId, transientId, actorModelId, position, rotation, server, itemDefinitionId) {
        super(characterId, transientId, actorModelId, position, rotation, server);
        this.isTriggered = false;
        this.npcRenderDistance = 75;
        this.itemDefinitionId = itemDefinitionId;
    }
    arm(server) {
        switch (this.itemDefinitionId) {
            case enums_1.Items.PUNJI_STICKS:
                this.trapTimer = setTimeout(() => {
                    if (!server._traps[this.characterId]) {
                        return;
                    }
                    for (const a in server._clients) {
                        const client = server._clients[a];
                        if ((0, utils_1.getDistance)(client.character.state.position, this.state.position) < 1.5 &&
                            client.character.isAlive &&
                            !client.vehicle.mountedVehicle) {
                            client.character.damage(server, {
                                entity: this.characterId,
                                causeBleed: true,
                                damage: 501,
                            });
                            server.sendDataToAllWithSpawnedEntity(server._traps, this.characterId, "Character.PlayWorldCompositeEffect", {
                                characterId: "0x0",
                                effectId: 5116,
                                position: server._clients[a].character.state.position,
                            });
                            server.sendDataToAllWithSpawnedEntity(server._traps, this.characterId, "Character.UpdateSimpleProxyHealth", this.pGetSimpleProxyHealth());
                            this.health -= 1000;
                        }
                    }
                    if (this.health > 0) {
                        this.trapTimer?.refresh();
                    }
                    else {
                        server.sendDataToAllWithSpawnedEntity(server._traps, this.characterId, "Character.PlayWorldCompositeEffect", {
                            characterId: "0x0",
                            effectId: 163,
                            position: this.state.position,
                        });
                        server.sendDataToAllWithSpawnedEntity(server._traps, this.characterId, "Character.RemovePlayer", {
                            characterId: this.characterId,
                        });
                        delete server._traps[this.characterId];
                        return;
                    }
                }, 500);
                break;
            case enums_1.Items.SNARE:
                this.trapTimer = setTimeout(() => {
                    if (!server._traps[this.characterId]) {
                        return;
                    }
                    for (const a in server._clients) {
                        const client = server._clients[a];
                        if ((0, utils_1.getDistance)(client.character.state.position, this.state.position) < 1) {
                            client.character.damage(server, {
                                entity: this.characterId,
                                damage: 2000,
                            });
                            client.character._resources[enums_1.ResourceIds.BLEEDING] += 41;
                            server.updateResourceToAllWithSpawnedEntity(client.character.characterId, client.character._resources[enums_1.ResourceIds.BLEEDING] > 0
                                ? client.character._resources[enums_1.ResourceIds.BLEEDING]
                                : 0, enums_1.ResourceIds.BLEEDING, enums_1.ResourceTypes.BLEEDING, server._characters);
                            server.sendDataToAllWithSpawnedEntity(server._traps, this.characterId, "Character.PlayWorldCompositeEffect", {
                                characterId: this.characterId,
                                effectId: 1630,
                                position: server._traps[this.characterId].state.position,
                            });
                            this.isTriggered = true;
                            server.applyMovementModifier(client, enums_1.MovementModifiers.SNARED);
                        }
                    }
                    if (!this.isTriggered) {
                        this.trapTimer?.refresh();
                    }
                    else {
                        server.sendDataToAllWithSpawnedEntity(server._traps, this.characterId, "Character.RemovePlayer", {
                            characterId: this.characterId,
                        });
                        this.actorModelId = 1974;
                        server.worldObjectManager.createLootEntity(server, server.generateItem(1415), this.state.position, this.state.rotation, 15);
                        delete server._traps[this.characterId];
                    }
                }, 200);
                break;
        }
    }
}
exports.TrapEntity = TrapEntity;
//# sourceMappingURL=trapentity.js.map