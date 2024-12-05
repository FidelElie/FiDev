import { describe, it, expect } from "vitest";

import { compileOutputWithPlugins } from "./config";



describe("remarkRegExpDirective", () => {
	it("Will properly update inputs with correct directive", async () => {
		const testInput = `:quote[Young Mexico - Young Flexico]`;

		const output = (await compileOutputWithPlugins(testInput)).toString();

		expect(output.includes("<q>Young Mexico - Young Flexico</q>")).toBeTruthy();
	});
});
