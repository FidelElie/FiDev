import path from "node:path";
import { readdirSync, lstatSync } from "node:fs";

import matter from "gray-matter";

import type { ContentConfig, ContentPostEntry } from "./types";

export const getPostsPathsFromRootDir = (dirPath: string): string[] => {
	const dirContents = readdirSync(dirPath);

	const paths = dirContents.map((reference) => {
		const referencePath = path.join(dirPath, reference);

		const stat = lstatSync(referencePath)

		if (stat.isDirectory()) {
			return getPostsPathsFromRootDir(referencePath);
		}

		return [referencePath];
	})

	return paths.flat();
}

export const getPostPathsFromConfig = (
	context: { config: ContentConfig; paths?: string[]; ids?: string[] }
) => {
	const { config, paths, ids } = context;

	const { dir } = config;

	if (paths) {
		return paths.map(value => getPostsPathsFromRootDir(value)).flat();
	}

	if (ids) {
		return ids.map(id => getPostsPathsFromRootDir(path.join(dir || "./posts", id))).flat();
	}

	return [];
}

export const getEntriesFromFilePaths = <T>(paths: string[]) : ContentPostEntry<T>[] => {
	return paths.map(value => {
		const matterContents = matter.read(value);

		return matterContents.data as ContentPostEntry<T>;
	});
}
