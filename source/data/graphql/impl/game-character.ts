import GameCharacter from "../../models/game-character";

import { readFile } from "fs-extra";
import { join } from "path";

// load character.graphql
let GameCharacterSchema: string;
readFile(join(__dirname, "..", "schemas", "game-character.graphql"), "utf-8").then(
	data => (GameCharacterSchema = data)
);

let GameCharacterResolvers = {
	GameCharacter: {
		StrengthMod: (character: GameCharacter) => character.getModifier(character.Strength),
		DexterityMod: (character: GameCharacter) => character.getModifier(character.Dexterity),

		Owner: (character: GameCharacter) => character.getOwner(),
		Created: (character: GameCharacter) =>
			character.Created ? character.Created.toISO() : null
	}
};

export { GameCharacterSchema, GameCharacterResolvers };
