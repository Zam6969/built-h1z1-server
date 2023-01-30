import { characterEquipment } from "../../../types/zoneserver";
import { ZoneServer2015 } from "../zoneserver";
import { ZoneClient } from "./zoneclient";
export declare class Character {
    characterId: string;
    transientId: number;
    name?: string;
    loadouts?: any;
    extraModel?: string;
    resourcesUpdater?: any;
    healingInterval?: any;
    healingTicks: number;
    healingMaxTicks: number;
    equipment: characterEquipment[];
    resources: {
        health: number;
        stamina: number;
        virus: number;
        food: number;
        water: number;
    };
    currentLoadoutTab?: number;
    currentLoadoutId?: number;
    currentLoadout?: number;
    guid?: string;
    inventory?: Array<any>;
    factionId?: number;
    spawnLocation?: string;
    godMode: boolean;
    state: {
        position: Float32Array;
        rotation: Float32Array;
        lookAt: Float32Array;
        health: number;
        shield: number;
    };
    characterStates: any;
    isRunning: boolean;
    isHidden: boolean;
    isBleeding: boolean;
    isBandaged: boolean;
    isExhausted: boolean;
    isAlive: boolean;
    isSonic: boolean;
    isMoving: boolean;
    constructor(characterId: string, generatedTransient: number);
    startRessourceUpdater(client: ZoneClient, server: ZoneServer2015): void;
}
