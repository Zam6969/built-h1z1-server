/// <reference types="node" />
import { RemoteInfo } from "dgram";
export declare class H1emuClient {
    sessionId: number;
    address: string;
    port: number;
    serverId?: number;
    clientId: string;
    lastPing: number;
    constructor(remote: RemoteInfo);
}
