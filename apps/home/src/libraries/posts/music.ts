import { definePostEntry, datePrompt, confirm } from "@fi.dev/content";

// import { client } from "@/libraries/database";
import { MusicPostSchema } from "@/libraries/schemas";
import { onCreateMusicPost } from "@/libraries/posts/music.create";

export const musicPost = definePostEntry({
	id: "music",
	name: "Music",
	path: async () => {
		const backDatePost = await confirm({
			message: "Back date post?",
			default: false,
		});

		const date = await (async () => {
			if (!backDatePost) {
				return new Date();
			}

			return datePrompt();
		})();

		return [
			date.getFullYear(),
			String(date.getMonth() + 1).padStart(2, "0"),
			String(date.getDate()).padStart(2, "0"),
		].join("-");
	},
	validator: MusicPostSchema.parse,
	onCreate: onCreateMusicPost,
	// hooks: [
	// 	{
	// 		events: ["create"],
	// 		onEvent: (entries) => {
	// 			const [createdPost] = entries;

	// 			client.post.createPost({ id: createdPost.post.slug });
	// 		},
	// 	},
	// 	{
	// 		events: ["delete"],
	// 		onEvent: (entries) => {
	// 			const [postToDelete] = entries;

	// 			client.post.deletePostEntryById(postToDelete.post.slug);
	// 		},
	// 	},
	// ],
});
