import { readFile } from "fs-extra";
import { join } from "path";
import { Character } from "@roll4init/common";
import { CharacterNodeHelper } from "../../helpers/character";

// load character.graphql
let CharacterSchema: string;
readFile(join(__dirname, "..", "schemas", "character.graphql"), "utf-8").then(
    data => (CharacterSchema = data)
);

let CharacterResolvers = {
    Character: {
        StrengthMod: (character: Character) =>
            character.getModifier(character.Scores.Strength),
        DexterityMod: (character: Character) =>
            character.getModifier(character.Scores.Dexterity),

        Owner: (character: Character) =>
            CharacterNodeHelper.getOwner(character),
        Created: (character: Character) =>
            character.Created ? character.Created.toISO() : null
    }
};

export { CharacterSchema, CharacterResolvers };
