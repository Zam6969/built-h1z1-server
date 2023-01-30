/// <reference types="node" />
import { Collection, MongoClient } from "mongodb";
import { ZoneServer2016 } from "servers/ZoneServer2016/zoneserver";
import { ZoneServer2015 } from "servers/ZoneServer2015/zoneserver";
import { ConstructionSlotPositionMap, positionUpdate, SquareBounds } from "types/zoneserver";
import { ConstructionSlots } from "servers/ZoneServer2016/data/constructionslots";
import { ConstructionParentEntity } from "servers/ZoneServer2016/entities/constructionparententity";
import { ConstructionChildEntity } from "servers/ZoneServer2016/entities/constructionchildentity";
import { NAME_VALIDATION_STATUS } from "./enums";
import { Resolver } from "dns";
import { ZoneClient2016 } from "servers/ZoneServer2016/classes/zoneclient";
export declare class customLodash {
    sum(pings: number[]): number;
    cloneDeep(value: unknown): any;
    find(array: any[], filter: any): any;
    isEqual(array1: any[], array2: any[]): boolean;
    forEach(object: Record<string, unknown>, callback: (arg0: any) => void): void;
    size(object: Record<string, unknown>): number;
    fill(array: any[], object: any): any[];
    delete(array: any[], entry: any): void;
}
export declare const _: customLodash;
export declare function isQuat(rotation: Float32Array): Float32Array;
export declare function eul2quat(angle: Float32Array): Float32Array;
export declare function quat2matrix(angle: Float32Array): any;
export declare function eul2quatLegacy(angle: number[]): number[];
export declare function movePoint(position: Float32Array, angle: number, distance: number): Float32Array;
export declare function zoneShutdown(server: ZoneServer2016 | ZoneServer2015, startedTime: number, timeLeft: number, message: string): Promise<void>;
export declare function getDifference(s1: string, s2: string): any;
export declare const randomIntFromInterval: (min: number, max: number) => number;
export declare const getAppDataFolderPath: () => string;
export declare const setupAppDataFolder: () => void;
export declare const objectIsEmpty: (obj: Record<string, unknown>) => boolean;
export declare const isInsideSquare: (point: [number, number], vs: SquareBounds | number[][]) => boolean;
export declare const isInsideCube: (point: [number, number], vs: SquareBounds, y_pos1: number, y_pos2: number, y_radius: number) => boolean;
export declare const isPosInRadius: (radius: number, player_position: Float32Array, enemi_position: Float32Array) => boolean;
export declare const isPosInRadiusWithY: (radius: number, player_position: Float32Array, enemi_position: Float32Array, y_radius: number) => boolean;
export declare function getDistance(p1: Float32Array, p2: Float32Array): number;
export declare function checkConstructionInRange(dictionary: any, position: Float32Array, range: number, itemDefinitionId: number): boolean;
export declare function createPositionUpdate(position: Float32Array, rotation: Float32Array, gameTime: number): positionUpdate;
export declare function getRectangleCorners(centerPoint: Float32Array, angle: number, offset: number, eulerRot: number): SquareBounds;
export declare const toInt: (value: number) => number;
export declare const Int64String: (value: number) => string;
export declare const generateRandomGuid: () => string;
export declare function generateTransientId(): Generator<number, void, unknown>;
export declare const removeCacheFullDir: (directoryPath: string) => void;
export declare const generateCommandList: (commandObject: string[], commandNamespace: string) => string[];
export declare class LZ4 {
    static encodeBlock: (src: any, dst: any, sIdx?: any, eIdx?: any) => number;
    static encodeBound: (isize: number) => number;
}
export declare const lz4_decompress: (data: any, inSize: number, outSize: number) => any;
export declare const initMongo: (mongoClient: MongoClient, serverName: string) => Promise<void>;
export declare const getPacketTypeBytes: (packetType: number) => number[];
export declare const clearFolderCache: (currentFolderDirname: string, folderPath: string) => void;
export declare class Scheduler {
    static yield(): Promise<void>;
    static wait(delay: number, options?: any): Promise<undefined>;
}
export declare class wrappedUint16 {
    private value;
    constructor(initValue: number);
    static wrap(value: number): number;
    add(value: number): void;
    set(value: number): void;
    get(): number;
    increment(): void;
}
export declare const toBigHex: (bigInt: bigint) => string;
export declare const toHex: (number: number) => string;
export declare const getRandomFromArray: (array: any[]) => any;
export declare const getRandomKeyFromAnObject: (object: any) => string;
export declare function calculateDamageDistFallOff(distance: number, damage: number, range: number): number;
export declare function flhash(str: string): number;
export declare function calculateOrientation(pos1: Float32Array, pos2: Float32Array): number;
export declare function getOffsetPoint(position: Float32Array, rotation: number, angle: number, distance: number): Float32Array;
export declare function getAngleAndDistance(p1: Float32Array, p2: Float32Array): {
    angle: number;
    distance: number;
};
export declare function getConstructionSlotId(buildingSlot: string): number;
export declare function registerConstructionSlots(construction: ConstructionParentEntity | ConstructionChildEntity, setSlots: ConstructionSlotPositionMap, slotDefinitions: ConstructionSlots): void;
export declare function isValidCharacterName(characterName: string): NAME_VALIDATION_STATUS.AVAILABLE | NAME_VALIDATION_STATUS.INVALID;
export declare function resolveHostAddress(resolver: Resolver, hostName: string): Promise<string[]>;
export declare function logClientActionToMongo(collection: Collection, client: ZoneClient2016, serverId: number, logMessage: Record<string, unknown>): Promise<void>;
