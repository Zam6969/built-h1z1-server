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
exports.SOEOutputStream = void 0;
const events_1 = require("events");
const h1emu_core_1 = require("h1emu-core");
const utils_1 = require("../../utils/utils");
const debug = require("debug")("SOEOutputStream");
class SOEOutputStream extends events_1.EventEmitter {
    constructor(cryptoKey) {
        super();
        this._useEncryption = false;
        this._fragmentSize = 0;
        this._sequence = new utils_1.wrappedUint16(-1);
        this.lastAck = new utils_1.wrappedUint16(-1);
        this._cache = {};
        this._hadCacheError = false;
        this._rc4 = new h1emu_core_1.RC4(cryptoKey);
    }
    addToCache(sequence, data, isFragment) {
        this._cache[sequence] = {
            data: data,
            fragment: isFragment,
        };
    }
    removeFromCache(sequence) {
        if (!!this._cache[sequence]) {
            delete this._cache[sequence];
        }
    }
    write(data, unbuffered = false) {
        if (this._useEncryption) {
            data = Buffer.from(this._rc4.encrypt(data));
            // if the first byte is a 0x00 then we need to add 1 more
            if (data[0] === 0) {
                const tmp = Buffer.alloc(1);
                data = Buffer.concat([tmp, data]);
            }
        }
        if (data.length <= this._fragmentSize) {
            this._sequence.increment();
            this.addToCache(this._sequence.get(), data, false);
            this.emit("data", data, this._sequence.get(), false, unbuffered);
        }
        else {
            const header = Buffer.allocUnsafe(4);
            header.writeUInt32BE(data.length, 0);
            data = Buffer.concat([header, data]);
            for (let i = 0; i < data.length; i += this._fragmentSize) {
                this._sequence.increment();
                const fragmentData = data.slice(i, i + this._fragmentSize);
                this.addToCache(this._sequence.get(), fragmentData, true);
                this.emit("data", fragmentData, this._sequence.get(), true, unbuffered);
            }
        }
    }
    ack(sequence, unAckData) {
        // delete all data / timers cached for the sequences behind the given ack sequence
        while (this.lastAck.get() !== utils_1.wrappedUint16.wrap(sequence + 1)) {
            const lastAck = this.lastAck.get();
            this.removeFromCache(lastAck);
            unAckData.delete(lastAck);
            this.lastAck.increment();
        }
    }
    resendData(sequence) {
        if (this._cache[sequence]) {
            this.emit("dataResend", this._cache[sequence].data, sequence, this._cache[sequence].fragment);
        }
        else {
            // already deleted from cache so already acknowledged by the client not a real issue
            debug(`Cache error, could not resend data for sequence ${sequence}! `);
        }
    }
    isUsingEncryption() {
        return this._useEncryption;
    }
    setEncryption(value) {
        this._useEncryption = value;
        debug("encryption: " + this._useEncryption);
    }
    toggleEncryption() {
        this._useEncryption = !this._useEncryption;
        debug("Toggling encryption: " + this._useEncryption);
    }
    setFragmentSize(value) {
        this._fragmentSize = value;
    }
}
exports.SOEOutputStream = SOEOutputStream;
exports.SOEOutputStream = SOEOutputStream;
//# sourceMappingURL=soeoutputstream.js.map