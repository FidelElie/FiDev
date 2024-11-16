import type { APIRoute } from "astro";

import { getClientIpAddress } from "@/libraries/utilities";

export const prerender = false;

export const PATCH: APIRoute = async (context) => {
	const { request } = context;

	const ipAddress = getClientIpAddress(request);

	return Response.json(ipAddress);
}
