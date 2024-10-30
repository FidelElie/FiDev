import type { APIRoute } from "astro";

import { getCollection } from "astro:content";

export const prerender = false;

export const GET: APIRoute = async () => {
	const artists = await getCollection("artists");

	const genres = Array.from(new Set(artists.map(artist => artist.data.genres).flat()));

	return Response.json(
		{	genres },
	);
}

