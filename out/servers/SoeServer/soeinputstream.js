"use strict";
// ======================================================================
//
//   GNU GENERAL PUBLIC LICENSE
//   Version 3, 29 June 2007
//   copyright (C) 2020 - 2021 Quentin Gruber
//   copyright (C) 2021 - 2023 H1emu community
//
//   https://github.com/QuentinGruber/h1z1-server
//   https://www.npmjs.com/package/h1z1-server
//
//   Based on https://github.com/psemu/soe-network
// ======================================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.SOEInputStream = void 0;
const events_1 = require("events");
const h1emu_core_1 = require("h1emu-core");
const utils_1 = require("../../utils/utils");
const constants_1 = require("../../utils/constants");
const debug = require("debug")("SOEInputStream");
class SOEInputStream extends events_1.EventEmitter {
    constructor(cryptoKey) {
        super();
        this._nextSequence = new utils_1.wrappedUint16(0);
        this._lastAck = new utils_1.wrappedUint16(-1);
        this._fragments = new Map();
        this._useEncryption = false;
        this._lastProcessedSequence = -1;
        this.has_cpf = false;
        this.cpf_totalSize = -1;
        this.cpf_dataSize = -1;
        this.cpf_processedFragmentsSequences = [];
        this._rc4 = new h1emu_core_1.RC4(cryptoKey);
    }
    processSingleData(dataToProcess, sequence) {
        this._fragments.delete(sequence);
        this._lastProcessedSequence = sequence;
        return parseChannelPacketData(dataToProcess.payload);
    }
    processFragmentedData(firstPacketSequence) {
        // cpf == current processed fragment
        if (!this.has_cpf) {
            const firstPacket = this._fragments.get(firstPacketSequence); // should be always defined
            // the total size is written has a uint32 at the first packet of a fragmented data
            this.cpf_totalSize = firstPacket.payload.readUInt32BE(0);
            this.cpf_dataSize = 0;
            this.cpf_dataWithoutHeader = Buffer.allocUnsafe(this.cpf_totalSize);
            this.cpf_processedFragmentsSequences = [];
            this.has_cpf = true;
        }
        for (let i = this.cpf_processedFragmentsSequences.length; i < this._fragments.size; i++) {
            const fragmentSequence = (firstPacketSequence + i) % constants_1.MAX_SEQUENCE;
            const fragment = this._fragments.get(fragmentSequence);
            if (fragment) {
                const isFirstPacket = fragmentSequence === firstPacketSequence;
                this.cpf_processedFragmentsSequences.push(fragmentSequence);
                fragment.payload.copy(this.cpf_dataWithoutHeader, this.cpf_dataSize, isFirstPacket ? constants_1.DATA_HEADER_SIZE : 0);
                const fragmentDataLen = isFirstPacket
                    ? fragment.payload.length - 4
                    : fragment.payload.length;
                this.cpf_dataSize += fragmentDataLen;
                if (this.cpf_dataSize > this.cpf_totalSize) {
                    this.emit("error", new Error("processDataFragments: offset > totalSize: " +
                        this.cpf_dataSize +
                        " > " +
                        this.cpf_totalSize +
                        " (sequence " +
                        fragmentSequence +
                        ") (fragment length " +
                        fragment.payload.length +
                        ")"));
                }
                if (this.cpf_dataSize === this.cpf_totalSize) {
                    // Delete all the processed fragments from memory
                    for (let k = 0; k < this.cpf_processedFragmentsSequences.length; k++) {
                        this._fragments.delete(this.cpf_processedFragmentsSequences[k]);
                    }
                    this._lastProcessedSequence = fragmentSequence;
                    this.has_cpf = false;
                    // process the full reassembled data
                    return parseChannelPacketData(this.cpf_dataWithoutHeader);
                }
            }
            else {
                return []; // the full data hasn't been received yet
            }
        }
        return []; // if somehow there is no fragments in memory
    }
    _processData() {
        const nextFragmentSequence = (this._lastProcessedSequence + 1) & constants_1.MAX_SEQUENCE;
        const dataToProcess = this._fragments.get(nextFragmentSequence);
        let appData = [];
        if (dataToProcess) {
            if (dataToProcess.isFragment) {
                appData = this.processFragmentedData(nextFragmentSequence);
            }
            else {
                appData = this.processSingleData(dataToProcess, nextFragmentSequence);
            }
            if (appData.length) {
                if (this._fragments.has(this._lastProcessedSequence + 1)) {
                    queueMicrotask(() => {
                        this._processData();
                    });
                }
                this.processAppData(appData);
            }
        }
    }
    processAppData(appData) {
        for (let i = 0; i < appData.length; i++) {
            let data = appData[i];
            if (this._useEncryption) {
                // sometimes there's an extra 0x00 byte in the beginning that trips up the RC4 decyption
                if (data.length > 1 && data.readUInt16LE(0) === 0) {
                    data = Buffer.from(this._rc4.encrypt(data.slice(1)));
                }
                else {
                    data = Buffer.from(this._rc4.encrypt(data));
                }
            }
            this.emit("appdata", data); // sending appdata to application
        }
    }
    acknowledgeInputData(sequence) {
        if (sequence > this._nextSequence.get()) {
            debug("Sequence out of order, expected " +
                this._nextSequence.get() +
                " but received " +
                sequence);
            // acknowledge that we receive this sequence but do not process it
            // until we're back in order
            this.emit("outoforder", sequence);
            return false;
        }
        else {
            let ack = sequence;
            for (let i = 1; i < constants_1.MAX_SEQUENCE; i++) {
                // TODO: check if MAX_SEQUENCE + 1 is the right value
                const fragmentIndex = (this._lastAck.get() + i) & constants_1.MAX_SEQUENCE;
                if (this._fragments.has(fragmentIndex)) {
                    ack = fragmentIndex;
                }
                else {
                    break;
                }
            }
            this._lastAck.set(ack);
            // all sequences behind lastAck are acknowledged
            this.emit("ack", ack);
            return true;
        }
    }
    write(data, sequence, isFragment) {
        debug("Writing " + data.length + " bytes, sequence " + sequence, " fragment=" + isFragment + ", lastAck: " + this._lastAck.get());
        if (sequence >= this._nextSequence.get()) {
            this._fragments.set(sequence, { payload: data, isFragment: isFragment });
            const wasInOrder = this.acknowledgeInputData(sequence);
            if (wasInOrder) {
                this._nextSequence.set(this._lastAck.get() + 1);
                this._processData();
            }
        }
    }
    setEncryption(value) {
        this._useEncryption = value;
        debug("encryption: " + this._useEncryption);
    }
    toggleEncryption() {
        this._useEncryption = !this._useEncryption;
        debug("Toggling encryption: " + this._useEncryption);
    }
}
exports.SOEInputStream = SOEInputStream;
function readDataLength(data, offset) {
    let length = data.readUInt8(offset), sizeValueBytes;
    if (length === constants_1.MAX_UINT8) {
        // if length is MAX_UINT8 then it's maybe a bigger number
        if (data[offset + 1] === constants_1.MAX_UINT8 && data[offset + 2] === constants_1.MAX_UINT8) {
            // it's an uint32
            length = data.readUInt32BE(offset + 3);
            sizeValueBytes = 7;
        }
        else {
            // it's an uint16
            length = data.readUInt16BE(offset + 1);
            sizeValueBytes = 3;
        }
    }
    else {
        sizeValueBytes = 1;
    }
    return {
        length,
        sizeValueBytes,
    };
}
function parseChannelPacketData(data) {
    let appData = [], offset, dataLength;
    if (data[0] === 0x00 && data[1] === 0x19) {
        // if it's a DataFragment packet
        offset = 2;
        while (offset < data.length) {
            dataLength = readDataLength(data, offset);
            offset += dataLength.sizeValueBytes;
            appData.push(data.slice(offset, offset + dataLength.length));
            offset += dataLength.length;
        }
    }
    else {
        appData = [data];
    }
    return appData;
}
//# sourceMappingURL=soeinputstream.js.map