import * as dotenv from "dotenv";
import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import passport from "passport";
import session from "express-session";
import cors from "cors";

//@ts-ignore
import { Auth } from "./auth";
import sessionStore from "sessionstore";
import { join } from "path";

import { clientPath } from "./paths";

import { DiscordBot } from "./bot";

import WebSocketServer from "./websocket";

import DiscordHandler from "./routes/Discord";
import GameSessionHandler from "./routes/GameSessionHandler";
import GraphQlRouteHandler from "./routes/GraphQL";
import UserRouteHandler from "./routes/User";

dotenv.config();

let auth = new Auth();

let bot = new DiscordBot();
bot.start();

let app = express();

app.use(cors());
app.use(bodyParser.json());

app.use(
    session({
        store: sessionStore.createSessionStore(),
        secret: process.env.SESSION_SECRET || "development",
        resave: false,
        saveUninitialized: true
    })
);

app.use(
    "/node_modules",
    express.static(join(__dirname, "..", "..", "node_modules"))
);
app.use(auth.initialize());
app.use(passport.session());

// Route setup
app.use("/discord", DiscordHandler);
app.use("/session", GameSessionHandler);
app.use("/graphql", GraphQlRouteHandler.router);
app.use("/user", UserRouteHandler.router);

app.get("/first-login", auth.isFirstLogin, (req: Request, res: Response) => {
    res.status(200).sendFile(join(clientPath, "user-setup.html"));
});

app.listen(process.env.PORT || 3000);

let wss = new WebSocketServer();
wss.start();

process.on("beforeExit", () => {
    wss.stop();
    bot.stop();
});
