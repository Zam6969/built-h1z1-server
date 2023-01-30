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
exports.ItemObject = void 0;
const enums_1 = require("../models/enums");
const baselightweightcharacter_1 = require("./baselightweightcharacter");
class ItemObject extends baselightweightcharacter_1.BaseLightweightCharacter {
    constructor(characterId, transientId, actorModelId, position, rotation, server, spawnerId, item) {
        super(characterId, transientId, actorModelId, position, rotation, server);
        this.npcRenderDistance = 25;
        this.spawnerId = 0;
        this.flags = {
            bit0: 0,
            bit1: 0,
            bit2: 0,
            bit3: 0,
            bit4: 0,
            bit5: 0,
            bit6: 0,
            bit7: 0,
            bit8: 0,
            bit9: 0,
            bit10: 0,
            bit11: 0,
            projectileCollision: 0,
            bit13: 0,
            bit14: 0,
            bit15: 0,
            bit16: 0,
            bit17: 0,
            bit18: 0,
            bit19: 0,
            noCollide: 1,
            knockedOut: 0,
            bit22: 0,
            bit23: 0,
        };
        this.creationTime = 0;
        (this.spawnerId = spawnerId), (this.item = item);
    }
    /* eslint-disable @typescript-eslint/no-unused-vars */
    OnPlayerSelect(server, client, isInstant
    /* eslint-enable @typescript-eslint/no-unused-vars */
    ) {
        server.pickupItem(client, this.characterId);
    }
    OnInteractionString(server, client) {
        server.sendData(client, "Command.InteractionString", {
            guid: this.characterId,
            stringId: enums_1.StringIds.TAKE_ITEM,
        });
    }
    OnProjectileHit(server, damageInfo) {
        damageInfo; // eslint
        if (this.item.itemDefinitionId === enums_1.Items.FUEL_BIOFUEL ||
            this.item.itemDefinitionId === enums_1.Items.FUEL_ETHANOL) {
            server.deleteEntity(this.characterId, server._spawnedItems);
            delete server.worldObjectManager._spawnedLootObjects[this.spawnerId];
            server._explosives[this.characterId].detonate(server);
        }
    }
    destroy(server) {
        delete server.worldObjectManager._spawnedLootObjects[server._spawnedItems[this.characterId].spawnerId];
        server.deleteEntity(this.characterId, server._spawnedItems);
    }
}
exports.ItemObject = ItemObject;
//# sourceMappingURL=itemobject.js.map