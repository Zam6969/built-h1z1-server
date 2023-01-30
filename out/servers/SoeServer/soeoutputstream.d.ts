/// <reference types="node" />
import { EventEmitter } from "events";
import { wrappedUint16 } from "../../utils/utils";
export declare class SOEOutputStream extends EventEmitter {
    private _useEncryption;
    private _fragmentSize;
    private _sequence;
    lastAck: wrappedUint16;
    private _cache;
    private _rc4;
    private _hadCacheError;
    constructor(cryptoKey: Uint8Array);
    addToCache(sequence: number, data: Uint8Array, isFragment: boolean): void;
    removeFromCache(sequence: number): void;
    write(data: Uint8Array, unbuffered?: boolean): void;
    ack(sequence: number, unAckData: Map<number, number>): void;
    resendData(sequence: number): void;
    isUsingEncryption(): boolean;
    setEncryption(value: boolean): void;
    toggleEncryption(): void;
    setFragmentSize(value: number): void;
}
