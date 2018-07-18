import { Channel, Guild, Client, Message } from "discord.js";
import ServerInfo from "./commands/ServerInfo";

export class DiscordBot {
	protected client: Client;
	protected commandHandlers: {};

	constructor() {
		this.client = new Client();
		this.client.token = process.env.DISCORD_BOT_TOKEN;
		this.client.on("message", (message: Message) => this.messageHandler(message));

		this.commandHandlers = {};
		this.commandHandlers["sinfo"] = new ServerInfo();
	}

	async start() {
		await this.client.login();
		console.log("Discord bot started.");
	}

	async stop() {
		await this.client.destroy();
	}

	messageHandler(message: Message): any {
		// If we aren't mentioned, ignore
		let mentioned = message.cleanContent.startsWith(".r4i");
		if (!mentioned) return;

		// Ignore other bots
		if (message.author.bot) return;

		let cleaned = message.content.split(" ");
		cleaned.shift();

		let command = cleaned.shift();
		if (this.commandHandlers[command])
			this.commandHandlers[command].process(message, cleaned.shift());
	}
}

export default DiscordBot;
