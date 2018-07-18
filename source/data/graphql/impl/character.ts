import Character from "../../models/character";

import { readFile } from "fs-extra";
import { join } from "path";

// load character.graphql
let CharacterSchema: string;
readFile(join(__dirname, "..", "schemas", "character.graphql"), "utf-8").then(
	data => (CharacterSchema = data)
);

let CharacterResolvers = {
	Character: {
		StrengthMod: (character: Character) => character.getModifier(character.Strength),
		DexterityMod: (character: Character) => character.getModifier(character.Dexterity),

		Owner: (character: Character) => character.getOwner(),
		Created: (character: Character) => (character.Created ? character.Created.toISO() : null)
	}
};

export { CharacterSchema, CharacterResolvers };
