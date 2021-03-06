import { Router, Request, Response } from "express";
import { join as joinPath } from "path";
import { GameSessionNodeHelper } from "../data/helpers/game-session";

let router = Router();
let client = joinPath(__dirname, "..", "..", "..", "client");

router.get("/:sessid/characters", getSessionCharacters);
async function getSessionCharacters(req: Request, res: Response) {
    let sessID = req.params.sessid;

    let session = await GameSessionNodeHelper.findByUnique(sessID);

    if (!session) {
        res.status(200).json({ error: "Session not found." });
        return;
    }

    let characters = await GameSessionNodeHelper.getCharacters(session);
    res.status(200).json(characters);
}

router.get("/:sessid", (req: Request, res: Response) => {
    res.status(200).sendFile(joinPath(client, "index.html"));
});

export default router;
