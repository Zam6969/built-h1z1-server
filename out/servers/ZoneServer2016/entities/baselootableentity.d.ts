import { ZoneServer2016 } from "../zoneserver";
import { BaseFullCharacter } from "./basefullcharacter";
import { LoadoutContainer } from "../classes/loadoutcontainer";
import { ZoneClient2016 } from "../classes/zoneclient";
export declare class BaseLootableEntity extends BaseFullCharacter {
    mountedCharacter?: string;
    readonly interactionDistance = 4;
    isLootbag: boolean;
    constructor(characterId: string, transientId: number, actorModelId: number, position: Float32Array, rotation: Float32Array, server: ZoneServer2016);
    getContainer(): LoadoutContainer | undefined;
    OnInteractionString(server: ZoneServer2016, client: ZoneClient2016): void;
    OnPlayerSelect(server: ZoneServer2016, client: ZoneClient2016, isInstant?: boolean): void;
    OnFullCharacterDataRequest(server: ZoneServer2016, client: ZoneClient2016): void;
}
