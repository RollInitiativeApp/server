import { ICommandHandler, CommandData } from "../ICommandHandler";
import { Message, Guild, GuildChannel, TextChannel } from "discord.js";
import { ArgumentError, CommandError } from "../Errors";
import { DiscordBot } from "../Bot";
import { GroupNodeHelper } from "../../data/helpers/game-group";
import { GuildNodeHelper } from "../../data/helpers/guild";
import { Group } from "@roll4init/common";

export class GroupHandler implements ICommandHandler {
    command: string;

    constructor() {
        this.command = "group";
    }

    async process(bot: DiscordBot, command: CommandData): Promise<void> {
        if (!(command.message.channel instanceof GuildChannel)) {
            throw new CommandError("Cannot get server info; not a server.");
        }

        let channel: GuildChannel = command.message.channel;
        let guild: Guild = channel.guild;

        if (command.arguments.length == 0)
            throw new ArgumentError("Need a command.");

        let subcommand = command.arguments.shift();
        switch (subcommand.toLowerCase()) {
            case "list":
                await this.doGroupList(
                    command.message,
                    guild,
                    command.arguments
                );
                break;

            default:
                throw new CommandError("Command not recognized.");
        }
    }

    async doGroupList(originalMessage: Message, guild: Guild, args: string[]) {
        let guild1 = await GuildNodeHelper.findByID(guild.id);
        let groups: Group[] = await GroupNodeHelper.findByGuild(guild1);
        if (groups.length == 0) {
            originalMessage.channel.send(
                "Cannot find any groups on this server."
            );
            return;
        }

        let b: string = "";
        groups.forEach(group => {
            b += `**${group.GroupName}** ${group.Unique}`;
        });

        originalMessage.channel.send(b);
    }
}
