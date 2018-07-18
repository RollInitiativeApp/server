import { IGameSession } from "@roll4init/common";
import { Node, StatementResult, Relationship, Record } from "neo4j-driver/types/v1";

// Local imports
import connection from "../connection";
import { GameCharacter } from "./game-character";
import { Remapper } from "../remapper";
import User from "./User";

interface GameCharacterRelationship {
	initiative: number;
}

export class GameSession implements IGameSession {
	Unique: string;

	async save(): Promise<boolean> {
		throw new Error("Not yet implemented.");
	}

	static async getByHash(hash: string): Promise<GameSession> {
		let query = `MATCH (gs:GameSession) WHERE gs.Unique = {hash} RETURN gs`;
		let session = connection.session();

		let r: StatementResult = await session.run(query, {
			hash: hash
		});

		return r.records
			.map(rec => rec.get(0) as Node)
			.map((node: Node) => Remapper.map(new GameSession(), node))
			.shift();
	}

	async getCharacters(): Promise<GameCharacter[]> {
		//
		let query = `MATCH (gs:GameSession)<-[a:InSession]-(c:Character) WHERE gs.Unique = {hash} RETURN c, a`;
		let session = connection.session();

		let r: StatementResult = await session.run(query, {
			hash: this.Unique
		});

		let characters: GameCharacter[] = r.records.map((r: Record) => this.remapGameCharacter(r));

		session.close();
		return characters;
	}

	remapGameCharacter(r: Record): GameCharacter {
		let characterNode: Node = r.get(0);
		let relation: Relationship = r.get(1);

		let gc: GameCharacter = Remapper.map(new GameCharacter(), characterNode);
		let gcrel: GameCharacterRelationship = Remapper.mapRelationship<GameCharacterRelationship>(
			{ initiative: 0 },
			relation
		);

		gc.Initiative = gcrel.initiative;
		return gc;
	}

	async getDungeonMasters(): Promise<User[]> {
		let query = `MATCH (gs:GameSession)<-[:RunningSession]-(u:User) WHERE gs.Unique = {hash} RETURN u`;
		let session = connection.session();

		let r: StatementResult = await session.run(query, {
			hash: this.Unique
		});

		let masters: User[] = r.records.map((r: Record) => r.get(0)).map((n: Node) => {
			return Remapper.map(new User(), n);
		});

		session.close();
		return masters;
	}
}
export default GameSession;
