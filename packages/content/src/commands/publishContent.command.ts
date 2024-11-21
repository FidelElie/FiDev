import path from "node:path";

import { select, confirm, checkbox, Separator } from "@inquirer/prompts";

import type { ContentConfig, PublishPostEntry } from "../types";
import { getEntriesFromFilePaths, getPostPathsFromConfig } from "../utilities";
import { datePrompt } from "../prompts";

export const publishContentCommand = async (context: {
	config: ContentConfig;
	filter?: string;
}) => {
	const { config, filter } = context;

	if (!config.onPublish) {
		return console.error(
			"No publish handler has been registered - add an onPublish to config",
		);
	}

	const chosenPostFilter = await (async () => {
		if (filter) {
			return filter;
		}

		if (config.entries.length === 1) {
			return config.entries[0].id;
		}

		return select({
			message: `Choose what lists to publish from`,
			choices: [
				...config.entries.map((entryPath) => ({
					name: entryPath.name,
					value: entryPath.id,
				})),
				new Separator(),
				{
					value: null,
					name: "All posts",
				},
			],
			default: null,
		});
	})();

	const ids = chosenPostFilter
		? [chosenPostFilter]
		: config.entries.map((entryPath) => entryPath.id);

	const entryPaths = getPostPathsFromConfig({ config, ids }).filter(
		(entryPath) => entryPath.includes(`.${config.type || "md"}`),
	);

	const actionAll = await confirm({
		message: `Publish all posts?`,
		default: true,
	});

	const postsToAction = await (async () => {
		if (actionAll) {
			return getEntriesFromFilePaths(entryPaths);
		}

		const chosenPaths = await checkbox({
			message: `Choose the posts you would like to publish`,
			choices: entryPaths.map((entryPath) => ({
				value: entryPath,
				name: `${path.basename(entryPath)} [${entryPath}]`,
			})),
		});

		return getEntriesFromFilePaths(chosenPaths);
	})();

	const allSamePublishDate = await confirm({
		message: `Use today as publish date?`,
		default: true,
	});

	const entriesWithDates = await (async () => {
		if (allSamePublishDate) {
			const currentDate = new Date();

			return postsToAction.map((post) => ({ post, date: currentDate }));
		}

		const allPostsHaveSameDate = await confirm({
			message: "All posts have same custom date?",
			default: true,
		});

		const entriesToPublish = await (async () => {
			if (allPostsHaveSameDate) {
				const date = await datePrompt();

				return postsToAction.map((post) => ({ post, date }));
			}

			let entryPosts: PublishPostEntry<unknown>[] = [];

			for (const post of postsToAction) {
				const date = await datePrompt();

				entryPosts.push({ post, date });
			}

			return entryPosts;
		})();

		return entriesToPublish;
	})();

	return config.onPublish({
		entries: entriesWithDates,
	});
};
