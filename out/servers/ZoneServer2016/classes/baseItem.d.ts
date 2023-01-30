import { Weapon } from "./weapon";
export declare class BaseItem {
    itemDefinitionId: number;
    slotId: number;
    itemGuid: string;
    containerGuid: string;
    currentDurability: number;
    debugFlag: string;
    stackCount: number;
    weapon?: Weapon;
    constructor(itemDefinitionId: number, guid: string, durability: number, stackCount: number);
}
