export declare class LogicalPacket {
    sequence?: number;
    data: Uint8Array;
    isReliable: boolean;
    constructor(data: Uint8Array, sequence?: number);
}
