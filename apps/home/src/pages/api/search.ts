import type { APIRoute } from "astro";

import { searchWebsiteAction } from "@/libraries/server";

export const prerender = false;

export const GET: APIRoute = async (context) => {
	const { request } = context;

	const searchResults = await searchWebsiteAction(request);

	return Response.json(searchResults);
}
