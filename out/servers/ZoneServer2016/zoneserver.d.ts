/// <reference types="node" />
/// <reference types="node" />
/// <reference types="node" />
/// <reference types="node" />
import { EventEmitter } from "events";
import { H1Z1Protocol } from "../../protocols/h1z1protocol";
import SOEClient from "../SoeServer/soeclient";
import { zonePacketHandlers } from "./zonepackethandlers";
import { ZoneClient2016 as Client } from "./classes/zoneclient";
import { Vehicle2016 as Vehicle } from "./entities/vehicle";
import { GridCell } from "./classes/gridcell";
import { WorldObjectManager } from "./managers/worldobjectmanager";
import { ContainerErrors, Items, MovementModifiers, ConstructionErrors } from "./models/enums";
import { WeatherManager } from "./managers/weathermanager";
import { ConstructionEntity, DamageInfo, DamageRecord, Recipe, SlottedConstructionEntity, SpawnLocation, Weather2016 as Weather } from "../../types/zoneserver";
import { h1z1PacketsType2016 } from "../../types/packets";
import { remoteWeaponPacketsType, remoteWeaponUpdatePacketsType, weaponPacketsType } from "../../types/weaponPackets";
import { Character2016 as Character } from "./entities/character";
import { Db } from "mongodb";
import { BaseFullCharacter } from "./entities/basefullcharacter";
import { ItemObject } from "./entities/itemobject";
import { TrapEntity } from "./entities/trapentity";
import { DoorEntity } from "./entities/doorentity";
import { Npc } from "./entities/npc";
import { ExplosiveEntity } from "./entities/explosiveentity";
import { BaseLightweightCharacter } from "./entities/baselightweightcharacter";
import { BaseSimpleNpc } from "./entities/basesimplenpc";
import { TemporaryEntity } from "./entities/temporaryentity";
import { BaseEntity } from "./entities/baseentity";
import { ConstructionDoor } from "./entities/constructiondoor";
import { ConstructionParentEntity } from "./entities/constructionparententity";
import { ConstructionChildEntity } from "./entities/constructionchildentity";
import { WorldDataManager } from "./managers/worlddatamanager";
import { GAME_VERSIONS } from "../../utils/enums";
import { ClientUpdateProximateItems, zone2016packets } from "types/zone2016packets";
import { HookManager } from "./managers/hookmanager";
import { BaseItem } from "./classes/baseItem";
import { LoadoutItem } from "./classes/loadoutItem";
import { LoadoutContainer } from "./classes/loadoutcontainer";
import { Lootbag } from "./entities/lootbag";
import { BaseLootableEntity } from "./entities/baselootableentity";
import { LootableConstructionEntity } from "./entities/lootableconstructionentity";
import { LootableProp } from "./entities/lootableprop";
import { PlantingDiameter } from "./entities/plantingdiameter";
import { Plant } from "./entities/plant";
export declare class ZoneServer2016 extends EventEmitter {
    private _gatewayServer;
    readonly _protocol: H1Z1Protocol;
    _db: Db;
    _soloMode: boolean;
    _useFairPlay: boolean;
    _serverName: string;
    readonly _mongoAddress: string;
    private readonly _clientProtocol;
    _dynamicWeatherWorker: any;
    _dynamicWeatherEnabled: boolean;
    _defaultWeatherTemplate: string;
    _spawnLocations: Array<SpawnLocation>;
    private _h1emuZoneServer;
    readonly _appDataFolder: string;
    _worldId: number;
    _grid: GridCell[];
    readonly _clients: {
        [characterId: string]: Client;
    };
    _characters: {
        [characterId: string]: Character;
    };
    _npcs: {
        [characterId: string]: Npc;
    };
    _spawnedItems: {
        [characterId: string]: ItemObject;
    };
    _plants: {
        [characterId: string]: Plant;
    };
    _doors: {
        [characterId: string]: DoorEntity;
    };
    _explosives: {
        [characterId: string]: ExplosiveEntity;
    };
    _traps: {
        [characterId: string]: TrapEntity;
    };
    _temporaryObjects: {
        [characterId: string]: TemporaryEntity | PlantingDiameter;
    };
    _vehicles: {
        [characterId: string]: Vehicle;
    };
    _lootbags: {
        [characterId: string]: Lootbag;
    };
    _lootableConstruction: {
        [characterId: string]: LootableConstructionEntity;
    };
    _constructionFoundations: {
        [characterId: string]: ConstructionParentEntity;
    };
    _constructionDoors: {
        [characterId: string]: ConstructionDoor;
    };
    _constructionSimple: {
        [characterId: string]: ConstructionChildEntity;
    };
    _lootableProps: {
        [characterId: string]: LootableProp;
    };
    _worldLootableConstruction: {
        [characterId: string]: LootableConstructionEntity;
    };
    _worldSimpleConstruction: {
        [characterId: string]: ConstructionChildEntity;
    };
    _speedTrees: any;
    _speedTreesCounter: any;
    _gameTime: any;
    readonly _serverTime: number;
    _startTime: number;
    _startGameTime: number;
    _timeMultiplier: number;
    _cycleSpeed: number;
    _frozeCycle: boolean;
    tickRate: number;
    worldRoutineRate: number;
    _transientIds: {
        [transientId: number]: string;
    };
    _characterIds: {
        [characterId: string]: number;
    };
    readonly _loginServerInfo: {
        address?: string;
        port: number;
    };
    worldRoutineTimer: NodeJS.Timeout;
    _charactersRenderDistance: number;
    _allowedCommands: string[];
    _interactionDistance: number;
    _pingTimeoutTime: number;
    weather: Weather;
    _packetHandlers: zonePacketHandlers;
    _weatherTemplates: any;
    worldObjectManager: WorldObjectManager;
    weatherManager: WeatherManager;
    worldDataManager: WorldDataManager;
    hookManager: HookManager;
    _ready: boolean;
    _itemDefinitions: {
        [itemDefinitionId: number]: any;
    };
    _weaponDefinitions: {
        [weaponDefinitionId: number]: any;
    };
    _firegroupDefinitions: {
        [firegroupId: number]: any;
    };
    _firemodeDefinitions: {
        [firemodeId: number]: any;
    };
    itemDefinitionsCache: any;
    weaponDefinitionsCache: any;
    projectileDefinitionsCache: any;
    profileDefinitionsCache: any;
    _containerDefinitions: {
        [containerDefinitionId: number]: any;
    };
    _recipes: {
        [recipeId: number]: Recipe;
    };
    lastItemGuid: bigint;
    private readonly _transientIdGenerator;
    _packetsStats: Record<string, number>;
    enableWorldSaves: boolean;
    readonly worldSaveVersion: number;
    readonly gameVersion: GAME_VERSIONS;
    private _proximityItemsDistance;
    constructor(serverPort: number, gatewayKey: Uint8Array, mongoAddress?: string, worldId?: number, internalServerPort?: number);
    onZoneLoginEvent(client: Client): void;
    onZoneDataEvent(client: Client, packet: any): void;
    onCharacterCreateRequest(client: any, packet: any): Promise<void>;
    onClientIsAdminRequest(client: any, packet: any): Promise<void>;
    getProximityItems(character: Character): ClientUpdateProximateItems;
    pGetRecipes(): any[];
    sendCharacterData(client: Client): Promise<void>;
    /**
     * Caches item definitons so they aren't packed every time a client logs in.
     */
    private packItemDefinitions;
    /**
     * Caches weapon definitons so they aren't packed every time a client logs in.
     */
    private packWeaponDefinitions;
    /**
     * Caches projectile definitons so they aren't packed every time a client logs in.
     */
    private packProjectileDefinitions;
    /**
     * Caches profile definitons so they aren't packed every time a client logs in.
     */
    private packProfileDefinitions;
    private initializeLoginServerConnection;
    private setupServer;
    start(): Promise<void>;
    sendInitData(client: Client): void;
    private divideMapIntoGrid;
    divideLargeCells(threshold: number): void;
    pushToGridCell(obj: BaseEntity): void;
    assignChunkRenderDistance(client: Client): void;
    private worldRoutine;
    setTickRate(): void;
    deleteClient(client: Client): void;
    generateDamageRecord(targetCharacterId: string, damageInfo: DamageInfo, oldHealth: number): DamageRecord;
    sendDeathMetrics(client: Client): void;
    killCharacter(client: Client, damageInfo: DamageInfo): void;
    explosionDamage(position: Float32Array, npcTriggered: string, client?: Client): Promise<void>;
    isConstructionInSecuredArea(construction: SlottedConstructionEntity, type: string): boolean | undefined;
    sendBaseSecuredMessage(client: Client): void;
    checkConstructionDamage(constructionCharId: string, damage: number, dictionary: any, position: Float32Array, entityPosition: Float32Array): void;
    createProjectileNpc(client: Client, data: any): void;
    respawnPlayer(client: Client): Promise<void>;
    speedTreeDestroy(packet: any): void;
    speedTreeUse(client: Client, packet: any): void;
    speedFairPlayCheck(client: Client, sequenceTime: number, position: Float32Array): void;
    hitMissFairPlayCheck(client: Client, hit: boolean, hitLocation: string): void;
    updateResource(client: Client, entityId: string, value: number, resourceId: number, resourceType?: number): void;
    updateResourceToAllWithSpawnedEntity(entityId: string, value: number, resourceId: number, resourceType: number, dictionary: any): void;
    getEntityType(entityKey: string): number;
    getLootableEntity(entityKey: string): BaseLootableEntity | undefined;
    getConstructionEntity(entityKey: string): ConstructionEntity | undefined;
    getConstructionDictionary(entityKey: string): any | undefined;
    getEntity(entityKey: string): BaseEntity | undefined;
    damageItem(client: Client, item: LoadoutItem, damage: number): void;
    getClientByCharId(characterId: string): Client | undefined;
    getClientByNameOrLoginSession(name: string): Client | string | undefined;
    checkHelmet(characterId: string, damage: number, helmetDamageDivder?: number): number;
    checkArmor(characterId: string, damage: any, kevlarDamageDivider?: number): number;
    sendHitmarker(client: Client, hitLocation: string | undefined, hasHelmet: boolean, hasArmor: boolean, hasHelmetBefore: boolean, hasArmorBefore: boolean): void;
    getWeaponHitEffect(itemDefinitionId?: Items): 1302 | 5414 | 1165;
    getProjectileDamage(itemDefinitionId: Items, sourcePos: Float32Array, targetPos: Float32Array): number;
    registerHit(client: Client, packet: any): void;
    setGodMode(client: Client, godMode: boolean): void;
    tempGodMode(client: Client, durationMs: number): void;
    updateCharacterState(client: Client, characterId: string, object: any, sendToAll: boolean): void;
    customizeDTO(client: Client): void;
    sendWeatherUpdatePacket(client: Client, weather: Weather, broadcast?: boolean): void;
    forceTime(time: number): void;
    removeForcedTime(): void;
    private constructionShouldHideEntity;
    private shouldRemoveEntity;
    private removeOutOfDistanceEntities;
    despawnEntity(characterId: string): void;
    deleteEntity(characterId: string, dictionary: any, effectId?: number, timeToDisappear?: number): void;
    sendManagedObjectResponseControlPacket(client: Client, obj: zone2016packets): void;
    addLightweightNpc(client: Client, entity: BaseLightweightCharacter, nameId?: number): void;
    addSimpleNpc(client: Client, entity: BaseSimpleNpc): void;
    checkFoundationPermission(client: Client, foundation: ConstructionParentEntity): boolean;
    checkConstructionChildEntityPermission(client: Client, construction: ConstructionChildEntity): boolean;
    constructionHidePlayer(client: Client, constructionGuid: string, state: boolean): void;
    tpPlayerOutsideFoundation(client: Client, foundation: ConstructionParentEntity, tpUp?: boolean): void;
    private npcDespawner;
    private plantManager;
    private spawnConstructionFreeplace;
    private spawnConstructionParent;
    private spawnConstructionDoor;
    private spawnSimpleConstruction;
    private spawnLootableConstruction;
    private spawnConstructionTree;
    constructionManager(client: Client): void;
    /**
     * Manages the spawning of WORLD parented free-place construction entities, such as storage containers placed directly on the ground.
     *
     */
    private worldConstructionManager;
    spawnCharacters(client: Client): void;
    spawnCharacterToOtherClients(character: Character): void;
    private itemDespawner;
    private lootbagDespawner;
    private spawnGridObjects;
    private POIManager;
    logStats(): void;
    private _sendData;
    sendUnbufferedData(client: Client, packetName: h1z1PacketsType2016, obj: zone2016packets): void;
    sendData(client: Client, packetName: h1z1PacketsType2016, obj: zone2016packets): void;
    sendWeaponData(client: Client, packetName: weaponPacketsType, obj: zone2016packets): void;
    sendRemoteWeaponData(client: Client, transientId: number, packetName: remoteWeaponPacketsType, obj: zone2016packets): void;
    sendRemoteWeaponDataToAllOthers(client: Client, transientId: number, packetName: remoteWeaponPacketsType, obj: any): void;
    sendRemoteWeaponUpdateData(client: Client, transientId: number, weaponGuid: string, packetName: remoteWeaponUpdatePacketsType, obj: zone2016packets): void;
    sendRemoteWeaponUpdateDataToAllOthers(client: Client, transientId: number, weaponGuid: string, packetName: remoteWeaponUpdatePacketsType, obj: any): void;
    sendAlert(client: Client, message: string): void;
    sendAlertToAll(message: string): void;
    sendChat(client: Client, message: string): void;
    sendChatToAllInRange(client: Client, message: string, range: number): void;
    sendChatToAllWithRadio(client: Client, message: string): void;
    createClient(sessionId: number, soeClientId: string, loginSessionId: string, characterId: string, generatedTransient: number): Client;
    isClientBanned(client: Client): Promise<boolean>;
    banClient(client: Client, reason: string, banType: string, adminName: string, timestamp: number): void;
    enforceBan(client: Client): void;
    kickPlayer(client: Client): void;
    getDateString(timestamp: number): string;
    getCurrentTime(): number;
    getGameTime(): number;
    sendGameTimeSync(client: Client): void;
    sendRawToAllOthersWithSpawnedCharacter(client: Client, entityCharacterId: string | undefined, data: any): void;
    vehicleManager(client: Client): void;
    assignManagedObject(client: Client, vehicle: Vehicle): void;
    dropManagedObject(client: Client, vehicle: Vehicle, keepManaged?: boolean): void;
    takeoverManagedObject(newClient: Client, vehicle: Vehicle): void;
    sendCompositeEffectToAllWithSpawnedEntity(dictionary: {
        [id: string]: any;
    }, object: BaseEntity, effectId: number): void;
    sendCompositeEffectToAllInRange(range: number, characterId: string, position: Float32Array, effectId: number): void;
    sendDataToAllWithSpawnedEntity(dictionary: {
        [id: string]: any;
    }, entityCharacterId: string | undefined, packetName: h1z1PacketsType2016, obj: zone2016packets): void;
    sendDataToAllInRange(range: number, position: Float32Array, packetName: any, obj: any): void;
    sendDataToAllOthersWithSpawnedEntity(dictionary: {
        [id: string]: any;
    }, client: Client, entityCharacterId: string | undefined, packetName: h1z1PacketsType2016, obj: zone2016packets): void;
    sendConstructionData(client: Client): void;
    placement(client: Client, itemDefinitionId: number, modelId: number, position: Float32Array, rotation: Float32Array, parentObjectCharacterId: string, BuildingSlot: string): void;
    handleConstructionPlacement(client: Client, itemDefinitionId: number, modelId: number, position: Float32Array, rotation: Float32Array, parentObjectCharacterId: string, BuildingSlot: string, freeplaceParentCharacterId?: string): boolean;
    placeConstructionShelter(client: Client, itemDefinitionId: number, modelId: number, rotation: Float32Array, parentObjectCharacterId: string, BuildingSlot: string): boolean;
    placeConstructionWall(client: Client, itemDefinitionId: number, modelId: number, parentObjectCharacterId: string, BuildingSlot: string): boolean;
    placeConstructionRamp(client: Client, itemDefinitionId: number, modelId: number, parentObjectCharacterId: string, BuildingSlot: string): boolean;
    placeConstructionStairs(client: Client, itemDefinitionId: number, modelId: number, rotation: Float32Array, parentObjectCharacterId: string, BuildingSlot: string): boolean;
    placeConstructionDoor(client: Client, itemDefinitionId: number, modelId: number, parentObjectCharacterId: string, BuildingSlot: string): boolean;
    placeConstructionFoundation(client: Client, itemDefinitionId: number, modelId: number, position: Float32Array, rotation: Float32Array, parentObjectCharacterId: string, BuildingSlot?: string): boolean;
    placeTemporaryEntity(modelId: number, position: Float32Array, rotation: Float32Array, time: number): boolean;
    placeTrap(itemDefinitionId: number, modelId: number, position: Float32Array, rotation: Float32Array): boolean;
    placeExplosiveEntity(itemDefinitionId: Items, modelId: number, position: Float32Array, rotation: Float32Array): boolean;
    undoPlacementInteractionString(entity: ConstructionEntity, client: Client): void;
    placeLootableConstruction(client: Client, itemDefinitionId: number, modelId: number, position: Float32Array, rotation: Float32Array, parentObjectCharacterId?: string): boolean;
    placeSmeltingEntity(client: Client, itemDefinitionId: number, modelId: number, position: Float32Array, rotation: Float32Array, parentObjectCharacterId?: string): boolean;
    placeCollectingEntity(client: Client, itemDefinitionId: number, modelId: number, position: Float32Array, rotation: Float32Array, parentObjectCharacterId?: string): boolean;
    placePlantingDiameter(modelId: number, position: Float32Array, rotation: Float32Array): boolean;
    placePlantOnDiameter(modelId: number, position: Float32Array, rotation: Float32Array, slot: string, parentObjectCharacterId: string, itemDefinitionId: number): boolean;
    mountVehicle(client: Client, vehicleGuid: string): void;
    dismountVehicle(client: Client): void;
    changeSeat(client: Client, packet: any): void;
    startTimer(client: Client, stringId: number, time: number): void;
    reloadInterrupt(client: Client, weaponItem: LoadoutItem): void;
    combatLog(client: Client): void;
    addItem(client: Client, item: BaseItem, containerDefinitionId: number, character?: BaseFullCharacter): void;
    equipContainerItem(client: Client, item: BaseItem, slotId: number): void;
    generateRandomEquipmentsFromAnEntity(entity: BaseFullCharacter, slots: number[], excludedModels?: string[]): void;
    generateRandomEquipmentForSlot(slotId: number, gender: number, excludedModels?: string[]): {
        modelName: string;
        slotId: number;
        textureAlias: any;
        guid: string;
    };
    /**
     * Gets the item definition for a given itemDefinitionId
     * @param itemDefinitionId The id of the itemdefinition to retrieve.
     */
    getItemDefinition(itemDefinitionId?: number): any;
    /**
     * Gets the weapon definition for a given weaponDefinitionId.
     * @param weaponDefinitionId The id of the weapondefinition to retrieve.
     */
    getWeaponDefinition(weaponDefinitionId: number): any;
    /**
     * Gets the firegroup definition for a given firegroupId.
     * @param firegroupId The id of the firegroupDefinition to retrieve.
     */
    getFiregroupDefinition(firegroupId: number): any;
    /**
     * Gets the firemode definition for a given firemodeId.
     * @param firemodeId The id of the firemodeDefinition to retrieve.
     */
    getFiremodeDefinition(firemodeId: number): any;
    /**
     * Gets the ammoId for a given weapon.
     * @param itemDefinitionId The itemDefinitionId of the weapon.
     */
    getWeaponAmmoId(itemDefinitionId: number): number;
    /**
     * Gets the reload time in ms for a given weapon.
     * @param itemDefinitionId The itemDefinitionId of the weapon.
     */
    getWeaponReloadTime(itemDefinitionId: number): number;
    /**
     * Gets the clip size for a given weapon.
     * @param itemDefinitionId The itemDefinitionId of the weapon.
     */
    getWeaponClipSize(itemDefinitionId: number): number;
    /**
     * Gets the maximum amount of ammo a clip can hold for a given weapon.
     * @param itemDefinitionId The itemDefinitionId of the weapon.
     */
    getWeaponMaxAmmo(itemDefinitionId: number): number;
    /**
     * Gets the container definition for a given containerDefinitionId.
     * @param containerDefinitionId The id of the container definition to retrieve.
     */
    getContainerDefinition(containerDefinitionId: any): any;
    /**
     * Generates and returns an unused itemGuid.
     */
    generateItemGuid(): bigint;
    generateItem(itemDefinitionId: number, count?: number): BaseItem | undefined;
    isWeapon(itemDefinitionId: number): boolean;
    isContainer(itemDefinitionId: number): boolean;
    isArmor(itemDefinitionId: number): boolean;
    isHelmet(itemDefinitionId: number): boolean;
    isStackable(itemDefinitionId: number): boolean;
    validateEquipmentSlot(itemDefinitionId: number, equipmentSlotId: number): boolean;
    /**
     * Validates that a given itemDefinitionId can be equipped in a given loadout slot.
     * @param itemDefId The definition ID of an item to validate.
     * @param loadoutSlotId The loadoutSlotId to have the item validated for.
     * @returns Returns true/false if the item can go in a specified loadout slot.
     */
    validateLoadoutSlot(itemDefinitionId: number, loadoutSlotId: number, loadoutId: number): boolean;
    /**
     * Gets the first loadout slot that a specified item is able to go into.
     * @param itemDefId The definition ID of an item to check.
     * @param loadoutId Optional: The loadoutId of the entity to get the slot for, default LoadoutIds.CHARACTER.
     * @returns Returns the ID of the first loadout slot that an item can go into (occupied or not).
     */
    getLoadoutSlot(itemDefId: number, loadoutId?: number): any;
    switchLoadoutSlot(client: Client, loadoutItem: LoadoutItem): void;
    /**
     * Clears a client's equipmentSlot.
     * @param client The client to have their equipment slot cleared.
     * @param equipmentSlotId The equipment slot to clear.
     * @returns Returns true if the slot was cleared, false if the slot is invalid.
     */
    clearEquipmentSlot(client: Client, equipmentSlotId: number): boolean;
    /**
     * Removes an item from the loadout.
     * @param client The client to have their items removed.
     * @param loadoutSlotId The loadout slot containing the item to remove.
     * @returns Returns true if the item was successfully removed, false if there was an error.
     */
    removeLoadoutItem(client: Client, loadoutSlotId: number): boolean;
    /**
     * Returns a client object by either the characterId of the passed character, or the mountedCharacterId if the passed character is a BaseLootableEntity.
     * @param character Either a Character or BaseLootableEntity to retrieve it's accessing client.
     * @returns Returns client or undefined.
     */
    getClientByContainerAccessor(character: BaseFullCharacter): Client | undefined;
    /**
     * Removes items from a specific item stack in a container.
     * @param client The client to have their items removed.
     * @param item The item object.
     * @param container The container that has the item stack in it.
     * @param requiredCount Optional: The number of items to remove from the stack, default 1.
     * @returns Returns true if the items were successfully removed, false if there was an error.
     */
    removeContainerItem(character: BaseFullCharacter, item?: BaseItem, container?: LoadoutContainer, count?: number): boolean;
    /**
     * Removes items from an specific item stack in the inventory, including containers and loadout.
     * @param client The client to have their items removed.
     * @param item The item object.
     * @param requiredCount Optional: The number of items to remove from the stack, default 1.
     * @returns Returns true if the items were successfully removed, false if there was an error.
     */
    removeInventoryItem(client: Client, item: BaseItem, count?: number): boolean;
    /**
     * Removes a specified amount of an item across all inventory containers /
     * loadout (LOADOUT DISABLED FOR NOW).
     * @param client The client to have its items removed.
     * @param itemDefinitionId The itemDefinitionId of the item(s) to be removed.
     * @param requiredCount Optional: The number of items to remove, default 1.
     * @returns Returns true if all items were successfully removed, false if there was an error.
     */
    removeInventoryItems(client: Client, itemDefinitionId: number, requiredCount?: number): boolean;
    /**
     * Removes a single item type from the inventory and spawns it on the ground
     * @param client The client to have its item dropped.
     * @param item The item object.
     * @param count Optional: The number of items to drop on the ground, default 1.
     */
    dropItem(client: Client, item: BaseItem, count?: number): void;
    pickupItem(client: Client, guid: string): void;
    deleteItem(client: Client, itemGuid: string): void;
    initializeContainerList(client: Client, character?: BaseFullCharacter): void;
    updateContainer(client: Client, container?: LoadoutContainer): void;
    addContainerItem(character: BaseFullCharacter, item: BaseItem | undefined, container: LoadoutContainer, count: number, sendUpdate?: boolean): void;
    updateLoadoutItem(client: Client, item: LoadoutItem): void;
    addContainerItemExternal(characterId: string, item: BaseItem | undefined, container: LoadoutContainer, count: number): void;
    updateContainerItem(client: Client, item: BaseItem, container?: LoadoutContainer): void;
    /**
     * Clears all items from a character's inventory.
     * @param client The client that'll have it's character's inventory cleared.
     */
    clearInventory(client: Client): void;
    isAdminItem(itemDefinitionId: Items): boolean;
    useConsumable(client: Client, item: BaseItem): void;
    igniteOption(client: Client, item: BaseItem): void;
    fillPass(client: Client, item: BaseItem): void;
    sniffPass(client: Client, item: BaseItem): void;
    fertilizePlants(client: Client, item: BaseItem): void;
    useItem(client: Client, item: BaseItem): void;
    sliceItem(client: Client, item: BaseItem): void;
    refuelVehicle(client: Client, item: BaseItem, vehicleGuid: string): void;
    shredItem(client: Client, item: BaseItem): void;
    salvageAmmo(client: Client, item: BaseItem): void;
    useComsumablePass(client: Client, item: BaseItem, eatCount: number, drinkCount: number, staminaCount: number, givetrash: number, healCount: number, bandagingCount: number): void;
    slicePass(client: Client, item: BaseItem): void;
    igniteoptionPass(client: Client): void;
    refuelVehiclePass(client: Client, item: BaseItem, vehicleGuid: string, fuelValue: number): void;
    shredItemPass(client: Client, item: BaseItem, count: number): void;
    salvageItemPass(client: Client, item: BaseItem, count: number): void;
    pUtilizeHudTimer: (arg1: Client, arg2: number, arg3: number) => Promise<unknown>;
    stopHudTimer(client: Client): void;
    utilizeHudTimer(client: Client, nameId: number, timeout: number, callback: any): void;
    containerError(client: Client, error: ContainerErrors): void;
    placementError(client: Client, error: ConstructionErrors): void;
    clearMovementModifiers(client: Client): void;
    applyMovementModifier(client: Client, modifier: MovementModifiers): void;
    multiplyMovementModifier(client: Client, modifier: number): void;
    divideMovementModifier(client: Client, modifier: number): void;
    checkConveys(client: Client, character?: Character): void;
    reloadZonePacketHandlers(): Promise<void>;
    generateGuid(): string;
    getSoeClient(soeClientId: string): SOEClient | undefined;
    private _sendRawData;
    sendRawData(client: Client, data: Buffer): void;
    sendUnbufferedRawData(client: Client, data: Buffer): void;
    sendChatText(client: Client, message: string, clearChat?: boolean): void;
    getAllCurrentUsedTransientId(): any;
    private fetchLoginInfo;
    executeFuncForAllReadyClients(callback: (client: Client) => void): void;
    executeFuncForAllReadyClientsInRange(callback: (client: Client) => void, entity: BaseEntity): void;
    startClientRoutine(client: Client): void;
    executeRoutine(client: Client): void;
    private _sendDataToAll;
    sendDataToAll(packetName: h1z1PacketsType2016, obj: zone2016packets): void;
    sendUnbufferedDataToAll(packetName: h1z1PacketsType2016, obj: zone2016packets): void;
    dropVehicleManager(client: Client, vehicleGuid: string): void;
    sendZonePopulationUpdate(): void;
    sendChatTextToAllOthers(client: Client, message: string, clearChat?: boolean): void;
    sendChatTextToAdmins(message: string, clearChat?: boolean): void;
    sendGlobalChatText(message: string, clearChat?: boolean): void;
    private filterOutOfDistance;
    getServerTimeTest(): number;
    getServerTime(): number;
    dismissVehicle(vehicleGuid: string): void;
    /**
     * Generates a new transientId and maps it to a provided characterId.
     * @param characterId The characterId to map the transientId to.
     */
    getTransientId(characterId: string): number;
    /**
     * Reloads all packet handlers, structures, and commands for the entire server.
     * @param client The client that called the function.
     */
    reloadPackets(client: Client): void;
    /**
     * Disconnects a client from the zone.
     * @param client The client to be disconnected
     */
    timeoutClient(client: Client): void;
    toggleFog(): number;
    pSetImmediate: typeof import("timers/promises").setImmediate;
    pSetTimeout: typeof import("timers/promises").setTimeout;
}
