import { paginateEntries } from "@/libraries/utilities";
import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

export const prerender = false;

export const GET: APIRoute = async (context) => {
	const { url } = context;

	const parsedUrl = new URL("", url);

	const { page, size } = Object.fromEntries(parsedUrl.searchParams.entries());

	const musicPosts = await getCollection("music");

	const result = paginateEntries(
		musicPosts,
		{ page, size, url: url.toString(), defaultSize: 15 }
	);

	return Response.json(
		{ ...result, items: result.items.map(item => ({ ...item.data, slug: item.slug }))},
	);
}
