import { ICommandHandler } from "../ICommandHandler";
import { Message, GuildChannel, TextChannel } from "discord.js";

export default class ServerInfo implements ICommandHandler {
	command: string;

	constructor() {
		this.command = "sinfo";
	}

	process(originalMessage: Message, args: string[]) {
		if (originalMessage.channel instanceof GuildChannel)
			originalMessage.channel.send("Server ID: " + originalMessage.guild.id);
		else originalMessage.channel.send("Cannot get server info; not a server.");
	}
}
