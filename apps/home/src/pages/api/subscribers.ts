import type { APIRoute } from "astro";

import { subscribeToWebsite } from "@/libraries/server";

export const prerender = false;

export const POST: APIRoute = async (context) => {
	const { request } = context;

	const result = await subscribeToWebsite(request);

	return Response.json(result, { status: 202 });
}
