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
exports.CommandHandler = void 0;
const utils_1 = require("../../../utils/utils");
const types_1 = require("./types");
const commands_1 = require("./commands");
const internalcommands_1 = require("./internalcommands");
const enums_1 = require("../../../utils/enums");
class CommandHandler {
    constructor() {
        this.commands = {};
        this.internalCommands = {};
        this.indexCommands(commands_1.commands, internalcommands_1.internalCommands);
    }
    clientHasCommandPermission(server, client, command) {
        return (command.permissionLevel == types_1.PermissionLevels.DEFAULT ||
            client.isAdmin || // temp permissionLevel logic until isAdmin is replaced
            server._allowedCommands.includes(command.name));
    }
    indexCommands(commands, internalCommands) {
        commands.forEach((command) => {
            this.commands[(0, utils_1.flhash)(command.name.toUpperCase())] = command;
        });
        internalCommands.forEach((command) => {
            this.internalCommands[command.name] = command;
        });
    }
    executeCommand(server, client, packet) {
        if (!server.hookManager.checkHook("OnClientExecuteCommand", client, packet.data.commandHash, packet.data.arguments)) {
            return;
        }
        const hash = packet.data.commandHash, args = packet.data.arguments.toLowerCase().split(" ");
        if (this.commands[hash]) {
            const command = this.commands[hash];
            if (!this.clientHasCommandPermission(server, client, command)) {
                server.sendChatText(client, "You don't have access to that.");
                return;
            }
            else {
                if (!server._soloMode) {
                    (0, utils_1.logClientActionToMongo)(server._db?.collection(enums_1.DB_COLLECTIONS.COMMAND_USED), client, server._worldId, {
                        name: command.name,
                        permissionLevel: command.permissionLevel,
                        args,
                    });
                }
            }
            command.execute(server, client, args);
        }
        else if (hash == (0, utils_1.flhash)("HELP")) {
            server.sendChatText(client, `Command list: \n/${Object.values(this.commands)
                .filter((command) => this.clientHasCommandPermission(server, client, command))
                .map((command) => {
                return command.name;
            })
                .join("\n/")}`);
        }
        else {
            server.sendChatText(client, `Unknown command, hash: ${hash}`);
        }
    }
    executeInternalCommand(server, client, commandName, packet) {
        if (!server.hookManager.checkHook("OnClientExecuteInternalCommand", client, packet.data)) {
            return;
        }
        if (this.internalCommands[commandName]) {
            const command = this.internalCommands[commandName];
            if (!this.clientHasCommandPermission(server, client, command)) {
                server.sendChatText(client, "You don't have access to that.");
                return;
            }
            else {
                if (!server._soloMode) {
                    (0, utils_1.logClientActionToMongo)(server._db?.collection(enums_1.DB_COLLECTIONS.COMMAND_USED), client, server._worldId, { name: command.name, permissionLevel: command.permissionLevel });
                }
            }
            command.execute(server, client, packet.data);
        }
        else {
            server.sendChatText(client, `Unknown command: ${commandName}`);
        }
    }
    reloadCommands() {
        delete require.cache[require.resolve("./commands")];
        delete require.cache[require.resolve("./internalCommands")];
        const commands = require("./commands").commands, internalCommands = require("./internalCommands").internalCommands;
        this.indexCommands(commands, internalCommands);
    }
}
exports.CommandHandler = CommandHandler;
//# sourceMappingURL=commandhandler.js.map