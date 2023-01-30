/// <reference types="node" />
/// <reference types="node" />
import { EventEmitter } from "events";
import { SOEServer } from "../SoeServer/soeserver";
import { GatewayProtocol } from "h1emu-core";
import SOEClient from "../SoeServer/soeclient";
export declare class GatewayServer extends EventEmitter {
    _soeServer: SOEServer;
    _protocol: GatewayProtocol;
    private _crcSeed;
    private _crcLength;
    private _udpLength;
    constructor(serverPort: number, gatewayKey: Uint8Array);
    start(): void;
    private _sentTunnelData;
    sendTunnelData(client: SOEClient, tunnelData: Buffer): void;
    sendUnbufferedTunnelData(client: SOEClient, tunnelData: Buffer): void;
    stop(): void;
}
