import { readFile } from "fs-extra";
import { join } from "path";

// load character.graphql
let GameSessionSchema: string;
readFile(join(__dirname, "..", "schemas", "game-session.graphql"), "utf-8").then(
	data => (GameSessionSchema = data)
);

// Local imports
import GameSession from "../../models/game-session";

let GameSessionResolvers = {
	GameSession: {
		dungeonMasters: (gs: GameSession) => gs.getDungeonMasters(),
		characters: (gs: GameSession) => gs.getCharacters()
	}
};

export { GameSessionSchema, GameSessionResolvers };
