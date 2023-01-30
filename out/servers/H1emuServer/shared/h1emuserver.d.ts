/// <reference types="node" />
/// <reference types="node" />
/// <reference types="node" />
/// <reference types="node" />
/// <reference types="node" />
import { EventEmitter } from "events";
import { H1emuProtocol } from "../../../protocols/h1emuprotocol";
import { H1emuClient as H1emuClient } from "./h1emuclient";
import { Worker } from "worker_threads";
import { RemoteInfo } from "dgram";
export declare abstract class H1emuServer extends EventEmitter {
    _serverPort?: number;
    _protocol: H1emuProtocol;
    _udpLength: number;
    _clients: {
        [clientId: string]: H1emuClient;
    };
    _connection: Worker;
    _pingTime: number;
    _pingTimeout: number;
    _pingTimer: NodeJS.Timeout;
    protected constructor(serverPort?: number);
    clientHandler(remote: RemoteInfo, opcode: number): H1emuClient | void;
    messageHandler(messageType: string, data: Buffer, client: H1emuClient): void;
    connectionHandler(message: any): void;
    start(): void;
    stop(): void;
    sendData(client: H1emuClient | undefined, packetName: any, obj: any): void;
    ping(client: H1emuClient): void;
    updateClientLastPing(clientId: string): void;
}
