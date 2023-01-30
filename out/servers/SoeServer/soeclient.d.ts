/// <reference types="node" />
/// <reference types="node" />
import { RemoteInfo } from "dgram";
import { wrappedUint16 } from "../../utils/utils";
import { soePacket } from "../../types/soeserver";
import { SOEInputStream } from "./soeinputstream";
import { SOEOutputStream } from "./soeoutputstream";
import { LogicalPacket } from "./logicalPacket";
interface SOEClientStats {
    totalPacketSent: number;
    packetResend: number;
    packetsOutOfOrder: number;
}
export interface packetsQueue {
    packets: LogicalPacket[];
    CurrentByteLength: number;
    timer?: NodeJS.Timeout;
}
export default class SOEClient {
    sessionId: number;
    address: string;
    port: number;
    crcSeed: number;
    crcLength: number;
    clientUdpLength: number;
    serverUdpLength: number;
    packetsSentThisSec: number;
    useEncryption: boolean;
    waitingQueue: packetsQueue;
    outQueue: LogicalPacket[];
    protocolName: string;
    unAckData: Map<number, number>;
    outOfOrderPackets: soePacket[];
    nextAck: wrappedUint16;
    lastAck: wrappedUint16;
    inputStream: SOEInputStream;
    outputStream: SOEOutputStream;
    soeClientId: string;
    lastPingTimer: NodeJS.Timeout;
    isDeleted: boolean;
    stats: SOEClientStats;
    lastAckTime: number;
    avgPing: number;
    pings: number[];
    avgPingLen: number;
    private _statsResetTimer;
    constructor(remote: RemoteInfo, crcSeed: number, cryptoKey: Uint8Array);
    closeTimers(): void;
    private _resetStats;
    getNetworkStats(): string[];
    addPing(ping: number): void;
    private _updateAvgPing;
}
export {};
