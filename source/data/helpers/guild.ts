import { connection } from "../connection";
import { StatementResult, Node } from "neo4j-driver/types/v1";
import { Remapper } from "../remapper";
import { Guild } from "@roll4init/objects";

/**tsc
 * A guild represents a collection of groups of people, that together form a large collection
 * of players and dungeon masters.
 */
export class GuildNodeHelper {
    static async findByID(guildID: string): Promise<Guild> {
        let query = `MATCH (gu:Guild) WHERE gu.GuildId = {guildID} RETURN gu`;
        let session = connection.session();

        let r: StatementResult = await session.run(query, {
            guildID: guildID
        });

        session.close();
        return r.records
            .map(rec => rec.get(0) as Node)
            .map(node => Remapper.map<Guild>(new Guild(), node))
            .shift();
    }
}
