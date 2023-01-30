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
exports.Character2016 = void 0;
const enums_1 = require("../models/enums");
const basefullcharacter_1 = require("./basefullcharacter");
const utils_1 = require("../../../utils/utils");
const loadouts_1 = require("../data/loadouts");
const stats = require("../../../../data/2016/sampleData/stats.json");
class Character2016 extends basefullcharacter_1.BaseFullCharacter {
    set isAlive(state) {
        this.characterStates.knockedOut = !state;
    }
    get isAlive() {
        return !this.characterStates.knockedOut;
    }
    constructor(characterId, transientId, server) {
        super(characterId, transientId, 0, new Float32Array([0, 0, 0, 1]), new Float32Array([0, 0, 0, 1]), server);
        this.factionId = 2;
        this.godMode = false;
        this.isRunning = false;
        this.isHidden = "";
        this.isBleeding = false;
        this.isBandaged = false;
        this.isExhausted = false;
        this.isSonic = false;
        this.isMoving = false;
        this.isRespawning = false;
        this.isReady = false;
        this.vehicleExitDate = new Date().getTime();
        this.currentLoadoutSlot = enums_1.LoadoutSlots.FISTS;
        this.loadoutId = enums_1.LoadoutIds.CHARACTER;
        this.hasConveys = false;
        this.tempGodMode = false;
        this.isSpectator = false;
        this.initialized = false; // if sendself has been sent
        this.metrics = {
            recipesDiscovered: 0,
            zombiesKilled: 0,
            wildlifeKilled: 0,
            startedSurvivingTP: Date.now(),
        };
        this.combatlog = [];
        this.lastInteractionTime = 0;
        this.defaultLoadout = loadouts_1.characterDefaultLoadout;
        this.npcRenderDistance = 250;
        this.healingTicks = 0;
        this.healingMaxTicks = 0;
        (this._resources = {
            [enums_1.ResourceIds.HEALTH]: 10000,
            [enums_1.ResourceIds.STAMINA]: 600,
            [enums_1.ResourceIds.HUNGER]: 10000,
            [enums_1.ResourceIds.HYDRATION]: 10000,
            [enums_1.ResourceIds.VIRUS]: 0,
            [enums_1.ResourceIds.COMFORT]: 5000,
            [enums_1.ResourceIds.BLEEDING]: -40,
        }),
            (this.characterStates = {
                knockedOut: false,
                inWater: false,
            });
        this.timeouts = {};
        this.starthealingInterval = (client, server) => {
            client.character.healingInterval = setTimeout(() => {
                if (!server._clients[client.sessionId]) {
                    return;
                }
                client.character._resources[enums_1.ResourceIds.HEALTH] += 100;
                if (client.character._resources[enums_1.ResourceIds.HEALTH] > 10000) {
                    client.character._resources[enums_1.ResourceIds.HEALTH] = 10000;
                }
                server.updateResource(client, client.character.characterId, client.character._resources[enums_1.ResourceIds.HEALTH], enums_1.ResourceIds.HEALTH);
                if (client.character.healingTicks++ < client.character.healingMaxTicks) {
                    client.character.healingInterval.refresh();
                }
                else {
                    client.character.healingMaxTicks = 0;
                    client.character.healingTicks = 0;
                    delete client.character.healingInterval;
                }
            }, 1000);
        };
        this.startRessourceUpdater = (client, server) => {
            const hunger = this._resources[enums_1.ResourceIds.HUNGER], hydration = this._resources[enums_1.ResourceIds.HYDRATION], health = this._resources[enums_1.ResourceIds.HEALTH], virus = this._resources[enums_1.ResourceIds.VIRUS], stamina = this._resources[enums_1.ResourceIds.STAMINA], bleeding = this._resources[enums_1.ResourceIds.BLEEDING];
            client.character.resourcesUpdater = setTimeout(() => {
                // prototype resource manager
                if (!server._clients[client.sessionId]) {
                    return;
                }
                const { isRunning } = client.character;
                if (isRunning &&
                    (client.vehicle.mountedVehicle == "" ||
                        !client.vehicle.mountedVehicle)) {
                    client.character._resources[enums_1.ResourceIds.STAMINA] -= 4;
                    client.character.isExhausted =
                        client.character._resources[enums_1.ResourceIds.STAMINA] < 120;
                }
                else if (!client.character.isBleeding || !client.character.isMoving) {
                    client.character._resources[enums_1.ResourceIds.STAMINA] += 8;
                }
                // todo: modify sprint stat
                client.character._resources[enums_1.ResourceIds.HUNGER] -= 2;
                client.character._resources[enums_1.ResourceIds.HYDRATION] -= 4;
                if (client.character._resources[enums_1.ResourceIds.STAMINA] > 600) {
                    client.character._resources[enums_1.ResourceIds.STAMINA] = 600;
                }
                else if (client.character._resources[enums_1.ResourceIds.STAMINA] < 0) {
                    client.character._resources[enums_1.ResourceIds.STAMINA] = 0;
                }
                if (client.character._resources[enums_1.ResourceIds.BLEEDING] > 0) {
                    this.damage(server, {
                        entity: "",
                        damage: Math.ceil(client.character._resources[enums_1.ResourceIds.BLEEDING] / 40) * 100,
                    });
                }
                if (client.character._resources[enums_1.ResourceIds.BLEEDING] > 80) {
                    client.character._resources[enums_1.ResourceIds.BLEEDING] = 80;
                }
                if (client.character._resources[enums_1.ResourceIds.BLEEDING] < -40) {
                    client.character._resources[enums_1.ResourceIds.BLEEDING] = -40;
                }
                if (client.character._resources[enums_1.ResourceIds.HUNGER] > 10000) {
                    client.character._resources[enums_1.ResourceIds.HUNGER] = 10000;
                }
                else if (client.character._resources[enums_1.ResourceIds.HUNGER] < 0) {
                    client.character._resources[enums_1.ResourceIds.HUNGER] = 0;
                    this.damage(server, { entity: "", damage: 100 });
                }
                if (client.character._resources[enums_1.ResourceIds.HYDRATION] > 10000) {
                    client.character._resources[enums_1.ResourceIds.HYDRATION] = 10000;
                }
                else if (client.character._resources[enums_1.ResourceIds.HYDRATION] < 0) {
                    client.character._resources[enums_1.ResourceIds.HYDRATION] = 0;
                    this.damage(server, { entity: "", damage: 100 });
                }
                if (client.character._resources[enums_1.ResourceIds.HEALTH] > 10000) {
                    client.character._resources[enums_1.ResourceIds.HEALTH] = 10000;
                }
                else if (client.character._resources[enums_1.ResourceIds.HEALTH] < 0) {
                    client.character._resources[enums_1.ResourceIds.HEALTH] = 0;
                }
                if (client.character._resources[enums_1.ResourceIds.HUNGER] != hunger) {
                    server.updateResourceToAllWithSpawnedEntity(client.character.characterId, client.character._resources[enums_1.ResourceIds.HUNGER], enums_1.ResourceIds.HUNGER, enums_1.ResourceTypes.HUNGER, server._characters);
                }
                if (client.character._resources[enums_1.ResourceIds.HYDRATION] != hydration) {
                    server.updateResourceToAllWithSpawnedEntity(client.character.characterId, client.character._resources[enums_1.ResourceIds.HYDRATION], enums_1.ResourceIds.HYDRATION, enums_1.ResourceTypes.HYDRATION, server._characters);
                }
                if (client.character._resources[enums_1.ResourceIds.HEALTH] != health) {
                    server.updateResourceToAllWithSpawnedEntity(client.character.characterId, client.character._resources[enums_1.ResourceIds.HEALTH], enums_1.ResourceIds.HEALTH, enums_1.ResourceTypes.HEALTH, server._characters);
                }
                if (client.character._resources[enums_1.ResourceIds.VIRUS] != virus) {
                    server.updateResourceToAllWithSpawnedEntity(client.character.characterId, client.character._resources[enums_1.ResourceIds.VIRUS], enums_1.ResourceIds.VIRUS, enums_1.ResourceTypes.VIRUS, server._characters);
                }
                if (client.character._resources[enums_1.ResourceIds.STAMINA] != stamina) {
                    server.updateResourceToAllWithSpawnedEntity(client.character.characterId, client.character._resources[enums_1.ResourceIds.STAMINA], enums_1.ResourceIds.STAMINA, enums_1.ResourceTypes.STAMINA, server._characters);
                }
                if (client.character._resources[enums_1.ResourceIds.BLEEDING] != bleeding) {
                    server.updateResourceToAllWithSpawnedEntity(client.character.characterId, client.character._resources[enums_1.ResourceIds.BLEEDING] > 0
                        ? client.character._resources[enums_1.ResourceIds.BLEEDING]
                        : 0, enums_1.ResourceIds.BLEEDING, enums_1.ResourceTypes.BLEEDING, server._characters);
                }
                client.character.resourcesUpdater.refresh();
            }, 3000);
        };
    }
    clearReloadTimeout() {
        const weaponItem = this.getEquippedWeapon();
        if (!weaponItem.weapon?.reloadTimer)
            return;
        clearTimeout(weaponItem.weapon.reloadTimer);
        weaponItem.weapon.reloadTimer = undefined;
    }
    addCombatlogEntry(entry) {
        this.combatlog.push(entry);
        if (this.combatlog.length > 10) {
            this.combatlog.shift();
        }
    }
    getCombatLog() {
        return this.combatlog;
    }
    /**
     * Gets the lightweightpc packetfields for use in sendself and addlightweightpc
     */
    pGetLightweight() {
        return {
            ...super.pGetLightweight(),
            rotation: this.state.lookAt,
            identity: {
                characterName: this.name,
            },
        };
    }
    pGetSendSelf(server, guid = "", client) {
        return {
            ...this.pGetLightweight(),
            guid: guid,
            hairModel: this.hairModel,
            isRespawning: this.isRespawning,
            gender: this.gender,
            creationDate: this.creationDate,
            lastLoginDate: this.lastLoginDate,
            identity: {
                characterName: this.name,
            },
            inventory: {
                items: this.pGetInventoryItems(server),
                //unknownDword1: 2355
            },
            recipes: server.pGetRecipes(),
            stats: stats,
            loadoutSlots: this.pGetLoadoutSlots(),
            equipmentSlots: this.pGetEquipment(),
            characterResources: this.pGetResources(),
            containers: this.pGetContainers(server),
            //unknownQword1: this.characterId,
            //unknownDword38: 1,
            //vehicleLoadoutRelatedQword: this.characterId,
            //unknownQword3: this.characterId,
            //vehicleLoadoutRelatedDword: 1,
            //unknownDword40: 1
            isAdmin: client.isAdmin,
        };
    }
    pGetRemoteWeaponData(server, item) {
        const itemDefinition = server.getItemDefinition(item.itemDefinitionId), weaponDefinition = server.getWeaponDefinition(itemDefinition.PARAM1), firegroups = weaponDefinition.FIRE_GROUPS || [];
        return {
            weaponDefinitionId: weaponDefinition.ID,
            equipmentSlotId: this.getActiveEquipmentSlot(item),
            firegroups: firegroups.map((firegroup) => {
                const firegroupDef = server.getFiregroupDefinition(firegroup.FIRE_GROUP_ID), firemodes = firegroupDef?.FIRE_MODES || [];
                if (!firemodes) {
                    console.error(`firegroupDef missing for`);
                    console.log(firegroup);
                }
                return {
                    firegroupId: firegroup.FIRE_GROUP_ID,
                    unknownArray1: firegroup
                        ? firemodes.map((firemode, j) => {
                            return {
                                unknownDword1: j,
                                unknownDword2: firemode.FIRE_MODE_ID,
                            };
                        })
                        : [], // probably firemodes
                };
            }),
        };
    }
    pGetRemoteWeaponExtraData(server, item) {
        const itemDefinition = server.getItemDefinition(item.itemDefinitionId), weaponDefinition = server.getWeaponDefinition(itemDefinition.PARAM1), firegroups = weaponDefinition.FIRE_GROUPS;
        return {
            guid: item.itemGuid,
            unknownByte1: 0,
            unknownByte2: 0,
            unknownByte3: -1,
            unknownByte4: -1,
            unknownByte5: 1,
            unknownDword1: 0,
            unknownByte6: 0,
            unknownDword2: 0,
            unknownArray1: firegroups.map(() => {
                // same len as firegroups in remoteweapons
                return {
                    // setting unknownDword1 makes the 308 sound when fullpc packet it sent
                    unknownDword1: 0,
                    unknownBoolean1: false,
                    unknownBoolean2: false,
                };
            }),
        };
    }
    pGetRemoteWeaponsData(server) {
        const remoteWeapons = [];
        Object.values(this._loadout).forEach((item) => {
            if (server.isWeapon(item.itemDefinitionId)) {
                remoteWeapons.push({
                    guid: item.itemGuid,
                    ...this.pGetRemoteWeaponData(server, item),
                });
            }
        });
        return remoteWeapons;
    }
    pGetRemoteWeaponsExtraData(server) {
        const remoteWeaponsExtra = [];
        Object.values(this._loadout).forEach((item) => {
            if (server.isWeapon(item.itemDefinitionId)) {
                remoteWeaponsExtra.push(this.pGetRemoteWeaponExtraData(server, item));
            }
        });
        return remoteWeaponsExtra;
    }
    pGetContainers(server) {
        if (!this.mountedContainer)
            return super.pGetContainers(server);
        // to avoid a mounted container being dismounted if container list is updated while mounted
        const containers = super.pGetContainers(server), mountedContainer = this.mountedContainer.getContainer();
        if (!mountedContainer)
            return containers;
        containers.push({
            loadoutSlotId: mountedContainer.slotId,
            containerData: super.pGetContainerData(server, mountedContainer),
        });
        return containers;
    }
    pGetLoadoutSlots() {
        if (!this.mountedContainer)
            return super.pGetLoadoutSlots();
        // to avoid a mounted container being dismounted if loadout is updated while mounted
        const loadoutSlots = Object.values(this.getLoadoutSlots()).map((slotId) => {
            return this.pGetLoadoutSlot(slotId);
        });
        const mountedContainer = this.mountedContainer.getContainer();
        if (mountedContainer)
            loadoutSlots.push(this.mountedContainer.pGetLoadoutSlot(mountedContainer.slotId));
        return {
            characterId: this.characterId,
            loadoutId: this.loadoutId,
            loadoutData: {
                loadoutSlots: loadoutSlots,
            },
            currentSlotId: this.currentLoadoutSlot,
        };
    }
    resetMetrics() {
        this.metrics.zombiesKilled = 0;
        this.metrics.wildlifeKilled = 0;
        this.metrics.recipesDiscovered = 0;
        this.metrics.startedSurvivingTP = Date.now();
    }
    damage(server, damageInfo) {
        const client = server.getClientByCharId(this.characterId), damage = damageInfo.damage, oldHealth = this._resources[enums_1.ResourceIds.HEALTH];
        if (!client)
            return;
        if (this.godMode || !this.isAlive || damage < 100)
            return;
        if (damageInfo.causeBleed) {
            if ((0, utils_1.randomIntFromInterval)(0, 100) < damage / 100 && damage > 500) {
                this._resources[enums_1.ResourceIds.BLEEDING] += 41;
                if (damage > 4000) {
                    this._resources[enums_1.ResourceIds.BLEEDING] += 41;
                }
                server.updateResourceToAllWithSpawnedEntity(this.characterId, this._resources[enums_1.ResourceIds.BLEEDING], enums_1.ResourceIds.BLEEDING, enums_1.ResourceTypes.BLEEDING, server._characters);
            }
        }
        this._resources[enums_1.ResourceIds.HEALTH] -= damage;
        if (this._resources[enums_1.ResourceIds.HEALTH] <= 0) {
            this._resources[enums_1.ResourceIds.HEALTH] = 0;
            server.killCharacter(client, damageInfo);
        }
        server.updateResource(client, this.characterId, this._resources[enums_1.ResourceIds.HEALTH], enums_1.ResourceIds.HEALTH);
        const sourceEntity = server.getEntity(damageInfo.entity);
        const orientation = (0, utils_1.calculateOrientation)(this.state.position, sourceEntity?.state.position || this.state.position // send damaged screen effect during falling/hunger etc
        );
        server.sendData(client, "ClientUpdate.DamageInfo", {
            transientId: 0,
            orientationToSource: orientation,
            unknownDword2: 100,
        });
        server.sendChatText(client, `Received ${damage} damage`);
        if (!sourceEntity)
            return;
        const damageRecord = server.generateDamageRecord(this.characterId, damageInfo, oldHealth);
        this.addCombatlogEntry(damageRecord);
        //server.combatLog(client);
        const sourceClient = server.getClientByCharId(damageInfo.entity);
        if (!sourceClient?.character)
            return;
        sourceClient.character.addCombatlogEntry(damageRecord);
        //server.combatLog(sourceClient);
    }
    mountContainer(server, lootableEntity) {
        const client = server.getClientByCharId(this.characterId);
        if (!client)
            return;
        const container = lootableEntity.getContainer();
        if (!container) {
            server.containerError(client, enums_1.ContainerErrors.NOT_CONSTRUCTED);
            return;
        }
        if (!(0, utils_1.isPosInRadius)(lootableEntity.interactionDistance, this.state.position, lootableEntity.state.position)) {
            server.containerError(client, enums_1.ContainerErrors.INTERACTION_VALIDATION);
            return;
        }
        // construction container permissions
        const lootableConstruction = server._lootableConstruction[lootableEntity.characterId];
        if (lootableConstruction && lootableConstruction.parentObjectCharacterId) {
            const parent = lootableConstruction.getParent(server);
            if (parent &&
                parent.isSecured &&
                !parent.getHasPermission(server, this.characterId, enums_1.ConstructionPermissionIds.CONTAINERS)) {
                server.containerError(client, enums_1.ContainerErrors.NO_PERMISSION);
                return;
            }
        }
        lootableEntity.mountedCharacter = this.characterId;
        this.mountedContainer = lootableEntity;
        server.initializeContainerList(client);
        server.addItem(client, container, 101);
        Object.values(container.items).forEach((item) => {
            server.addItem(client, item, container.containerDefinitionId);
        });
        this.updateLoadout(server);
        server.sendData(client, "AccessedCharacter.BeginCharacterAccess", {
            objectCharacterId: lootableEntity.characterId,
            containerGuid: container.itemGuid,
            unknownBool1: false,
            itemsData: {
                items: [],
                unknownDword1: 92, // idk
            },
        });
    }
    dismountContainer(server) {
        const client = server.getClientByCharId(this.characterId);
        if (!client || !this.mountedContainer)
            return;
        const container = this.mountedContainer.getContainer();
        if (!container) {
            server.containerError(client, enums_1.ContainerErrors.NOT_CONSTRUCTED);
            return;
        }
        server.deleteItem(client, container.itemGuid);
        Object.values(container.items).forEach((item) => {
            if (!this.mountedContainer)
                return;
            server.deleteItem(client, item.itemGuid);
        });
        if (this.mountedContainer.isLootbag && !utils_1._.size(container.items)) {
            server.deleteEntity(this.mountedContainer.characterId, server._lootbags);
        }
        delete this.mountedContainer.mountedCharacter;
        delete this.mountedContainer;
        this.updateLoadout(server);
        server.initializeContainerList(client);
    }
    getItemContainer(itemGuid) {
        // returns the container that an item is contained in
        let c;
        for (const container of Object.values(this._containers)) {
            if (container.items[itemGuid]) {
                c = container;
                break;
            }
        }
        // check mounted container
        if (!c && this.mountedContainer) {
            const container = this.mountedContainer.getContainer();
            if (container && container.items[itemGuid])
                return container;
        }
        return c;
    }
    getContainerFromGuid(containerGuid) {
        let c;
        for (const container of Object.values(this._containers)) {
            if (container.itemGuid == containerGuid) {
                c = container;
            }
        }
        if (!c &&
            this.mountedContainer?.getContainer()?.itemGuid == containerGuid) {
            c = this.mountedContainer.getContainer();
        }
        return c;
    }
    OnFullCharacterDataRequest(server, client) {
        server.sendData(client, "LightweightToFullPc", {
            useCompression: false,
            fullPcData: {
                transientId: this.transientId,
                attachmentData: this.pGetAttachmentSlots(),
                headActor: this.headActor,
                hairModel: this.hairModel,
                resources: { data: this.pGetResources() },
                remoteWeapons: { data: this.pGetRemoteWeaponsData(server) },
            },
            positionUpdate: {
                ...this.positionUpdate,
                sequenceTime: server.getGameTime(),
                position: this.state.position,
                stance: 66561,
            },
            stats: stats.map((stat) => {
                return stat.statData;
            }),
            remoteWeaponsExtra: this.pGetRemoteWeaponsExtraData(server),
        });
        // needed so all weapons replicate reload and projectile impact
        Object.values(this._loadout).forEach((item) => {
            if (!server.isWeapon(item.itemDefinitionId))
                return;
            server.sendRemoteWeaponUpdateData(client, this.transientId, item.itemGuid, "Update.SwitchFireMode", {
                firegroupIndex: 0,
                firemodeIndex: 0,
            });
        });
        server.sendData(client, "Character.WeaponStance", {
            characterId: this.characterId,
            stance: this.positionUpdate?.stance,
        });
        if (this.onReadyCallback) {
            this.onReadyCallback(client);
            delete this.onReadyCallback;
        }
    }
    OnProjectileHit(server, damageInfo) {
        if (!this.isAlive)
            return;
        const client = server.getClientByCharId(damageInfo.entity), // source
        c = server.getClientByCharId(this.characterId); // target
        if (!client || !c || !damageInfo.hitReport)
            return;
        server.hitMissFairPlayCheck(client, true, damageInfo.hitReport?.hitLocation || "");
        const hasHelmetBefore = this.hasHelmet(server);
        const hasArmorBefore = this.hasArmor(server);
        let damage = damageInfo.damage, canStopBleed;
        switch (damageInfo.hitReport?.hitLocation) {
            case "HEAD":
            case "GLASSES":
            case "NECK":
                damage *= 4;
                damage = server.checkHelmet(this.characterId, damage, damageInfo.weapon == enums_1.Items.WEAPON_SHOTGUN ? 100 : 1);
                break;
            default:
                damage = server.checkArmor(this.characterId, damage, damageInfo.weapon == enums_1.Items.WEAPON_SHOTGUN ? 10 : 4);
                canStopBleed = true;
                break;
        }
        if (this.isAlive) {
            server.sendHitmarker(client, damageInfo.hitReport?.hitLocation, this.hasHelmet(server), this.hasArmor(server), hasHelmetBefore, hasArmorBefore);
        }
        c.character.damage(server, {
            ...damageInfo,
            damage: damage,
            causeBleed: !(canStopBleed && this.hasArmor(server)),
        });
    }
}
exports.Character2016 = Character2016;
Character2016.isAlive = true;
//# sourceMappingURL=character.js.map