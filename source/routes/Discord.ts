import { Router } from "express";
import passport from "passport";

let router = Router();

router.get("/auth/login", passport.authenticate("discord"));

router.get("/auth/callback", passport.authenticate("discord"), (req, res) => res.redirect("/me"));

export default router;
