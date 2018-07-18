import { Message } from "discord.js";

export interface ICommandHandler {
	command: string;

	process(originalMessage: Message, args: string[]);
}
