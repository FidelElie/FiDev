import "dotenv/config";
import path from "path";

import { getPostsPathsFromRootDir } from "@fi.dev/content";

import { client } from "../libraries/database";

const syncMusicPostEntries = async () => {
	const paths = getPostsPathsFromRootDir("./src/content/music").filter(
		path => path.includes(".md")
	);

	const postsToPublish = paths.map(
		(entryPath) => {
			const splitPath = entryPath.split("/");

			const slug = path.basename(entryPath).split(".")[0];
			const date = splitPath.at(-2);

			return { slug, publishDate: new Date(date || "") }
		}
	);


	client.post.handlePostPublishing(postsToPublish);
	console.log(`Handled publishing of ${postsToPublish.length} posts`);
}

syncMusicPostEntries();
