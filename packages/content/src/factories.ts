import { Command } from "commander";

import type { ContentConfig, ContentPostEntry } from "./types";

import { createContentCommand, deleteContentCommand } from "./commands";
import { publishContentCommand } from "./commands/publishContent.command";

/**
 * Helper to create type safe content config
 * @param config
 * @returns configuration for content handling
 */
export const defineContentConfig = async (config: ContentConfig) => {
	const { entries } = config;

	if (!config.entries.length) {
		throw new Error("No post entries were registered in config");
	}

	const program = new Command();

	const postsCommand = new Command("posts");

	postsCommand
		.command("new")
		.description("Create a new post")
		.option("--type <value>", "Type of post to create")
		.action(async (options) => {
			if (options.type && !entries.some((entry) => entry.id === options.type)) {
				throw new Error(
					`Invalid --type expected id to be one of: ${entries.map((entry) => entry.id).join(",")}`,
				);
			}

			await createContentCommand({ entries, config, ...options });
		});

	postsCommand
		.command("publish")
		.description("Publish existing posts")
		.option("--type <value>, Type of post to publish")
		.action(async (options) => {
			if (options.type && !entries.some((entry) => entry.id === options.type)) {
				throw new Error(
					`Invalid --type expected id to be one of: ${entries.map((entry) => entry.id).join(",")}`,
				);
			}

			await publishContentCommand({ entries, config, ...options });
		});

	postsCommand
		.command("remove")
		.description("Remove an existing post")
		.option("--type <value>, Type of post to delete")
		.action(async (options) => {
			if (options.type && !entries.some((entry) => entry.id === options.type)) {
				throw new Error(
					`Invalid --type expected id to be one of: ${entries.map((entry) => entry.id).join(",")}`,
				);
			}

			await deleteContentCommand({ entries, config, ...options });
		});

	program.addCommand(postsCommand);

	await program.parseAsync(process.argv);

	return config;
};

/**
 * Helper to create type safe post entries with inference
 * @param config
 * @returns post entry
 */
export const definePostEntry = <T>(config: ContentPostEntry<T>) => config;
