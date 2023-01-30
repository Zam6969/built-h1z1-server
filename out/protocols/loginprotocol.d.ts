/// <reference types="node" />
import { LoginProtocolReadingFormat } from "../types/protocols";
export declare class LoginProtocol {
    loginPackets: any;
    tunnelLoginPackets: any;
    constructor();
    parse(data: Buffer): LoginProtocolReadingFormat | null;
    pack(packetName: string, object: any): Buffer | null;
}
