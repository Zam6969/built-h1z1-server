/// <reference types="node" />
import { H1z1ProtocolReadingFormat } from "../types/protocols";
export interface UpdatePositionObject {
    raw: Buffer;
    flags: any;
    sequenceTime: any;
    unknown3_int8: any;
    stance: any;
    position: any;
    orientation: any;
    frontTilt: any;
    sideTilt: any;
    angleChange: any;
    verticalSpeed: any;
    horizontalSpeed: any;
    unknown12_float: any;
    rotationRaw: any;
    lookAt: any;
    rotation: any;
    direction: any;
    engineRPM: any;
}
interface PositionZoneToClient {
    unknown1_uint: number;
    positionData: UpdatePositionObject;
}
export declare class H1Z1Protocol {
    H1Z1Packets: any;
    protocolName: string;
    PlayerUpdateManagedPositionOpcode: number;
    VehicleCollisionOpcode: number;
    VehicleDimissOpcode: number;
    weaponOpcode: number;
    constructor(protocolName?: string);
    createPositionBroadcast(rawData: Buffer, transientId: number): Buffer;
    createPositionBroadcast2016(rawData: Buffer, transientId: number): Buffer;
    createVehiclePositionBroadcast(rawData: Buffer): Buffer;
    createVehiclePositionBroadcast2016(rawData: Buffer, transientId: number): Buffer;
    parseFacilityReferenceData(data: Buffer): any;
    parseWeaponDefinitionReferenceData(data: Buffer): any;
    parseUpdatePositionClientToZone(data: Buffer, offset: number): {
        result: UpdatePositionObject;
    };
    parseUpdatePositionRaw(data: Buffer): {
        result: UpdatePositionObject;
    };
    parseUpdatePositionZoneToClient(data: Buffer, offset: number): {
        result: PositionZoneToClient;
    };
    pack(packetName: string, object?: any): Buffer | null;
    resolveOpcode(opCode: number, data: Buffer): any[];
    parse(data: Buffer, flag: number): H1z1ProtocolReadingFormat | null;
    reloadPacketDefinitions(): void;
}
export {};
