import { ZoneServer2016 } from "../zoneserver";
import { BaseItem } from "./baseItem";
import { LoadoutItem } from "./loadoutItem";
export declare class LoadoutContainer extends LoadoutItem {
    containerDefinitionId: number;
    items: {
        [itemGuid: string]: BaseItem;
    };
    canAcceptItems: boolean;
    acceptedItems: number[];
    readonly isMutable: boolean;
    constructor(item: LoadoutItem, containerDefinitionId: number);
    /**
     * Gets the used bulk of this container.
     * @param server The ZoneServer instance.
     * @returns Returns the amount of bulk used.
     */
    getUsedBulk(server: ZoneServer2016): number;
    /**
     * Gets the maximum bulk that this container can hold.
     * @param server The ZoneServer instance.
     */
    getMaxBulk(server: ZoneServer2016): number;
    /**
     * Gets the available bulk for this container.
     * @param server The ZoneServer instance.
     * @returns Returns the amount of bulk available.
     */
    getAvailableBulk(server: ZoneServer2016): number;
    /**
     * Returns a boolean if this container has enough space for a given amount of a certain item.
     * @param server The ZoneServer instance.
     * @param itemDefinitionId The definiton id of the item to check.
     * @param count The amount of the item to check.
     */
    getHasSpace(server: ZoneServer2016, itemDefinitionId: number, count: number): boolean;
    /**
     * Gets an item stack in a container that has space for a specified item.
     * @param server The ZoneServer instance.
     * @param itemDefId The item definition ID of the item stack to check.
     * @param count The amount of items to fit into the stack.
     * @param slotId Optional: The slotId of a specific item stack to check.
     * @returns Returns the itemGuid of the item stack.
     */
    getAvailableItemStack(server: ZoneServer2016, itemDefId: number, count: number, slotId?: number): string;
    /**
     * Gets the maximum slots that this container can hold.
     * @param server The ZoneServer instance.
     */
    getMaxSlots(server: ZoneServer2016): any;
    transferItem(server: ZoneServer2016, targetContainer: LoadoutContainer, item: BaseItem, newSlotId: number, count?: number): void;
}
