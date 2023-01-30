/// <reference types="node" />
import { EventEmitter } from "events";
export declare class GatewayClient extends EventEmitter {
    private _protocol;
    private _soeClient;
    constructor(serverAddress: string, serverPort: number, key: any, localPort: number);
    connect(): void;
    sendTunnelData(tunnelData: Uint8Array, channel: number): void;
    login(characterId: string, ticket: string, clientProtocol: string, clientBuild: string): void;
}
