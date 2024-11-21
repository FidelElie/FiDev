import type { PostPublishContext } from "@fi.dev/content";

import { client } from "../database";
import type { MusicPostSchema } from "../schemas";

export const onPublishPosts: PostPublishContext<MusicPostSchema> = async (
	context,
) => {
	const { entries } = context;

	const entriesToPublish = entries
		.map((entry) =>
			entry.post.slug ? { slug: entry.post.slug, publishDate: entry.date } : [],
		)
		.flat();

	await client.post.handlePostPublishing(entriesToPublish);
};
