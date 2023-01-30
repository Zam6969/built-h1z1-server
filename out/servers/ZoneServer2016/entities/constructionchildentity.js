"use strict";
//   copyright (C) 2021 - 2023 H1emu community
//
//   https://github.com/QuentinGruber/h1z1-server
//   https://www.npmjs.com/package/h1z1-server
//
//   Based on https://github.com/psemu/soe-network
// ======================================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConstructionChildEntity = void 0;
function getRenderDistance(itemDefinitionId) {
    let range = 0;
    switch (itemDefinitionId) {
        case enums_1.Items.SHACK: // metal shack
        case enums_1.Items.SHACK_SMALL: // small shack
        case enums_1.Items.SHACK_BASIC: // wood shack
        case enums_1.Items.FOUNDATION: // foundation,
        case enums_1.Items.FOUNDATION_EXPANSION: // expansion
        case enums_1.Items.GROUND_TAMPER: // tamper
            range = 350;
            break;
        case enums_1.Items.FURNACE:
        case enums_1.Items.WORKBENCH:
        case enums_1.Items.WORKBENCH_WEAPON:
        case enums_1.Items.BEE_BOX:
        case enums_1.Items.DEW_COLLECTOR:
            range = 200;
            break;
        case enums_1.Items.STORAGE_BOX:
        case enums_1.Items.ANIMAL_TRAP:
            range = 20;
            break;
        default:
            range = 350;
            break;
    }
    return range;
}
const baselightweightcharacter_1 = require("./baselightweightcharacter");
const enums_1 = require("../models/enums");
const utils_1 = require("../../../utils/utils");
const h1emu_core_1 = require("h1emu-core");
const constructionslots_1 = require("../data/constructionslots");
const constructiondoor_1 = require("./constructiondoor");
function getDamageRange(definitionId) {
    switch (definitionId) {
        case enums_1.Items.METAL_WALL:
        case enums_1.Items.METAL_WALL_UPPER:
        case enums_1.Items.SHELTER:
        case enums_1.Items.SHELTER_UPPER:
            return 4.3;
        case enums_1.Items.SHELTER_LARGE:
        case enums_1.Items.SHELTER_UPPER_LARGE:
            return 6.5;
        default:
            return 2;
    }
}
class ConstructionChildEntity extends baselightweightcharacter_1.BaseLightweightCharacter {
    constructor(characterId, transientId, actorModelId, position, rotation, server, itemDefinitionId, parentObjectCharacterId, slot, overrideEulerAngle) {
        super(characterId, transientId, actorModelId, position, rotation, server);
        this.health = 1000000;
        this.placementTime = Date.now();
        // FOR DOORS ON SHELTERS / DOORWAYS / LOOKOUT
        this.wallSlots = {};
        this.occupiedWallSlots = {};
        // FOR UPPER WALL ON WALLS / DOORWAYS
        this.upperWallSlots = {};
        this.occupiedUpperWallSlots = {};
        this.shelterSlots = {};
        this.occupiedShelterSlots = {};
        this.freeplaceEntities = {};
        if (overrideEulerAngle) {
            this.state.rotation = rotation;
            this.eulerAngle = overrideEulerAngle;
        }
        else {
            this.state.rotation = (0, h1emu_core_1.eul2quat)(rotation);
            this.eulerAngle = rotation[0];
        }
        this.itemDefinitionId = itemDefinitionId;
        this.parentObjectCharacterId = parentObjectCharacterId;
        this.slot = slot;
        this.profileId = 999; /// mark as construction
        this.damageRange = getDamageRange(this.itemDefinitionId);
        this.isSecured = this.itemDefinitionId == enums_1.Items.METAL_WALL ? true : false;
        this.npcRenderDistance = getRenderDistance(this.itemDefinitionId);
        (0, utils_1.registerConstructionSlots)(this, this.wallSlots, constructionslots_1.wallSlotDefinitions);
        Object.seal(this.wallSlots);
        (0, utils_1.registerConstructionSlots)(this, this.upperWallSlots, constructionslots_1.upperWallSlotDefinitions);
        Object.seal(this.upperWallSlots);
        (0, utils_1.registerConstructionSlots)(this, this.shelterSlots, constructionslots_1.shelterSlotDefinitions);
        Object.seal(this.shelterSlots);
        const angle = -this.eulerAngle;
        switch (itemDefinitionId) {
            case enums_1.Items.SHELTER_LARGE:
            case enums_1.Items.SHELTER_UPPER_LARGE:
                const centerPoint = (0, utils_1.movePoint)(position, angle + (90 * Math.PI) / 180, 2.5);
                this.fixedPosition = centerPoint;
                this.bounds = (0, utils_1.getRectangleCorners)(centerPoint, 10, 5, angle);
                break;
            case enums_1.Items.SHELTER:
            case enums_1.Items.SHELTER_UPPER:
                this.bounds = (0, utils_1.getRectangleCorners)(position, 5, 5, angle);
                break;
        }
        const itemDefinition = server.getItemDefinition(this.itemDefinitionId);
        if (itemDefinition)
            this.nameId = itemDefinition.NAME_ID;
    }
    getOccupiedSlotMaps() {
        return [
            this.occupiedWallSlots,
            this.occupiedUpperWallSlots,
            this.occupiedShelterSlots,
        ];
    }
    getSlotPosition(slot, slots) {
        if (typeof slot == "string") {
            slot = (0, utils_1.getConstructionSlotId)(slot);
        }
        if (slot == 101)
            slot = 1; // upper wall slot
        return slots[slot]?.position || undefined;
    }
    getSlotRotation(slot, slots) {
        if (typeof slot == "string") {
            slot = (0, utils_1.getConstructionSlotId)(slot);
        }
        if (slot == 101)
            slot = 1; // upper wall slot
        return slots[slot]?.rotation || undefined;
    }
    updateSecuredState(server) {
        switch (this.itemDefinitionId) {
            case enums_1.Items.METAL_DOORWAY: // for parent foundation
                const door = this.occupiedWallSlots[1];
                if (!door)
                    this.isSecured = false;
                if (door instanceof constructiondoor_1.ConstructionDoor && door.isOpen) {
                    this.isSecured = false;
                }
                else {
                    this.isSecured = true;
                }
                const parent = this.getParentFoundation(server);
                if (!parent)
                    return;
                parent.updateSecuredState(server);
                break;
            case enums_1.Items.SHELTER_LARGE:
            case enums_1.Items.SHELTER_UPPER_LARGE:
            case enums_1.Items.SHELTER:
            case enums_1.Items.SHELTER_UPPER:
                const doorslot = this.occupiedWallSlots[1];
                if (!doorslot ||
                    !(doorslot instanceof constructiondoor_1.ConstructionDoor) ||
                    doorslot.isOpen) {
                    this.isSecured = false;
                    return;
                }
                this.isSecured = true;
                break;
            case enums_1.Items.METAL_WALL:
                this.isSecured = true;
                break;
        }
    }
    isSlotOccupied(slotMap, slot) {
        return !!slotMap[slot];
    }
    isSlotsEmpty() {
        return (Object.values(this.occupiedShelterSlots).length +
            Object.values(this.occupiedUpperWallSlots).length +
            Object.values(this.occupiedWallSlots).length ==
            0);
    }
    isSlotValid(slot, definitions, slotMap, itemDefinitionId) {
        if (itemDefinitionId == enums_1.Items.METAL_WALL_UPPER) {
            slot = 1;
        }
        const slots = definitions[this.itemDefinitionId];
        if (!slots || !slots.authorizedItems.includes(itemDefinitionId)) {
            return false;
        }
        return !!slotMap[slot];
    }
    setSlot(entity, definitions, slotMap, occupiedSlots) {
        const slot = entity.getSlotNumber();
        if (!this.isSlotValid(slot, definitions, slotMap, entity.itemDefinitionId))
            return false;
        occupiedSlots[slot] = entity;
        return true;
    }
    clearSlot(slot, occupiedSlots) {
        delete occupiedSlots[slot];
    }
    isWallSlotValid(buildingSlot, itemDefinitionId) {
        let slot = 0;
        if (typeof buildingSlot == "string") {
            slot = (0, utils_1.getConstructionSlotId)(buildingSlot);
        }
        if (slot == 101) {
            // UPPER WALLS
            return this.isSlotValid(1, constructionslots_1.upperWallSlotDefinitions, this.upperWallSlots, itemDefinitionId);
        }
        return this.isSlotValid(slot, constructionslots_1.wallSlotDefinitions, this.wallSlots, itemDefinitionId);
    }
    setWallSlot(server, wall) {
        if (wall.itemDefinitionId == enums_1.Items.METAL_WALL_UPPER) {
            return this.setSlot(wall, constructionslots_1.upperWallSlotDefinitions, this.upperWallSlots, this.occupiedUpperWallSlots);
        }
        const set = this.setSlot(wall, constructionslots_1.wallSlotDefinitions, this.wallSlots, this.occupiedWallSlots);
        if (set)
            this.updateSecuredState(server);
        return set;
    }
    isShelterSlotValid(buildingSlot, itemDefinitionId) {
        let slot = 0;
        if (typeof buildingSlot == "string") {
            slot = (0, utils_1.getConstructionSlotId)(buildingSlot);
        }
        return this.isSlotValid(slot, constructionslots_1.shelterSlotDefinitions, this.shelterSlots, itemDefinitionId);
    }
    setShelterSlot(server, shelter) {
        const set = this.setSlot(shelter, constructionslots_1.shelterSlotDefinitions, this.shelterSlots, this.occupiedShelterSlots);
        if (set)
            this.updateSecuredState(server);
        return set;
    }
    addFreeplaceConstruction(entity) {
        this.freeplaceEntities[entity.characterId] = entity;
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
    isInside(position) {
        if (!this.bounds) {
            switch (this.itemDefinitionId) {
                case enums_1.Items.STRUCTURE_STAIRS:
                case enums_1.Items.STRUCTURE_STAIRS_UPPER:
                case enums_1.Items.LOOKOUT_TOWER:
                    return false;
            }
            console.error(`ERROR: CONSTRUCTION BOUNDS IS NOT DEFINED FOR ${this.itemDefinitionId} ${this.characterId}`);
            return false; // this should never occur
        }
        switch (this.itemDefinitionId) {
            case enums_1.Items.SHELTER_LARGE:
            case enums_1.Items.SHELTER_UPPER_LARGE:
            case enums_1.Items.SHELTER:
            case enums_1.Items.SHELTER_UPPER:
                return (0, utils_1.isInsideCube)([position[0], position[2]], this.bounds, position[1], this.state.position[1], 2);
            default:
                return false;
        }
    }
    destroy(server, destructTime = 0) {
        server.deleteEntity(this.characterId, server._constructionSimple[this.characterId]
            ? server._constructionSimple
            : server._worldSimpleConstruction, 242, destructTime);
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
            case enums_1.Items.METAL_WALL:
            case enums_1.Items.METAL_DOORWAY:
                slotMap = parent.occupiedWallSlots;
                updateSecured = true;
                break;
            case enums_1.Items.METAL_WALL_UPPER:
                slotMap = parent.occupiedUpperWallSlots;
                break;
            case enums_1.Items.SHELTER:
            case enums_1.Items.SHELTER_LARGE:
            case enums_1.Items.SHELTER_UPPER:
            case enums_1.Items.SHELTER_UPPER_LARGE:
            case enums_1.Items.STRUCTURE_STAIRS:
            case enums_1.Items.STRUCTURE_STAIRS_UPPER:
            case enums_1.Items.LOOKOUT_TOWER:
                slotMap = parent.occupiedShelterSlots;
                break;
            case enums_1.Items.FOUNDATION_RAMP:
            case enums_1.Items.FOUNDATION_STAIRS:
                slotMap = parent.occupiedRampSlots;
                break;
        }
        let freeplace = [];
        this.getOccupiedSlotMaps().forEach((slotMap) => {
            freeplace = [...freeplace, ...Object.values(slotMap)];
        });
        if (slotMap)
            parent.clearSlot(this.getSlotNumber(), slotMap);
        if (updateSecured)
            parent.updateSecuredState(server);
        // re-register now disconnected slotted entities as freeplace entities
        const parentFoundation = this.getParentFoundation(server);
        if (parentFoundation) {
            freeplace.forEach((entity) => {
                entity.parentObjectCharacterId = parentFoundation.characterId;
                parentFoundation.freeplaceEntities[entity.characterId] = entity;
            });
            parentFoundation.freeplaceEntities = {
                ...parentFoundation.freeplaceEntities,
                ...this.freeplaceEntities,
            };
        }
    }
    getParent(server) {
        return (server._constructionFoundations[this.parentObjectCharacterId] ||
            server._constructionSimple[this.parentObjectCharacterId]);
    }
    canUndoPlacement(server, client) {
        return (this.getHasPermission(server, client.character.characterId, enums_1.ConstructionPermissionIds.BUILD) &&
            Date.now() < this.placementTime + 120000 &&
            client.character.getEquippedWeapon().itemDefinitionId ==
                enums_1.Items.WEAPON_HAMMER_DEMOLITION);
    }
    getHasPermission(server, characterId, permission) {
        return (this.getParentFoundation(server)?.getHasPermission(server, characterId, permission) || false);
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
    getSlotNumber() {
        if (!this.slot)
            return 0;
        return (0, utils_1.getConstructionSlotId)(this.slot);
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
    }
    OnInteractionString(server, client) {
        if (this.canUndoPlacement(server, client)) {
            server.undoPlacementInteractionString(this, client);
            return;
        }
    }
}
exports.ConstructionChildEntity = ConstructionChildEntity;
//# sourceMappingURL=constructionchildentity.js.map