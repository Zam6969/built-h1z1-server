import { ZoneClient2016 as Client } from "../classes/zoneclient";
import { ZoneServer2016 } from "../zoneserver";
import { Command } from "./types";
export declare class CommandHandler {
    readonly commands: {
        [hash: number]: Command;
    };
    readonly internalCommands: {
        [name: string]: Command;
    };
    constructor();
    private clientHasCommandPermission;
    private indexCommands;
    executeCommand(server: ZoneServer2016, client: Client, packet: any): void;
    executeInternalCommand(server: ZoneServer2016, client: Client, commandName: string, packet: any): void;
    reloadCommands(): void;
}
