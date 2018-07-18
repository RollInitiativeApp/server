import { User } from "../../models/User";
import { GameSession } from "../../models/game-session";

let RootResolvers = {
	RootQuery: {
		session: (root: any, args: any) => {
			if (!args.hash) return null;

			let hash = args.hash;
			return GameSession.getByHash(hash);
		},

		userByUsername: (root: any, args: any) => {
			if (!args.username) return null;

			return User.findByUsername(args.username);
		},

		userByDiscord: (root: any, args: any) => {
			if (!args.discord) return null;

			return User.findByDiscord(args.discord);
		}
	}
};

export { RootResolvers };
