import { ZoneClient as Client } from "./classes/zoneclient";
import { ZoneServer2015 } from "./zoneserver";
export declare class zonePacketHandlers {
    hax: any;
    dev: any;
    admin: any;
    ClientIsReady: (server: ZoneServer2015, client: Client, packet: any) => void;
    ClientFinishedLoading: (server: ZoneServer2015, client: Client, packet: any) => void;
    Security: (server: ZoneServer2015, client: Client, packet: any) => void;
    commandRecipeStart: (server: ZoneServer2015, client: Client, packet: any) => void;
    commandFreeInteractionNpc: (server: ZoneServer2015, client: Client, packet: any) => void;
    collisionDamage: (server: ZoneServer2015, client: Client, packet: any) => void;
    VehicleItemDefinitionRequest: (server: ZoneServer2015, client: Client, packet: any) => void;
    CurrentMoveMode: (server: ZoneServer2015, client: Client, packet: any) => void;
    lobbyGameDefinitionDefinitionsRequest: (server: ZoneServer2015, client: Client, packet: any) => void;
    playerUpdateEndCharacterAccess: (server: ZoneServer2015, client: Client, packet: any) => void;
    KeepAlive: (server: ZoneServer2015, client: Client, packet: any) => void;
    ClientLog: (server: ZoneServer2015, client: Client, packet: any) => void;
    ClientMetrics: (server: ZoneServer2015, client: Client, packet: any) => void;
    WallOfDataClientSystemInfo: (server: ZoneServer2015, client: Client, packet: any) => void;
    WallOfDataLaunchPadFingerprint: (server: ZoneServer2015, client: Client, packet: any) => void;
    wallOfDataUIEvent: (server: ZoneServer2015, client: Client, packet: any) => void;
    SetLocale: (server: ZoneServer2015, client: Client, packet: any) => void;
    GetContinentBattleInfo: (server: ZoneServer2015, client: Client, packet: any) => void;
    chatChat: (server: ZoneServer2015, client: Client, packet: any) => void;
    loadoutSelectSlot: (server: ZoneServer2015, client: Client, packet: any) => void;
    ClientInitializationDetails: (server: ZoneServer2015, client: Client, packet: any) => void;
    ClientLogout: (server: ZoneServer2015, client: Client, packet: any) => void;
    GameTimeSync: (server: ZoneServer2015, client: Client, packet: any) => void;
    Synchronization: (server: ZoneServer2015, client: Client, packet: any) => void;
    commandExecuteCommand: (server: ZoneServer2015, client: Client, packet: any) => void;
    commandSetProfile: (server: ZoneServer2015, client: Client, packet: any) => void;
    playerUpdateWeaponStance: (server: ZoneServer2015, client: Client, packet: any) => void;
    mountDismountRequest: (server: ZoneServer2015, client: Client, packet: any) => void;
    commandInteractRequest: (server: ZoneServer2015, client: Client, packet: any) => void;
    commandInteractionString: (server: ZoneServer2015, client: Client, packet: any) => void;
    commandSetInWater: (server: ZoneServer2015, client: Client, packet: any) => void;
    commandClearInWater: (server: ZoneServer2015, client: Client, packet: any) => void;
    commandInteractionSelect: (server: ZoneServer2015, client: Client, packet: any) => void;
    playerUpdateVehicleCollision: (server: ZoneServer2015, client: Client, packet: any) => void;
    vehicleDismiss: (server: ZoneServer2015, client: Client, packet: any) => void;
    vehicleSpawn: (server: ZoneServer2015, client: Client, packet: any) => void;
    vehicleAutoMount: (server: ZoneServer2015, client: Client, packet: any) => void;
    commandInteractCancel: (server: ZoneServer2015, client: Client, packet: any) => void;
    commandStartLogoutRequest: (server: ZoneServer2015, client: Client, packet: any) => void;
    CharacterSelectSessionRequest: (server: ZoneServer2015, client: Client, packet: any) => void;
    profileStatsGetPlayerProfileStats: (server: ZoneServer2015, client: Client, packet: any) => void;
    DtoHitSpeedTreeReport: (server: ZoneServer2015, client: Client, packet: any) => void;
    GetRewardBuffInfo: (server: ZoneServer2015, client: Client, packet: any) => void;
    vehicleStateData: (server: ZoneServer2015, client: Client, packet: any) => void;
    VehicleAccessType: (server: ZoneServer2015, client: Client, packet: any) => void;
    PlayerUpdateManagedPosition: (server: ZoneServer2015, client: Client, packet: any) => void;
    PlayerUpdateUpdatePositionClientToZone: (server: ZoneServer2015, client: Client, packet: any) => void;
    commandPlayerSelect: (server: ZoneServer2015, client: Client, packet: any) => void;
    constructionPlacementRequest: (server: ZoneServer2015, client: Client, packet: any) => void;
    constructionPlacementFinalizeRequest: (server: ZoneServer2015, client: Client, packet: any) => void;
    playerUpdateRespawn: (server: ZoneServer2015, client: Client, packet: any) => void;
    playerUpdateFullCharacterDataRequest: (server: ZoneServer2015, client: Client, packet: any) => void;
    commandRedeploy: (server: ZoneServer2015, client: Client, packet: any) => void;
    mountSeatChangeRequest: (server: ZoneServer2015, client: Client, packet: any) => void;
    constructor();
    processPacket(server: ZoneServer2015, client: Client, packet: any): void;
    reloadCommandCache(): Promise<void>;
}
