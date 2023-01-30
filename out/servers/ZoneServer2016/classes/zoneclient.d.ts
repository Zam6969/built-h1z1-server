/// <reference types="node" />
import { Character2016 } from "../entities/character";
import { ZoneClient2016 as Client } from "./zoneclient";
import { LootableProp } from "../entities/lootableprop";
import { ZoneServer2016 } from "../zoneserver";
export declare class ZoneClient2016 {
    guid?: string;
    character: Character2016;
    currentPOI?: number;
    firstLoading: boolean;
    isLoading: boolean;
    characterReleased: boolean;
    isInteracting: boolean;
    isAdmin: boolean;
    isDebugMode: boolean;
    banType: string;
    HWID: string;
    posAtLastRoutine: Float32Array;
    posAtLogoutStart: Float32Array;
    oldPos: {
        position: Float32Array;
        time: number;
    };
    speedWarnsNumber: number;
    allowedProjectiles: number;
    pvpStats: {
        shotsFired: number;
        shotsHit: number;
        head: number;
        spine: number;
        hands: number;
        legs: number;
    };
    clientLogs: {
        log: string;
        isSuspicious: boolean;
    }[];
    reports: number;
    lastDeathReport?: {
        position: Float32Array;
        attackerPosition: Float32Array;
        distance: number;
        attacker: Client;
    };
    hudTimer?: NodeJS.Timeout | null;
    spawnedDTOs: any[];
    spawnedEntities: any[];
    searchedProps: LootableProp[];
    managedObjects: string[];
    vehicle: {
        mountedVehicle?: string;
    };
    radio: boolean;
    npcsToSpawnTimer: NodeJS.Timeout;
    loginSessionId: string;
    pingTimer: NodeJS.Timeout | undefined;
    clearHudTimer: () => void;
    clearTimers: () => void;
    sessionId: number;
    soeClientId: string;
    lastKeepAliveTime: number;
    pings: number[];
    avgPing: number;
    avgPingLen: number;
    pingWarnings: number;
    isWeaponLock: boolean;
    avgPingReady: boolean;
    chunkRenderDistance: number;
    routineInterval?: NodeJS.Timeout;
    routineCounter: number;
    constructor(sessionId: number, soeClientId: string, loginSessionId: string, characterId: string, transientId: number, server: ZoneServer2016);
    addPing(ping: number): void;
    updateAvgPing(): void;
}
