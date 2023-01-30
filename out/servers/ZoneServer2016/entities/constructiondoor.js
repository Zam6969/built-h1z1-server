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
exports.ConstructionDoor = void 0;
const doorentity_1 = require("./doorentity");
const enums_1 = require("../models/enums");
const utils_1 = require("../../../utils/utils");
function getDamageRange(definitionId) {
    switch (definitionId) {
        case enums_1.Items.METAL_GATE:
            return 4.3;
        case enums_1.Items.DOOR_WOOD:
        case enums_1.Items.DOOR_METAL:
        case enums_1.Items.DOOR_BASIC:
            return 1.5;
        default:
            return 1.5;
    }
}
class ConstructionDoor extends doorentity_1.DoorEntity {
    constructor(characterId, transientId, actorModelId, position, rotation, server, itemDefinitionId, ownerCharacterId, parentObjectCharacterId, slot) {
        super(characterId, transientId, actorModelId, position, rotation, server, new Float32Array([1, 1, 1, 1]), 0);
        this.passwordHash = 0;
        this.grantedAccess = [];
        this.health = 1000000;
        this.placementTime = Date.now();
        this.isSecured = true;
        this.ownerCharacterId = ownerCharacterId;
        this.itemDefinitionId = itemDefinitionId;
        this.parentObjectCharacterId = parentObjectCharacterId;
        this.slot = slot;
        this.profileId = 999; /// mark as construction
        this.damageRange = getDamageRange(this.itemDefinitionId);
        this.fixedPosition = (0, utils_1.movePoint)(this.state.position, -this.openAngle, this.itemDefinitionId == enums_1.Items.DOOR_METAL ||
            this.itemDefinitionId == enums_1.Items.DOOR_WOOD
            ? 0.625
            : 2.5);
        const itemDefinition = server.getItemDefinition(this.itemDefinitionId);
        if (itemDefinition)
            this.nameId = itemDefinition.NAME_ID;
        this.grantedAccess.push(ownerCharacterId);
        this.npcRenderDistance = 750;
    }
    pGetConstructionHealth() {
        return {
            characterId: this.characterId,
            health: this.health / 10000,
        };
    }
    damage(server, damageInfo) {
        // todo: redo this
        this.health -= damageInfo.damage;
    }
    destroy(server, destructTime = 0) {
        server.deleteEntity(this.characterId, server._constructionDoors, 242, destructTime);
        const parent = this.getParent(server);
        if (!parent)
            return;
        if (parent.freeplaceEntities[this.characterId]) {
            delete parent.freeplaceEntities[this.characterId];
        }
        let slotMap, updateSecured = false;
        switch (this.itemDefinitionId) {
            case enums_1.Items.METAL_GATE:
            case enums_1.Items.DOOR_BASIC:
            case enums_1.Items.DOOR_WOOD:
            case enums_1.Items.DOOR_METAL:
                slotMap = parent.occupiedWallSlots;
                updateSecured = true;
                break;
        }
        if (slotMap)
            parent.clearSlot(this.getSlotNumber(), slotMap);
        if (updateSecured)
            parent.updateSecuredState(server);
    }
    canUndoPlacement(server, client) {
        return (this.getHasPermission(server, client.character.characterId, enums_1.ConstructionPermissionIds.BUILD) &&
            Date.now() < this.placementTime + 120000 &&
            client.character.getEquippedWeapon().itemDefinitionId ==
                enums_1.Items.WEAPON_HAMMER_DEMOLITION);
    }
    getParent(server) {
        return (server._constructionSimple[this.parentObjectCharacterId] ||
            server._constructionFoundations[this.parentObjectCharacterId]);
    }
    getParentFoundation(server) {
        const parent = this.getParent(server);
        if (!parent)
            return;
        if (server._constructionSimple[parent.characterId]) {
            return server._constructionSimple[parent.characterId].getParentFoundation(server);
        }
        return server._constructionFoundations[parent.characterId];
    }
    getHasPermission(server, characterId, permission) {
        return (this.getParentFoundation(server)?.getHasPermission(server, characterId, permission) || false);
    }
    getSlotNumber() {
        if (!this.slot)
            return 0;
        return (0, utils_1.getConstructionSlotId)(this.slot);
    }
    OnPlayerSelect(server, client, isInstant) {
        if (this.canUndoPlacement(server, client)) {
            this.destroy(server);
            client.character.lootItem(server, server.generateItem(this.itemDefinitionId));
            return;
        }
        if (isInstant) {
            if (this.passwordHash == 0 ||
                this.grantedAccess.includes(client.character.characterId) ||
                client.character.characterId === this.ownerCharacterId ||
                (client.isAdmin && client.isDebugMode) // debug mode open all doors/gates
            ) {
                if (this.moving) {
                    return;
                }
                this.moving = true;
                // eslint-disable-next-line
                const door = this; // for setTimeout callback
                setTimeout(function () {
                    door.moving = false;
                }, 1000);
                server.sendDataToAllWithSpawnedEntity(server._constructionDoors, this.characterId, "PlayerUpdatePosition", {
                    transientId: this.transientId,
                    positionUpdate: {
                        sequenceTime: 0,
                        unknown3_int8: 0,
                        position: this.state.position,
                        orientation: this.isOpen ? this.closedAngle : this.openAngle,
                    },
                });
                server.sendDataToAllWithSpawnedEntity(server._constructionDoors, this.characterId, "Command.PlayDialogEffect", {
                    characterId: this.characterId,
                    effectId: this.isOpen ? this.closeSound : this.openSound,
                });
                this.isOpen = !this.isOpen;
                this.isSecured = !this.isOpen;
                const parent = this.getParent(server);
                if (parent) {
                    parent.updateSecuredState(server);
                    // spawn hidden characters emmediately after door opens
                    const allowedConstruction = [
                        enums_1.Items.SHELTER,
                        enums_1.Items.SHELTER_LARGE,
                        enums_1.Items.SHELTER_UPPER,
                        enums_1.Items.SHELTER_UPPER_LARGE,
                        enums_1.Items.SHACK,
                        enums_1.Items.SHACK_BASIC,
                        enums_1.Items.SHACK_SMALL,
                    ];
                    if (this.isOpen &&
                        allowedConstruction.includes(parent.itemDefinitionId)) {
                        for (const a in server._clients) {
                            const client = server._clients[a];
                            if (client.character.isHidden == parent.characterId)
                                server.constructionManager(client);
                        }
                    }
                }
                return;
            }
            else {
                server.sendData(client, "Locks.ShowMenu", {
                    characterId: client.character.characterId,
                    unknownDword1: 2,
                    lockType: 2,
                    objectCharacterId: this.characterId,
                });
                return;
            }
        }
        else if (!isInstant) {
            if (client.character.characterId === this.ownerCharacterId) {
                server.sendData(client, "Locks.ShowMenu", {
                    characterId: client.character.characterId,
                    unknownDword1: 2,
                    lockType: 1,
                    objectCharacterId: this.characterId,
                });
                return;
            }
            else if (!this.grantedAccess.includes(client.character.characterId)) {
                server.sendData(client, "Locks.ShowMenu", {
                    characterId: client.character.characterId,
                    unknownDword1: 2,
                    lockType: 2,
                    objectCharacterId: this.characterId,
                });
            }
        }
    }
    OnInteractionString(server, client) {
        if (this.canUndoPlacement(server, client)) {
            server.undoPlacementInteractionString(this, client);
            return;
        }
        if (client.character.characterId === this.ownerCharacterId ||
            !this.grantedAccess.includes(client.character.characterId)) {
            server.sendData(client, "Command.InteractionString", {
                guid: this.characterId,
                stringId: enums_1.StringIds.OPEN_AND_LOCK,
            });
        }
        else {
            server.sendData(client, "Command.InteractionString", {
                guid: this.characterId,
                stringId: enums_1.StringIds.OPEN,
            });
        }
    }
}
exports.ConstructionDoor = ConstructionDoor;
//# sourceMappingURL=constructiondoor.js.map