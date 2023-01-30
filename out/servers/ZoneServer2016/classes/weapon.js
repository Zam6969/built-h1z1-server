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
exports.Weapon = void 0;
const utils_1 = require("../../../utils/utils");
class Weapon {
    constructor(item, ammoCount) {
        this.currentReloadCount = 0; // needed for reload packet to work every time
        this.itemGuid = item.itemGuid;
        this.itemDefinitionId = item.itemDefinitionId;
        this.ammoCount = ammoCount || 0;
    }
    unload(server, client) {
        if (!this.ammoCount)
            return;
        client.character.lootItem(server, server.generateItem(server.getWeaponAmmoId(this.itemDefinitionId), this.ammoCount));
        this.ammoCount = 0;
        if (client.character.getEquippedWeapon().itemGuid == this.itemGuid) {
            server.sendWeaponData(client, "Weapon.Reload", {
                weaponGuid: this.itemGuid,
                unknownDword1: 0,
                ammoCount: 0,
                unknownDword3: 0,
                currentReloadCount: (0, utils_1.toHex)(++this.currentReloadCount),
            });
        }
    }
}
exports.Weapon = Weapon;
//# sourceMappingURL=weapon.js.map