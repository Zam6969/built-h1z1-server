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
exports.ConstructionParentEntity = void 0;
const constructionchildentity_1 = require("./constructionchildentity");
const enums_1 = require("../models/enums");
const utils_1 = require("../../../utils/utils");
const constructionslots_1 = require("../data/constructionslots");
function getDamageRange(definitionId) {
    switch (definitionId) {
        case enums_1.Items.SHACK:
            return 4.5;
        case enums_1.Items.SHACK_SMALL:
            return 4;
        case enums_1.Items.SHACK_BASIC:
            return 3;
        default:
            return 4.5;
    }
}
class ConstructionParentEntity extends constructionchildentity_1.ConstructionChildEntity {
    constructor(characterId, transientId, actorModelId, position, rotation, server, itemDefinitionId, ownerCharacterId, ownerName, parentObjectCharacterId, BuildingSlot, overrideEulerAngle) {
        super(characterId, transientId, actorModelId, position, rotation, server, itemDefinitionId, parentObjectCharacterId, "", overrideEulerAngle);
        this.permissions = {};
        this.expansionSlots = {};
        this.occupiedExpansionSlots = {};
        this.rampSlots = {};
        this.occupiedRampSlots = {};
        this.health = 1000000;
        this.ownerCharacterId = ownerCharacterId;
        const ownerPermission = {
            characterId: ownerCharacterId,
            characterName: ownerName,
            useContainers: true,
            build: true,
            demolish: true,
            visit: true,
        };
        this.itemDefinitionId = itemDefinitionId;
        this.permissions[ownerPermission.characterId] = ownerPermission;
        this.parentObjectCharacterId = parentObjectCharacterId;
        this.slot = BuildingSlot || "";
        this.damageRange = getDamageRange(this.itemDefinitionId);
        switch (this.itemDefinitionId) {
            case enums_1.Items.GROUND_TAMPER:
                this.bounds = this.getSquareBounds([1, 5, 9, 13]);
                break;
            case enums_1.Items.FOUNDATION:
                this.bounds = this.getSquareBounds([1, 4, 7, 10]);
                break;
            case enums_1.Items.FOUNDATION_EXPANSION: // 1, 2, 5, 3RD dependent foundation wall
                const bounds = this.getSquareBounds([1, 2, 5, 0]), parent = this.getParentFoundation(server);
                if (parent) {
                    // get 3rd dependent foundation wall pos
                    const dependentWallPos = parent.getSlotPosition(this.getDependentWalls()[2], parent.wallSlots), dependentWallRot = parent.getSlotRotation(this.getDependentWalls()[2], parent.wallSlots);
                    if (dependentWallPos && dependentWallRot) {
                        const point = (0, utils_1.movePoint)(dependentWallPos, -dependentWallRot[0] + (270 * Math.PI) / 180, 5);
                        bounds[3] = [point[0], point[2]];
                        this.bounds = bounds;
                    }
                }
                break;
            case enums_1.Items.SHACK:
            case enums_1.Items.SHACK_SMALL:
            case enums_1.Items.SHACK_BASIC:
                this.bounds = (0, utils_1.getRectangleCorners)(this.state.position, 3.5, 2.5, -this.eulerAngle);
                break;
        }
        (0, utils_1.registerConstructionSlots)(this, this.wallSlots, constructionslots_1.wallSlotDefinitions);
        Object.seal(this.wallSlots);
        (0, utils_1.registerConstructionSlots)(this, this.expansionSlots, constructionslots_1.foundationExpansionSlotDefinitions);
        Object.seal(this.expansionSlots);
        (0, utils_1.registerConstructionSlots)(this, this.rampSlots, constructionslots_1.foundationRampSlotDefinitions);
        Object.seal(this.rampSlots);
        (0, utils_1.registerConstructionSlots)(this, this.shelterSlots, constructionslots_1.shelterSlotDefinitions);
        Object.seal(this.shelterSlots);
        const itemDefinition = server.getItemDefinition(this.itemDefinitionId);
        if (itemDefinition)
            this.nameId = itemDefinition.NAME_ID;
    }
    getOccupiedSlotMaps() {
        return [
            ...super.getOccupiedSlotMaps(),
            this.occupiedExpansionSlots,
            this.occupiedRampSlots,
        ];
    }
    getSquareBounds(slots) {
        const bounds = [
            [0, 0],
            [0, 0],
            [0, 0],
            [0, 0],
        ];
        slots.forEach((slot, idx) => {
            const pos = this.getSlotPosition(slot, this.wallSlots);
            if (pos)
                bounds[idx] = [pos[0], pos[2]];
        });
        return bounds;
    }
    getAdjustedShelterSlotId(buildingSlot) {
        let slot = (0, utils_1.getConstructionSlotId)(buildingSlot);
        if (this.itemDefinitionId == enums_1.Items.GROUND_TAMPER) {
            switch (true) {
                case slot >= 11 && slot <= 14:
                    slot = slot - 6;
                    break;
                case slot >= 21 && slot <= 24:
                    slot = slot - 12;
                    break;
                case slot >= 31 && slot <= 34:
                    slot = slot - 18;
                    break;
            }
        }
        else if (this.itemDefinitionId == enums_1.Items.FOUNDATION) {
            switch (true) {
                case slot >= 11 && slot <= 13:
                    slot = slot - 7;
                    break;
                case slot >= 21 && slot <= 23:
                    slot = slot - 14;
                    break;
            }
        }
        return `Structure${slot > 9 ? slot.toString() : `0${slot.toString()}`}`;
    }
    /**
     * [Deck expansions only] Returns an array containing the parent foundation walls that a given expansion depends on to be secured.
     * @param expansion The expansion to check.
     */
    getDependentWalls() {
        switch (this.getSlotNumber()) {
            case 1:
                return [4, 5, 6];
            case 2:
                return [1, 2, 3];
            case 3:
                return [10, 11, 12];
            case 4:
                return [7, 8, 9];
        }
        return [];
    }
    /**
     * [Deck foundations only] Returns the slotId of an expansion on the same side as a given wall.
     * @param expansion The expansion to check.
     */
    getDependentExpansion(slotId) {
        switch (slotId) {
            case 4:
            case 5:
            case 6:
                return 1;
            case 1:
            case 2:
            case 3:
                return 2;
            case 10:
            case 11:
            case 12:
                return 3;
            case 7:
            case 8:
            case 9:
                return 4;
        }
        return 0; // should never get here
    }
    isSideSecure(side) {
        if (this.itemDefinitionId != enums_1.Items.FOUNDATION)
            return false;
        let secure = true;
        Object.keys(this.wallSlots).forEach((slot) => {
            const wall = this.occupiedWallSlots[Number(slot) + 1];
            if (side == this.getDependentExpansion(Number(slot) + 1) &&
                (!wall || !wall.isSecured)) {
                secure = false;
                return;
            }
        });
        return secure;
    }
    /**
     * Tests if all walls slots of this foundation are occupied and secured.
     * @returns boolean
     */
    getWallsSecured() {
        const wallSlots = Object.values(this.occupiedWallSlots);
        // check if all wall slots are occupied
        if (wallSlots.length != Object.values(this.wallSlots).length) {
            return false;
        }
        // check if any walls are gates / if they're open
        for (const wall of wallSlots) {
            if (!wall.isSecured) {
                return false;
            }
        }
        return true;
    }
    updateSecuredState(server) {
        // doesn't work correctly yet -Meme
        /*
        switch(this.itemDefinitionId) {
          case Items.FOUNDATION:
            for (const expansion of Object.values(this.occupiedExpansionSlots)) {
              expansion.updateSecuredState(server);
            }
            
            for(let i = 1; i < 5; i++) {
              const expansion = this.occupiedExpansionSlots[i];
              if(!this.isSideSecure(i) && (!expansion || !expansion.getWallsSecured())) {
                if(expansion) expansion.isSecured = false;
                this.isSecured = false;
                server.sendAlertToAll("NOT SECURE");
                return;
              }
            }
            server.sendAlertToAll("SECURE");
            this.isSecured = true;
            for (const expansion of Object.values(this.occupiedExpansionSlots)) {
              expansion.updateSecuredState(server);
            }
            return;
          case Items.FOUNDATION_EXPANSION:
            const parent =
              server._constructionFoundations[this.parentObjectCharacterId];
            if (parent) {
              if(parent.isSecured && this.getWallsSecured()) {
                this.isSecured = true;
                return;
              }
    
              for (const slot of this.getDependentWalls()) {
                const wall = parent.occupiedWallSlots[slot];
                if (!wall || !wall.isSecured) {
                  this.isSecured = false;
                  return;
                }
              }
            }
            else {
              this.isSecured = false;
              return;
            }
            break;
          default:
            if(!this.getWallsSecured()) {
              this.isSecured = false;
              return;
            }
            break;
        }
        this.isSecured = true;
        */
        // update secured state for all attached expansions
        if (this.itemDefinitionId == enums_1.Items.FOUNDATION) {
            for (const expansion of Object.values(this.occupiedExpansionSlots)) {
                expansion.updateSecuredState(server);
            }
        }
        const wallSlots = Object.values(this.occupiedWallSlots);
        // check if all wall slots are occupied
        if (wallSlots.length != Object.values(this.wallSlots).length) {
            this.isSecured = false;
            return;
        }
        // check if any walls are gates / if they're open
        for (const wall of wallSlots) {
            if (!wall.isSecured) {
                this.isSecured = false;
                return;
            }
        }
        /* TODO: for deck foundations ONLY, need to check each side to see if it's secure,
        and if not, check if the expansion is secure (without checking for dependent deck walls)
        */
        // if this is an expansion, check dependent parent foundation walls
        const parent = server._constructionFoundations[this.parentObjectCharacterId];
        if (parent) {
            for (const slot of this.getDependentWalls()) {
                const wall = parent.occupiedWallSlots[slot];
                if (!wall || !wall.isSecured) {
                    this.isSecured = false;
                    return;
                }
            }
        }
        this.isSecured = true;
    }
    isExpansionSlotValid(buildingSlot, itemDefinitionId) {
        let slot = 0;
        if (typeof buildingSlot == "string") {
            slot = (0, utils_1.getConstructionSlotId)(buildingSlot);
        }
        return this.isSlotValid(slot, constructionslots_1.foundationExpansionSlotDefinitions, this.expansionSlots, itemDefinitionId);
    }
    setExpansionSlot(expansion) {
        return this.setSlot(expansion, constructionslots_1.foundationExpansionSlotDefinitions, this.expansionSlots, this.occupiedExpansionSlots);
    }
    isRampSlotValid(buildingSlot, itemDefinitionId) {
        let slot = 0;
        if (typeof buildingSlot == "string") {
            slot = (0, utils_1.getConstructionSlotId)(buildingSlot);
        }
        return this.isSlotValid(slot, constructionslots_1.foundationRampSlotDefinitions, this.rampSlots, itemDefinitionId);
    }
    setRampSlot(ramp) {
        return this.setSlot(ramp, constructionslots_1.foundationRampSlotDefinitions, this.rampSlots, this.occupiedRampSlots);
    }
    isInside(position) {
        if (!this.bounds) {
            console.error(`ERROR: CONSTRUCTION BOUNDS IS NOT DEFINED FOR ${this.itemDefinitionId} ${this.characterId}`);
            return false; // this should never occur
        }
        switch (this.itemDefinitionId) {
            case enums_1.Items.FOUNDATION:
            case enums_1.Items.FOUNDATION_EXPANSION:
            case enums_1.Items.GROUND_TAMPER:
                return (0, utils_1.isInsideSquare)([position[0], position[2]], this.bounds);
            case enums_1.Items.SHACK:
                return (0, utils_1.isPosInRadiusWithY)(2.39, position, this.state.position, 2);
            case enums_1.Items.SHACK_BASIC:
                return (0, utils_1.isPosInRadiusWithY)(1, position, this.state.position, 2);
            case enums_1.Items.SHACK_SMALL:
                return (0, utils_1.isInsideCube)([position[0], position[2]], this.bounds, position[1], this.state.position[1], 2.1);
            default:
                return false;
        }
    }
    destroy(server, destructTime = 0) {
        server.deleteEntity(this.characterId, server._constructionFoundations, 242, destructTime);
        const parent = server._constructionFoundations[this.parentObjectCharacterId];
        if (!parent)
            return;
        if (!this.slot || !this.parentObjectCharacterId)
            return;
        parent.clearSlot(this.getSlotNumber(), parent.occupiedExpansionSlots);
    }
    isExpansionSlotsEmpty() {
        return Object.values(this.occupiedExpansionSlots).length == 0;
    }
    isSlotsEmpty() {
        return (super.isSlotsEmpty() &&
            this.isExpansionSlotsEmpty() &&
            Object.values(this.occupiedRampSlots).length == 0);
    }
    canUndoPlacement(server, client) {
        return (this.getHasPermission(server, client.character.characterId, enums_1.ConstructionPermissionIds.BUILD) &&
            Date.now() < this.placementTime + 120000 &&
            client.character.getEquippedWeapon().itemDefinitionId ==
                enums_1.Items.WEAPON_HAMMER_DEMOLITION &&
            this.isSlotsEmpty());
    }
    getHasPermission(server, characterId, permission) {
        if (characterId == this.ownerCharacterId)
            return true;
        switch (permission) {
            case enums_1.ConstructionPermissionIds.BUILD:
                return this.permissions[characterId]?.build;
            case enums_1.ConstructionPermissionIds.DEMOLISH:
                return this.permissions[characterId]?.demolish;
            case enums_1.ConstructionPermissionIds.CONTAINERS:
                return this.permissions[characterId]?.useContainers;
            case enums_1.ConstructionPermissionIds.VISIT:
                return this.permissions[characterId]?.visit;
        }
    }
    /* eslint-disable @typescript-eslint/no-unused-vars */
    OnPlayerSelect(server, client, isInstant
    /* eslint-enable @typescript-eslint/no-unused-vars */
    ) {
        if (this.canUndoPlacement(server, client)) {
            this.destroy(server);
            client.character.lootItem(server, server.generateItem(this.itemDefinitionId));
            return;
        }
        if (this.ownerCharacterId != client.character.characterId &&
            (!client.isAdmin || !client.isDebugMode) // allows debug mode
        )
            return;
        server.sendData(client, "NpcFoundationPermissionsManagerBase.showPermissions", {
            characterId: this.characterId,
            characterId2: this.characterId,
            permissions: Object.values(this.permissions).filter((perm) => perm.characterId != this.ownerCharacterId),
        });
    }
    OnInteractionString(server, client) {
        if (this.canUndoPlacement(server, client)) {
            server.undoPlacementInteractionString(this, client);
            return;
        }
        if (this.ownerCharacterId != client.character.characterId &&
            (!client.isAdmin || !client.isDebugMode))
            return; // debug mode give permission interact string
        server.sendData(client, "Command.InteractionString", {
            guid: this.characterId,
            stringId: enums_1.StringIds.PERMISSIONS_TARGET,
        });
    }
}
exports.ConstructionParentEntity = ConstructionParentEntity;
//# sourceMappingURL=constructionparententity.js.map