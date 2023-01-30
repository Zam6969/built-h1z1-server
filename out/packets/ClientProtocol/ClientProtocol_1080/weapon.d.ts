/// <reference types="node" />
export declare function parseWeaponPacket(data: Buffer, offset: number): {
    value: any;
    length: number;
};
export declare function packWeaponPacket(obj: any): Buffer;
export declare function packRemoteWeaponPacket(obj: any): Buffer;
export declare function packRemoteWeaponUpdatePacket(obj: any): Buffer;
