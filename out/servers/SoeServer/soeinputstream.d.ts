/// <reference types="node" />
/// <reference types="node" />
import { EventEmitter } from "events";
import { RC4 } from "h1emu-core";
import { wrappedUint16 } from "../../utils/utils";
type Fragment = {
    payload: Buffer;
    isFragment: boolean;
};
export declare class SOEInputStream extends EventEmitter {
    _nextSequence: wrappedUint16;
    _lastAck: wrappedUint16;
    _fragments: Map<number, Fragment>;
    _useEncryption: boolean;
    _lastProcessedSequence: number;
    _rc4: RC4;
    has_cpf: boolean;
    cpf_totalSize: number;
    cpf_dataSize: number;
    cpf_dataWithoutHeader: Buffer;
    cpf_processedFragmentsSequences: number[];
    constructor(cryptoKey: Uint8Array);
    private processSingleData;
    private processFragmentedData;
    private _processData;
    private processAppData;
    private acknowledgeInputData;
    write(data: Buffer, sequence: number, isFragment: boolean): void;
    setEncryption(value: boolean): void;
    toggleEncryption(): void;
}
export {};
