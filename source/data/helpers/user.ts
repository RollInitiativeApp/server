import { Node, StatementResult, Integer, Session } from "neo4j-driver/types/v1";
import { DateTime } from "luxon";

import { User, Character } from "@roll4init/objects";

import { connection } from "../connection";
import { Remapper } from "../remapper";

export class UserNotFoundError extends Error {}

export class UserNodeHelper {
    static async findByUsername(username: string): Promise<User> {
        let query = `MATCH (u:User) WHERE u.Username = {username} RETURN u`;
        let session = connection.session();

        let r: StatementResult = await session.run(query, {
            username: username
        });

        return r.records
            .map(rec => rec.get(0) as Node)
            .map(node => Remapper.map<User>(new User(), node))
            .shift();
    }

    static async createNewDiscord(discord: string): Promise<User> {
        let query = `CREATE (u:User { DiscordId: {discord}, DateJoined: {joinDate}, NeedsSetup: true  }) RETURN u`;

        let session: Session;
        try {
            session = connection.session();
            let r: StatementResult = await session.run(query, {
                discord: discord,
                joinDate: DateTime.utc()
            });

            return r.records
                .map(rec => rec.get(0) as Node)
                .map(node => Remapper.map<User>(new User(), node))
                .shift();
        } catch (e) {
            throw new Error("Failed to get user: " + e);
        } finally {
            session.close();
        }
    }

    static async findByDiscord(discord: string): Promise<User> {
        let match =
            "MATCH (u:User) WHERE u.DiscordId = {discord} RETURN count(*)";
        let session = connection.session();

        try {
            let results = await session.run(match, { discord: discord });
            let count: number = (results.records[0].get(0) as Integer).toInt();

            let query;
            if (count > 0) {
                query = `MATCH (u:User) WHERE u.DiscordId = {discord} RETURN u`;
                let r: StatementResult = await session.run(query, {
                    discord: discord
                });

                let records: User[] = r.records
                    .map(rec => rec.get(0) as Node)
                    .map(node => Remapper.map<User>(new User(), node));

                return records[0];
            } else {
                throw new UserNotFoundError();
            }
        } finally {
            session.close();
        }
    }

    static async getCharacters(user: User): Promise<Character[]> {
        let query =
            "MATCH (u:User)-[:OwnsCharacter]->(c:Character) WHERE u.Unique = {unique} RETURN c";
        try {
            let session = connection.session();
            let result = await session.run(query, { unique: user.Unique });

            let characters: Character[] = result.records
                .map(rec => rec.get(0))
                .map((rec: Node) =>
                    Remapper.map<Character>(new Character(), rec)
                );
            session.close();

            return characters;
        } catch {
            return [];
        }
    }

    static async saveUser(user: User): Promise<boolean> {
        return false;
    }
}
