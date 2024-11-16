import type { APIRoute } from "astro";

import { getCurrentPlayingTrack } from "@/libraries/server";

export const prerender = false;

export const GET: APIRoute = async () => {
	const currentPlayingResponse = await getCurrentPlayingTrack();

	return Response.json(currentPlayingResponse);
}
