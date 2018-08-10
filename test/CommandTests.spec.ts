import dotenv from "dotenv";

import { expect } from "chai";
import { GuildNodeHelper } from "../source/data/helpers/guild";

describe("Guild", async () => {
    it("can be retrieved by a unique", async () => {
        let guild = await GuildNodeHelper.findByID("test");

        expect(guild.GuildName)
            .to.be.a("string")
            .and.eq("Test Guild");

        expect(guild.GuildId).to.eq("test");
    });
});
