import type { APIRoute } from "astro";

import { fetchMusicProjects } from "@/libraries/api";

export const prerender = false;

export const GET: APIRoute = async (context) => {
	const { request } = context;

	const musicEntries = await fetchMusicProjects(request);

	return Response.json(musicEntries);
}
