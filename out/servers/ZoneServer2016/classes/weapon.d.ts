/// <reference types="node" />
import { ZoneServer2016 } from "../zoneserver";
import { BaseItem } from "./baseItem";
import { ZoneClient2016 } from "./zoneclient";
export declare class Weapon {
    itemGuid: string;
    itemDefinitionId: number;
    ammoCount: number;
    reloadTimer?: NodeJS.Timeout;
    currentReloadCount: number;
    constructor(item: BaseItem, ammoCount?: number);
    unload(server: ZoneServer2016, client: ZoneClient2016): void;
}
