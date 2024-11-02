import type { APIRoute } from "astro";

import { fetchMusicArtists } from "@/libraries/api";

export const prerender = false;

export const GET: APIRoute = async (context) => {
	const { request } = context;

	const artistEntries = await fetchMusicArtists(request);

	return Response.json(artistEntries);
}
