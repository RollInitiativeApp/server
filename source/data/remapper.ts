import neo4j from "neo4j-driver";
import { DateTime } from "luxon";
import { Relationship } from "../../node_modules/neo4j-driver/types/v1";

export class Remapper {
	static mapRelationship<T>(inst: T, relation: Relationship): T {
		let keys = Object.keys(relation.properties);

		let items = keys
			.map(key => {
				return { key: key, val: relation.properties[key] };
			})

			.map(item => (inst[item.key] = Remapper.convertItem(item.val)));

		return inst;
	}

	static map<T>(inst: T, node: neo4j.Node): T {
		let keys = Object.keys(node.properties);

		let items = keys
			.map(key => {
				return { key: key, val: node.properties[key] };
			})

			.map(item => (inst[item.key] = Remapper.convertItem(item.val)));

		return inst;
	}

	static convertItem(item: any) {
		let integer = neo4j.integer;
		if (neo4j.isInt(item))
			return integer.inSafeRange(item) ? integer.toNumber(item) : integer.toString(item);

		let attempt = DateTime.fromISO(item);
		return attempt.isValid ? attempt : item;
	}
}
