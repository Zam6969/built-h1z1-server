"use strict";
// ======================================================================
//
//   GNU GENERAL PUBLIC LICENSE
//   Version 3, 29 June 2007
//   copyright (C) 2020 - 2021 Quentin Gruber
//   copyright (C) 2021 - 2023 H1emu community
//
//   https://github.com/QuentinGruber/h1z1-server
//   https://www.npmjs.com/package/h1z1-server
//
//   Based on https://github.com/psemu/soe-network
// ======================================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseItem = void 0;
class BaseItem {
    constructor(itemDefinitionId, guid, durability, stackCount) {
        this.slotId = 0;
        this.containerGuid = "0x0";
        this.debugFlag = "unset";
        this.itemDefinitionId = itemDefinitionId;
        this.itemGuid = guid;
        this.currentDurability = durability;
        if (stackCount <= 0) {
            console.error(`negative stackcount (${stackCount}) detected for item ${this.itemDefinitionId} debugflag ${this.debugFlag}`);
            this.stackCount = 1;
        }
        else {
            this.stackCount = stackCount;
        }
    }
}
exports.BaseItem = BaseItem;
//# sourceMappingURL=baseItem.js.map