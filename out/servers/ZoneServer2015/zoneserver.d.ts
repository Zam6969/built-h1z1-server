/// <reference types="node" />
/// <reference types="node" />
import { EventEmitter } from "events";
import { GatewayServer } from "../GatewayServer/gatewayserver";
import { H1Z1Protocol as ZoneProtocol } from "../../protocols/h1z1protocol";
import { H1emuZoneServer } from "../H1emuServer/h1emuZoneServer";
import { Weather } from "../../types/zoneserver";
import { Db, MongoClient } from "mongodb";
import SOEClient from "../SoeServer/soeclient";
import { ZoneClient as Client } from "./classes/zoneclient";
import { h1z1PacketsType } from "../../types/packets";
import { Vehicle } from "./classes/vehicle";
import { zonePacketHandlers } from "./zonepackethandlers";
import { zone2015packets } from "types/zone2015packets";
import { GAME_VERSIONS } from "../../utils/enums";
export declare class ZoneServer2015 extends EventEmitter {
    _gatewayServer: GatewayServer;
    _protocol: ZoneProtocol;
    _db: Db | undefined;
    _soloMode: any;
    _mongoClient?: MongoClient;
    _mongoAddress: string;
    _clients: {
        [characterId: string]: Client;
    };
    _characters: any;
    _gameTime: any;
    _time: number;
    _serverTime: any;
    _transientIds: any;
    _packetHandlers: zonePacketHandlers;
    _startTime: number;
    _startGameTime: number;
    _timeMultiplier: number;
    _cycleSpeed: number;
    _frozeCycle: boolean;
    _profiles: any[];
    _items: any[];
    _weather: Weather;
    _spawnLocations: any;
    _defaultWeatherTemplate: string;
    _npcs: any;
    _objects: any;
    _pingTimeoutTime: number;
    _worldId: number;
    _npcRenderDistance: number;
    _dynamicWeatherWorker: any;
    _dynamicWeatherEnabled: boolean;
    _vehicles: {
        [characterId: string]: Vehicle;
    };
    _doors: any;
    _props: any;
    _destroyablesTimeout: any;
    _destroyables: any;
    _speedTrees: any;
    _interactionDistance: number;
    _dummySelf: any;
    _appDataFolder: string;
    _respawnOnLastPosition: boolean;
    _worldRoutineRadiusPercentage: number;
    worldRoutineTimer: any;
    tickRate: number;
    _h1emuZoneServer: H1emuZoneServer;
    _loginServerInfo: {
        address?: string;
        port: number;
    };
    _hasBeenAuthenticated: boolean;
    _clientProtocol: string;
    _allowedCommands: string[];
    _maxAllowedPing: number;
    private _transientIdGenerator;
    readonly gameVersion: GAME_VERSIONS;
    constructor(serverPort: number, gatewayKey: Uint8Array, mongoAddress?: string, worldId?: number, internalServerPort?: number);
    onCharacterCreateRequest(client: any, packet: any): Promise<void>;
    fetchLoginInfo(): Promise<void>;
    onZoneDataEvent(client: Client, packet: any): void;
    onZoneLoginEvent(client: Client): void;
    generateTransientId(characterId: string): number;
    createClient(sessionId: number, soeClientId: string, loginSessionId: string, characterId: string, generatedTransient: number): Client;
    onGatewayLoginEvent(soeClient: SOEClient, characterId: string, loginSessionId: string, clientProtocol: string): void;
    onGatewayDisconnectEvent(err: string, client: Client): void;
    getSoeClient(soeClientId: string): SOEClient | undefined;
    deleteClient(client: Client): void;
    onGatewayTunnelDataEvent(client: Client, data: Buffer, flags: number): void;
    setupServer(): Promise<void>;
    getAllCurrentUsedTransientId(): any;
    getEntityType(entityKey: string): number;
    getCollisionEntityType(entityKey: string): number;
    sendZonePopulationUpdate(): void;
    fetchWorldData(): Promise<void>;
    saveCollections(): Promise<void>;
    saveWorld(): Promise<void>;
    connectMongo(): Promise<void>;
    start(): Promise<void>;
    reloadPackets(client: Client): void;
    reloadZonePacketHandlers(): Promise<void>;
    timeoutClient(client: Client): void;
    generateGuid(): string;
    saveCharacterPosition(client: Client, refreshTimeout?: boolean): Promise<void>;
    characterData(client: Client): Promise<void>;
    generateProfiles(): any[];
    generateItems(): any[];
    sendInitData(client: Client): void;
    spawnNpcs(client: Client): void;
    POIManager(client: Client): void;
    executeFuncForAllReadyClients(callback: any): void;
    worldRoutineClient(client: Client): void;
    worldRoutine(refresh?: boolean): void;
    speedTreeDestroy(packet: any): void;
    speedTreeUse(client: Client, packet: any): void;
    setGodMode(client: Client, godMode: boolean): void;
    toggleHiddenMode(client: Client): void;
    tempGodMode(client: Client, durationMs: number): void;
    killCharacter(client: Client): void;
    playerDamage(client: Client, damage: number): void;
    respawnPlayer(client: Client): Promise<void>;
    explosionDamage(position: Float32Array, npcTriggered: string): void;
    damageVehicle(damage: number, vehicle: Vehicle, loopDamageMs?: number): void;
    DTOhit(client: Client, packet: any): void;
    updateResource(client: Client, entityId: string, value: number, resource: number, resourceType: number): void;
    updateCharacterState(client: Client, characterId: string, object: any, sendToAll: boolean): void;
    turnOnEngine(vehicleGuid: string): void;
    turnOffEngine(vehicleGuid: string): void;
    manageVehicle(client: Client, vehicleGuid: string): void;
    sendManagedObjectResponseControlPacket(client: Client, obj: any): void;
    dropVehicleManager(client: Client, vehicleGuid: string): void;
    enterVehicle(client: Client, entityData: any): void;
    dismountVehicle(client: Client, vehicleGuid: any): void;
    dismissVehicle(vehicleGuid: string): void;
    dropPlayerInParachute(client: Client, position: Float32Array): void;
    updatePosition(client: Client, position: Float32Array): void;
    spawnCharacters(client: Client): void;
    spawnVehicles(client: Client): void;
    filterOutOfDistance(element: any, playerPosition: Float32Array): boolean;
    removeOutOfDistanceEntities(client: Client): void;
    spawnObjects(client: Client): void;
    spawnNpcCollection(client: Client, collection: any): void;
    spawnDoors(client: Client): void;
    spawnProps(client: Client): void;
    customizeDTO(client: Client): void;
    spawnDTOs(client: Client): void;
    respawnDTO(DTO: string): void;
    setDTOrespawnTimeout(DTO: string): void;
    despawnEntity(characterId: string): void;
    deleteEntity(characterId: string, dictionnary: any): void;
    vehicleDelete(client: Client): void;
    createEntity(modelID: number, position: Array<number>, rotation: Array<number>, dictionnary: any): void;
    createAllObjects(): void;
    data(collectionName: string): any;
    SendZoneDetailsPacket(client: Client, weather: Weather): void;
    SendSkyChangedPacket(client: Client, weather: Weather, isGlobal?: boolean): void;
    changeWeatherWithTemplate(client: Client, weatherTemplate: string): Promise<void>;
    changeWeather(client: Client, weather: Weather): void;
    sendSystemMessage(message: string): void;
    sendChat(client: Client, message: string, channel: number): void;
    sendGlobalChatText(message: string, clearChat?: boolean): void;
    sendGlobalTextAlert(message: string): void;
    sendTextAlert(client: Client, message: string): void;
    sendChatText(client: Client, message: string, clearChat?: boolean): void;
    setCharacterLoadout(client: Client, loadoutId: number, loadoutTab: number): void;
    sendData(client: Client, packetName: h1z1PacketsType, obj: zone2015packets): void;
    sendDataToAll(packetName: h1z1PacketsType, obj: any): void;
    sendDataToAllOthers(client: Client, packetName: h1z1PacketsType, obj: any): void;
    sendRawToAll(data: Buffer): void;
    sendRawToAllOthers(client: Client, data: Buffer): void;
    sendWeaponPacket(client: Client, packetName: string, obj: any): void;
    sendRawData(client: Client, data: Buffer): void;
    stop(): void;
    forceTime(time: number): void;
    removeForcedTime(): void;
    getCurrentTime(): number;
    getGameTime(): number;
    getServerTime(): number;
    getSequenceTime(): number;
    getServerTimeTest(): number;
    sendGameTimeSync(client: Client): void;
    getTransientId(characterId: string): number;
    createPositionUpdate(position: Float32Array, rotation?: any): any;
}