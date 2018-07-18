import { User } from "../../models/User";

import { readFile } from "fs-extra";
import { join } from "path";

// load user.graphql
let UserSchema: string;
readFile(join(__dirname, "..", "schemas", "user.graphql"), "utf-8").then(
	data => (UserSchema = data)
);

let UserResolvers = {
	User: {
		Characters: async (user: User) => user.getCharacters()
	}
};
export { UserSchema, UserResolvers };
