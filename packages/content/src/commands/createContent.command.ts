import path from "node:path";
import fs from "node:fs/promises";

import matter from "gray-matter";
import { select } from "@inquirer/prompts";

import { ensureDirExists } from "@fi.dev/typescript";

import { onCreatePrompt } from "../prompts";
import type { ContentConfig } from "../types";

export const createContentCommand = async (
	context: { config: ContentConfig; type?: string; }
) => {
	const { type, config, } = context;

	const { entries, dir, hooks, type: markdownType } = config;

	const entry = await (async () => {
		const fetchCorrespondingEntry = (id: string) => {
			const entry = entries.find(entry => entry.id === id);

			if (!entry) { throw new Error(`Couldn't find entry with corresponding id ${id}`); }

			return entry;
		}

		if (entries.length === 1) { return entries[0]; }

		const entryFromType = type && fetchCorrespondingEntry(type);

		if (entryFromType) { return entryFromType; }

		const option = await select({
			message: "What type of post would you like to create?",
			choices: entries.map(post => ({ value: post.id, name: post.name || post.id }))
		});

		return fetchCorrespondingEntry(option);
	})();

	const result = await (entry.onCreate || onCreatePrompt)({ entry });

	const entriesWithPaths = await Promise.all(
		(Array.isArray(result) ? result : [result]).map(
			async (post) => {
				const { metadata, slug } = post;

				const parsedPath = await (async () => {
					if (!entry.path) { return null; }

					return typeof entry.path === "string" ? entry.path : entry.path();
				})();

				const writePath = path.join(
					dir || "./posts",
					entry.id,
					parsedPath || "",
					`${slug}.${markdownType || "md"}`
				);

				await ensureDirExists(path.dirname(writePath));

				const validatedMetadata = entry.validator ? await entry.validator(metadata) : metadata;

				const frontmatter = matter.stringify("", validatedMetadata);

				await fs.writeFile(
					writePath,
					[frontmatter].join("\n")
				);

				return {
					path: writePath,
					post: validatedMetadata
				}
			}
		)
	);

	const creationHooks = (hooks || []).map(
		hook => hook.events.includes("create") ? hook.onEvent(entriesWithPaths) : []
	).flat();

	if (creationHooks.length) {
		console.log("Running creation hooks");
		await Promise.all(creationHooks);
	}
}
