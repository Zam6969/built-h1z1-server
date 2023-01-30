import { H1emuClient } from "./shared/h1emuclient";
import { H1emuServer } from "./shared/h1emuserver";
export declare class H1emuZoneServer extends H1emuServer {
    _loginServerInfo: any;
    _sessionData: any;
    _loginConnection?: H1emuClient;
    _maxConnectionRetry: number;
    _hasBeenConnectedToLogin: boolean;
    constructor(serverId: number, serverPort?: number);
    connect(): void;
    setLoginInfo(serverInfo: any, obj: any): void;
    start(): void;
}
