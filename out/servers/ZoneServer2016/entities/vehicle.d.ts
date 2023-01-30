import { ZoneClient2016 } from "../classes/zoneclient";
import { ZoneServer2016 } from "../zoneserver";
import { DamageInfo } from "types/zoneserver";
import { BaseLootableEntity } from "./baselootableentity";
export declare class Vehicle2016 extends BaseLootableEntity {
    isManaged: boolean;
    manager?: any;
    destroyedEffect: number;
    destroyedModel: number;
    minorDamageEffect: number;
    majorDamageEffect: number;
    criticalDamageEffect: number;
    supercriticalDamageEffect: number;
    engineOn: boolean;
    isLocked: number;
    positionUpdate: any;
    engineRPM: number;
    fuelUpdater: any;
    isInvulnerable: boolean;
    onDismount?: any;
    resourcesUpdater?: any;
    damageTimeout?: any;
    vehicleManager?: string;
    seats: {
        [seatId: string]: string;
    };
    vehicleId: number;
    destroyedState: number;
    positionUpdateType: number;
    currentDamageEffect: number;
    droppedManagedClient?: ZoneClient2016;
    constructor(characterId: string, transientId: number, actorModelId: number, position: Float32Array, rotation: Float32Array, server: ZoneServer2016, gameTime: number, vehicleId: number);
    getSeatCount(): number;
    getNextSeatId(server: ZoneServer2016): string | -1;
    getCharacterSeat(characterId: string): string | undefined;
    getPassengerList(): string[];
    removePassenger(characterId: string): void;
    pGetLightweightVehicle(): {
        npcData: {
            position: Float32Array;
            vehicleId: number;
            characterId: string;
            transientId: number;
            actorModelId: number;
            rotation: Float32Array;
            scale: Float32Array;
            positionUpdateType: number;
            profileId: number;
            isLightweight: boolean;
            flags: {
                flags1: {
                    bit0: number;
                    bit1: number;
                    bit2: number;
                    bit3: number;
                    bit4: number;
                    bit5: number;
                    bit6: number;
                    bit7: number;
                    bit8: number;
                    bit9: number;
                    bit10: number;
                    bit11: number;
                    projectileCollision: number;
                    bit13: number;
                    bit14: number;
                    bit15: number;
                    bit16: number;
                    bit17: number;
                    bit18: number;
                    bit19: number;
                    noCollide: number;
                    knockedOut: number;
                    bit22: number;
                    bit23: number;
                };
                flags2: {
                    bit0: number;
                    bit1: number;
                    bit2: number;
                    bit3: number;
                    bit4: number;
                    bit5: number;
                    bit6: number;
                    bit7: number;
                    bit8: number;
                    bit9: number;
                    bit10: number;
                    bit11: number;
                    projectileCollision: number;
                    bit13: number;
                    bit14: number;
                    bit15: number;
                    bit16: number;
                    bit17: number;
                    bit18: number;
                    bit19: number;
                    noCollide: number;
                    knockedOut: number;
                    bit22: number;
                    bit23: number;
                };
                flags3: {
                    bit0: number;
                    bit1: number;
                    bit2: number;
                    bit3: number;
                    bit4: number;
                    bit5: number;
                    bit6: number;
                    bit7: number;
                    bit8: number;
                    bit9: number;
                    bit10: number;
                    bit11: number;
                    projectileCollision: number;
                    bit13: number;
                    bit14: number;
                    bit15: number;
                    bit16: number;
                    bit17: number;
                    bit18: number;
                    bit19: number;
                    noCollide: number;
                    knockedOut: number;
                    bit22: number;
                    bit23: number;
                };
            };
            headActor: string;
        };
        positionUpdate: any;
    };
    pGetFullVehicle(server: ZoneServer2016): {
        npcData: {
            transientId: number;
            attachmentData: ({
                modelName: string;
                textureAlias: string;
                tintAlias: string;
                decalAlias: string;
                slotId: number;
            } | undefined)[];
            characterId: string;
            resources: {
                data: {
                    resourceType: number;
                    resourceData: {
                        resourceId: number;
                        resourceType: number;
                        value: number;
                    };
                }[];
            };
            effectTags: never[];
            unknownData1: {};
            targetData: {};
            unknownArray1: never[];
            unknownArray2: never[];
            unknownArray3: {
                data: {};
            };
            unknownArray4: {
                data: {};
            };
            unknownArray5: {
                data: {};
            };
            unknownArray6: {
                data: {};
            };
            remoteWeapons: {
                data: {};
            };
            itemsData: {
                items: any[];
                unknownDword1: number;
            };
        };
        positionUpdate: any;
        unknownArray1: never[];
        unknownArray2: never[];
        unknownArray3: never[];
        unknownArray4: never[];
        unknownArray5: {
            unknownData1: {
                unknownData1: {};
            };
        }[];
        unknownArray6: never[];
        unknownArray7: never[];
        unknownArray8: {
            unknownArray1: never[];
        }[];
    };
    pGetPassengers(server: ZoneServer2016): {
        characterId: string;
        identity: {
            characterName: string | undefined;
        };
        unknownString1: string | undefined;
        unknownByte1: number;
    }[];
    getInventoryItemId(): number;
    getTurboItemId(): number;
    getHeadlightsItemId(): number;
    getMotorItemId(): number;
    startDamageDelay(server: ZoneServer2016): void;
    damage(server: ZoneServer2016, damageInfo: DamageInfo): void;
    OnPlayerSelect(server: ZoneServer2016, client: ZoneClient2016, isInstant?: boolean): void;
    OnInteractionString(server: ZoneServer2016, client: ZoneClient2016): void;
    OnFullCharacterDataRequest(server: ZoneServer2016, client: ZoneClient2016): void;
    destroy(server: ZoneServer2016, disableExplosion?: boolean): void;
}
