import type { APIRoute } from "astro";

import { fetchMusicGenres } from "@/libraries/server";

export const prerender = false;

export const GET: APIRoute = async (context) => {
	const { request } = context;

	const genreEntries = await fetchMusicGenres(request);

	return Response.json(genreEntries);
}
