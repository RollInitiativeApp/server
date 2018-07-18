import { IGameGroup } from "@roll4init/common";

/**
 * A group represents a group of players and dungeon masters.
 * Can have multiple per server.
 */
export default class GameGroup implements IGameGroup {
	GuildID: string;
	Unique: string;
	save(): Promise<boolean> {
		throw new Error("Method not implemented.");
	}
}
