/// <reference types="node" />
import { EventEmitter } from "events";
import { H1Z1Protocol as ZoneProtocol } from "../protocols/h1z1protocol";
export declare class ZoneClient extends EventEmitter {
    _gatewayClient: any;
    _protocol: ZoneProtocol;
    _characterId: string;
    _ticket: string;
    _clientProtocol: string;
    _clientBuild: string;
    _referenceData: any;
    _environment: string;
    _serverId: number;
    constructor(serverAddress: string, serverPort: number, key: Uint8Array, characterId: string, ticket: string, clientProtocol: string, clientBuild: string, localPort: number);
    connect(): void;
    login(): void;
    disconnect(): void;
    setReferenceData(data: any): void;
}
