import path from "node:path";

import { select, confirm, checkbox, Separator } from "@inquirer/prompts";

import type { ContentConfig, PublishPostEntry } from "../types";
import { getEntriesFromFilePaths, getPostPathsFromConfig } from "../utilities";
import { datePrompt } from "../prompts";

export const publishContentCommand = async (
	context: { config: ContentConfig; filter?: string; unpublish?: boolean }
) => {
	const { config, filter, unpublish } = context;

	if (!config.onPublish) {
		return console.error("No publish handler has been registered - add an onPublish to config");
	}

	const unpublishPosts = await (async () => {
		if (unpublish !== undefined) { return unpublish; }

		return confirm({
			message: "Would you like to unpublish posts instead?",
			default: false
		});
	})();

	const action = unpublishPosts ? "unpublish" : "publish";

	const chosenPostFilter = await (async () => {
		if (filter) { return filter; }

		if (config.entries.length === 1) { return config.entries[0].id; }

		return select({
			message: `Choose what lists to ${action} from`,
			choices: [
				...config.entries.map(entryPath => ({ name: entryPath.name, value: entryPath.id })),
				new Separator(),
				{
					value: null,
					name: "All posts"
				},
			],
			default: null
		})
	})();

	const ids = chosenPostFilter ? [chosenPostFilter] : config.entries.map(entryPath => entryPath.id);

	const entryPaths = getPostPathsFromConfig({ config, ids });

	const actionAll = await confirm({
		message: `${action} all posts?`,
		default: true
	});

	const postsToAction = await (async () => {
		if (actionAll) {
			return getEntriesFromFilePaths(entryPaths);
		}

		const chosenPaths = await checkbox({
			message: `Choose the posts you would like to ${action}`,
			choices: entryPaths.map(entryPath => ({
				value: entryPath,
				name: path.basename(entryPath)
			}))
		});

		return getEntriesFromFilePaths(chosenPaths);
	})();

	if (action == "unpublish") {
		const currentDate = new Date();
		const entries = postsToAction.map(post=> ({ post, date: currentDate }));

		return config.onPublish({ entries, action: "unpublish" });
	}

	const allSamePublishDate = await confirm({
		message: `Use today as publish date?`,
		default: true
	});

	const entriesWithDates = await (async () => {
		if (allSamePublishDate) {
			const currentDate = new Date();

			return postsToAction.map(post => ({ post, date: currentDate }));
		}

		let entryPosts: PublishPostEntry<unknown>[] = [];

		for (const post of postsToAction) {
			const date = await datePrompt();

			entryPosts.push({ post, date });
		}

		return entryPosts;
	})();

	return config.onPublish({
		entries: entriesWithDates,
		action: !unpublish ? "publish" : "unpublish"
	});
}
