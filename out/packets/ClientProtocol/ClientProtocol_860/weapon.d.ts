/// <reference types="node" />
export declare function parseWeaponPacket(data: Buffer, offset: number): {
    value: any;
    length: number;
};
export declare function packWeaponPacket(obj: any): Buffer;
