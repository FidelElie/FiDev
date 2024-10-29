import { definePostEntry, datePrompt, confirm } from "@fi.dev/content";

import { MusicPostSchema } from "@/libraries/schemas";
import { onCreateMusicPost } from "@/libraries/posts/music.create";

export const musicPost = definePostEntry({
	id: "music",
	name: "Music",
	path: async () => {
		const backDatePost = await confirm({
			message: "Back date post?",
			default: false
		});

		const date = await (async () => {
			if (!backDatePost) { return new Date(); }

			return datePrompt()
		})()

		return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
	},
	validator: MusicPostSchema.parse,
	onCreate: onCreateMusicPost
});
