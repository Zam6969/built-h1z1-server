import { ZoneServer2016 } from "../zoneserver";
import { ZoneClient2016 as Client } from "../classes/zoneclient";
export declare class CraftManager {
    private craftLoopCount;
    private maxCraftLoopCount;
    private componentsDataSource;
    constructor(client: Client, server: ZoneServer2016, recipeId: number, count: number);
    removeCraftComponent(itemDefinitionId: number, count: number): boolean;
    craftItem(server: ZoneServer2016, client: Client, recipeId: number, recipeCount: number): Promise<boolean>;
    start(client: Client, server: ZoneServer2016, recipeId: number, count: number): Promise<void>;
}
