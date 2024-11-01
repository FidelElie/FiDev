import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

import { paginateEntries, queryParams } from "@/libraries/utilities";

import { FetchMusicPostsRoute } from "@/libraries/api";

export const prerender = false;

export const GET: APIRoute = async (context) => {
	const { request } = context;

	const { page, size, genres, levels } = FetchMusicPostsRoute.dtos.query.parse(
		queryParams.decodeFromUrl(request.url)
	);

	const musicPosts = await getCollection("music", (post) => {
		const includedByGenre = !genres?.length || genres.some(
			genre => post.data.genres.includes(genre)
		);

		const includedByRating = !levels?.length || levels.includes(post.data.rating);

		return includedByGenre && includedByRating;
	});

	const result = paginateEntries(
		musicPosts,
		{ page, size, defaultSize: 15 }
	);

	return Response.json(
		FetchMusicPostsRoute.responses[200].parse({
			...result,
			items: result.items.map(item => ({ ...item.data, slug: item.slug }))
		}),
	);
}
