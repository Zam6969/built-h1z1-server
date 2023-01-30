/// <reference types="node" />
import { H1emuProtocolReadingFormat } from "types/protocols";
export declare const H1emuPacketsPacketTypes: any, H1emuPacketsPackets: any;
export declare class H1emuProtocol {
    parse(data: Buffer): H1emuProtocolReadingFormat | null;
    pack(packetName: string, object: any): Buffer | null;
}
