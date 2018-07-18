import { ICharacter } from "@roll4init/common";
import { DateTime } from "luxon";
import { StatementResult, Node } from "neo4j-driver/types/v1";
import { Remapper } from "../remapper";
import driver from "../connection";
import { User, UserNotFoundError } from "./User";

export class Character implements ICharacter {
	Unique: string;
	Name: string;
	Level: number;

	// AbilityScores
	Strength: number;
	Dexterity: number;
	Constitution: number;
	Wisdom: number;
	Intelligence: number;
	Charisma: number;

	InitiativeMod: number;
	Health: number;
	Created: DateTime;

	public getModifier(score: number): number {
		return Math.floor((score - 10) / 2);
	}

	public async getOwner(): Promise<User> {
		let query = `MATCH (u:User)-[:OwnsCharacter]->(c:Character) 
			WHERE c.Unique = {unique}
			RETURN u`;

		try {
			let session = driver.session();
			let result: StatementResult = await session.run(query, {
				unique: this.Unique
			});

			let users: User[] = result.records
				.map(rec => rec.get(0))
				.map((rec: Node) => Remapper.map<User>(new User(), rec));

			return users[0];
		} catch (e) {
			throw new UserNotFoundError(e);
		}
	}

	public async save(): Promise<boolean> {
		return false;
	}
}

export default Character;
