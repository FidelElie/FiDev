import { exec } from "node:child_process";

import "dotenv/config";

import { defineContentConfig } from "@fi.dev/content";

import { musicPost } from "@/libraries/posts/music";
import { onPublishPosts } from "@/libraries/posts/onPublish";

export default defineContentConfig({
	dir: "./src/content",
	entries: [musicPost],
	onPublish: onPublishPosts,
	hooks: [
		{
			events: ["create"],
			onEvent: (entries) => {
				const [createdPost] = entries;

				exec(`code ${createdPost.path}`, (error) => {
					if (error) {
						return console.log(`Couldn't open post in VSCode ${error}`);
					}

					console.log(`Opened post in VSCode`);
				});
			},
		},
	],
});
