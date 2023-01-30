import { Items } from "../models/enums";
export type LoadoutKit = Array<LoadoutKitEntry>;
interface LoadoutKitEntry {
    item: Items;
    count?: number;
}
export declare const characterDefaultLoadout: ({
    item: Items;
    count?: undefined;
} | {
    item: Items;
    count: number;
})[];
export declare const characterKitLoadout: ({
    item: Items;
    count?: undefined;
} | {
    item: Items;
    count: number;
})[];
export declare const characterBuildKitLoadout: ({
    item: Items;
    count: number;
} | {
    item: Items;
    count?: undefined;
})[];
export declare const vehicleDefaultLoadouts: {
    offroader: {
        item: Items;
    }[];
    policecar: {
        item: Items;
    }[];
    atv: {
        item: Items;
    }[];
    pickup: {
        item: Items;
    }[];
};
export declare const lootableContainerDefaultLoadouts: {
    storage: {
        item: Items;
    }[];
    furnace: {
        item: Items;
    }[];
    barbeque: {
        item: Items;
    }[];
    campfire: {
        item: Items;
    }[];
    lootbag: {
        item: Items;
    }[];
    dew_collector: {
        item: Items;
    }[];
    animal_trap: {
        item: Items;
    }[];
};
export {};
