import { ZoneServer2016 } from "../zoneserver";
import { ItemObject } from "./itemobject";
import { BaseItem } from "../classes/baseItem";
import { ZoneClient2016 } from "../classes/zoneclient";
export declare class Plant extends ItemObject {
    growState: number;
    nextStateTime: number;
    readonly growTime = 28800000;
    parentObjectCharacterId: string;
    slot: string;
    isFertilized: boolean;
    isLightweight: boolean;
    npcRenderDistance: number;
    constructor(characterId: string, transientId: number, actorModelId: number, position: Float32Array, rotation: Float32Array, server: ZoneServer2016, spawnerId: number, item: BaseItem, parentObjectCharacterId: string, slot: string);
    grow(server: ZoneServer2016): void;
    OnPlayerSelect(server: ZoneServer2016, client: ZoneClient2016, isInstant?: boolean): void;
    OnInteractionString(server: ZoneServer2016, client: ZoneClient2016): void;
    OnFullCharacterDataRequest(server: ZoneServer2016, client: ZoneClient2016): void;
}
