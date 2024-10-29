import type { PostPublishContext } from "@fi.dev/content";
import type { MusicPostSchema } from "../schemas";

export const onPublishPosts : PostPublishContext<MusicPostSchema> = (context) => {
	const { entries, action } = context;


}
