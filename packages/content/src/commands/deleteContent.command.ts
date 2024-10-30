import path from "node:path";

import trash from "trash";
import { confirm, select } from "@inquirer/prompts";

import { ContentConfig } from "../types";
import { getPostsPathsFromRootDir, ensureDirExists } from "../utilities";

export const deleteContentCommand = async (
	context: { config: ContentConfig; type?: string }
) => {
	const { type, config } = context;

	const { entries, dir, hooks } = config;

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

	const postDirPath = path.join(dir || "./posts", entry.id);

	ensureDirExists(postDirPath);

	const posts = getPostsPathsFromRootDir(postDirPath);

	if (!posts.length) {
		return console.log("No posts were found to delete");
	}

	const deleteFilePath = await select({
		message: "Choose what post you would like to delete",
		choices: posts.map(
			postPath => ({
				value: postPath,
				name: path.basename(postPath)
			})
		)
	});

	const confirmDeletion = await confirm({
		message: `Are you sure you would like to delete post ${path.basename(deleteFilePath)}`
	});

	if (!confirmDeletion) {
		return console.log("Cancelling post deletion");
	}

	await trash([deleteFilePath]);

	console.log(`Post ${path.basename(deleteFilePath)} move to recycle bin`);

	const deletionHooks = (hooks || []).map(
		hook => hook.events.includes("delete") ? hook.onEvent : []
	).flat();

	if (deletionHooks.length) {
		console.log("Running deletion hooks");
		await Promise.all(deletionHooks);
	}
}
