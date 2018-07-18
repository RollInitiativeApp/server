import core, { Router, Request, Response } from "express";
import { join } from "path";

import User from "../data/models/User";
import Auth from "../auth";
import { clientPath } from "../paths";

export default class UserRouteHandler {
	static get router(): core.Router {
		let router = Router();
		router.all("/dashboard", Auth.authenticated, UserRouteHandler.dashboard);
		return router;
	}

	static dashboard(req: Request, res: Response) {
		let user: User = req.user as User;
		if (user.NeedsSetup) res.redirect("/first-login");

		let path = join(clientPath, "me.html");
		res.status(200).sendFile(path);
	}
}
