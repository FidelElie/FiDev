import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

export const prerender = false;

export const GET: APIRoute = async () => {
	const musicPosts = await getCollection("music");

	const randomPostIndex = Math.ceil(Math.random() * (musicPosts.length - 1));

	const randomPost = musicPosts[randomPostIndex];

	return Response.json(
		{	post: randomPost },
	);
}

