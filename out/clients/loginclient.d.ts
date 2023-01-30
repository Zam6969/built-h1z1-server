/// <reference types="node" />
import { EventEmitter } from "events";
interface LoginProtocolInterface {
    parse: Function;
    pack: Function;
}
export declare class LoginClient extends EventEmitter {
    _gameId: number;
    _environment: string;
    _soeClient: any;
    _protocol: LoginProtocolInterface;
    constructor(gameId: number, environment: string, serverAddress: string, serverPort: number, loginKey: Uint8Array, localPort: number);
    connect(): void;
    login(fingerprint: string): void;
    disconnect(): void;
    requestServerList(): void;
    requestCharacterInfo(): void;
    requestCharacterLogin(characterId: string, serverId: number, payload: any): void;
    requestCharacterDelete: () => void;
    requestCharacterCreate(): void;
}
export {};
