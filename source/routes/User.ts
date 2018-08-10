import core, { Router, Request, Response } from "express";
import { join } from "path";

import auth from "../auth";
import { clientPath } from "../paths";
import { User } from "@roll4init/common";

export default class UserRouteHandler {
    static get router(): core.Router {
        let router = Router();
        router.all(
            "/dashboard",
            auth.authenticated,
            UserRouteHandler.dashboard
        );
        return router;
    }

    static dashboard(req: Request, res: Response) {
        let user: User = req.user as User;
        if (user.NeedsSetup) res.redirect("/first-login");

        let path = join(clientPath, "me.html");
        res.status(200).sendFile(path);
    }
}
