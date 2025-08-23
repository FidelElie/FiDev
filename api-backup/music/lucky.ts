import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

import { MusicImFeelingLuckyRoute } from "@/libraries/api";

export const prerender = false;

export const GET: APIRoute = async () => {
	const musicPosts = await getCollection("music");

	const randomPostIndex = Math.ceil(Math.random() * (musicPosts.length - 1));

	const randomPost = musicPosts[randomPostIndex];

	return Response.json(
		MusicImFeelingLuckyRoute.responses[200].parse({
			post: { ...randomPost.data, slug: randomPost.id },
		}),
	);
};
