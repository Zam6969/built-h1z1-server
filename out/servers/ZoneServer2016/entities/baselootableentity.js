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
exports.BaseLootableEntity = void 0;
const enums_1 = require("../models/enums");
const basefullcharacter_1 = require("./basefullcharacter");
class BaseLootableEntity extends basefullcharacter_1.BaseFullCharacter {
    constructor(characterId, transientId, actorModelId, position, rotation, server) {
        super(characterId, transientId, actorModelId, position, rotation, server);
        this.interactionDistance = 4;
        this.isLootbag = actorModelId == 9581 || actorModelId == 9391;
    }
    getContainer() {
        return Object.values(this._containers)[0];
    }
    OnInteractionString(server, client) {
        server.sendData(client, "Command.InteractionString", {
            guid: this.characterId,
            stringId: enums_1.StringIds.OPEN,
        });
    }
    /* eslint-disable @typescript-eslint/no-unused-vars */
    OnPlayerSelect(server, client, isInstant
    /* eslint-enable @typescript-eslint/no-unused-vars */
    ) {
        if (client.character.characterId == this.mountedCharacter) {
            client.character.dismountContainer(server);
            delete this.mountedCharacter; // the check below wont fix container if characterId is the same
            return; // as the one that opened it, so just to be sure we delete it here
        }
        if (this.mountedCharacter) {
            if (!server.getClientByCharId(this.mountedCharacter)) {
                delete this.mountedCharacter;
            }
            else {
                server.containerError(client, enums_1.ContainerErrors.IN_USE);
                return;
            }
        }
        client.character.mountContainer(server, this);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    OnFullCharacterDataRequest(server, client) {
        // do nothing for now
    }
}
exports.BaseLootableEntity = BaseLootableEntity;
//# sourceMappingURL=baselootableentity.js.map