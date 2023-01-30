export type soePacket = any;
export type crc_length_options = 0 | 2;
export type dataCache = {
    [sequence: number]: {
        data: Uint8Array;
        fragment: boolean;
    };
};
