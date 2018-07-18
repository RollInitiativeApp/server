import passport from "passport";
import { Strategy as DiscordStrategy } from "passport-discord";
import { Request, Response } from "express";
import User, { UserNotFoundError } from "./data/models/User";

export class Auth {
	initialize() {
		passport.serializeUser(this.serializer);
		passport.deserializeUser(this.deserializer);

		passport.use(
			new DiscordStrategy(
				{
					clientID: process.env.DISCORD_CLIENT || "",
					clientSecret: process.env.DISCORD_SECRET || "",
					callbackURL: process.env.DISCORD_CALLBACK || "",
					scope: ["identify"]
				},
				this.getUser
			)
		);

		return passport.initialize();
	}

	serializer(user: any, done: Function) {
		done(null, { id: user.DiscordId });
	}

	deserializer(serialized: any, done: Function) {
		User.findByDiscord(serialized.id).then(user => done(null, user));
	}

	authenticated(req: Request, res: Response, next: Function) {
		if (req.user) next();
		else res.redirect("/discord/auth/login");
	}

	isFirstLogin(req: Request, res: Response, next: Function) {
		if (req.user) {
			let myUser = req.user as User;
			if (myUser.NeedsSetup) next();
			else res.redirect("/me");
		} else {
			res.redirect("/discord/auth/login");
		}
	}

	getUser(
		accessToken: string,
		refreshToken: string,
		profile: DiscordStrategy.Profile,
		callback: any
	) {
		User.findByDiscord(profile.id)
			.then(user => callback(null, user))
			.catch(outerErr => {
				if (outerErr instanceof UserNotFoundError) {
					User.createNewDiscord(profile.id)
						.then(user => callback(null, user))
						.catch(err => callback(err, null));
				} else callback(outerErr, null);
			});
	}
}

export default new Auth();
