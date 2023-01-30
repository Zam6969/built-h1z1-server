/// <reference types="node" />
import { Character } from "./character";
export declare class ZoneClient {
    currentPOI?: number;
    firstLoading: boolean;
    isLoading: boolean;
    isInteracting: boolean;
    isAdmin: boolean;
    posAtLastRoutine: Float32Array;
    posAtLogoutStart: Float32Array;
    hudTimer: any;
    spawnedDTOs: any[];
    spawnedEntities: any[];
    managedObjects: string[];
    vehicle: {
        falling: number;
        mountedVehicle?: string;
        mountedVehicleType?: string;
        mountedVehicleSeat?: number;
        vehicleState: number;
        vehicleSeat: number;
    };
    npcsToSpawn: any[];
    npcsToSpawnTimer: NodeJS.Timeout;
    character: Character;
    loginSessionId: string;
    pingTimer: NodeJS.Timeout | undefined;
    savePositionTimer: any;
    clearHudTimer: () => void;
    clearTimers: () => void;
    sessionId: number;
    soeClientId: string;
    constructor(sessionId: number, soeClientId: string, loginSessionId: string, characterId: string, generatedTransient: number);
}
