import User from "../source/data/models/User";
import dotenv from "dotenv";

import { expect } from "chai";

dotenv.config();

describe("User", () => {
	it("Should be able to fetch a user by Username.", async () => {
		let user = await User.findByUsername("TestUser");

		expect(user.DiscordId).to.equal("0");
		expect(user.NameFirst).to.equal("Test");
		expect(user.NameLast).to.equal("User");
	});

	it("Should be able to fetch a user by Discord ID.", async () => {
		let user = await User.findByDiscord("0");

		expect(user.Username).to.equal("TestUser");
		expect(user.NameFirst).to.equal("Test");
		expect(user.NameLast).to.equal("User");
	});

	it("Should be able to save data again.", async () => {
		let user = await User.findByUsername("TestUser");

		expect(user.NameFirst).to.equal("Test");

		let lastSaved = user.LastModified;
		await user.save();

		let newUser = await User.findByUsername("TestUser");
		let newSaved = newUser.LastModified;

		expect(lastSaved).to.not.eq(newSaved);
	});
});
