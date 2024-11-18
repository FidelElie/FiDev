import { defineMiddleware } from "astro:middleware";

import { z } from "zod";

import { queryParams } from "@/libraries/utilities";
import { getSpotifyEnv } from "@/libraries/schemas";
import { createSpotifyClient } from "@/libraries/clients";

export const onRequest = defineMiddleware(async (context, next) => {
	if (context.url.pathname.includes("/callback")) {
		const query = queryParams.decodeFromUrl(context.url);

		const validatedParams = z.object({ code: z.string(), state: z.string() }).parse(query);

		const spotifyClient = createSpotifyClient(getSpotifyEnv());

		const code = validatedParams.code;
		const state = validatedParams.state;

		if (!code || !state) {
			throw new Error("Authorisation code or state variable is missing from callback - aborting");
		}

		console.log("Callback received fetching Spotify Access Token");

		const spotifyAccessResponse = await spotifyClient.getAccessToken(code);

		console.warn(
			`Ensure state value is the same as what triggered the callback: ${validatedParams.state}`
		);

		console.log(spotifyAccessResponse);

		return Response.redirect(new URL("/", context.url));
	}

	return next();
});
