import { getEnvironmentVariable } from "@fi.dev/typescript";
import { z } from "zod";

export const SpotifyEnvSchema = z.object({
	SPOTIFY_CLIENT_ID: z.string(),
	SPOTIFY_CLIENT_SECRET: z.string(),
	SPOTIFY_REDIRECT_URI: z.string(),
	SPOTIFY_REFRESH_TOKEN: z.string().optional(),
});

export const getSpotifyEnv = () => {
	const validatedEnvironment = SpotifyEnvSchema.parse({
		SPOTIFY_CLIENT_ID: getEnvironmentVariable("SPOTIFY_CLIENT_ID"),
		SPOTIFY_CLIENT_SECRET: getEnvironmentVariable("SPOTIFY_CLIENT_SECRET"),
		SPOTIFY_REDIRECT_URI: getEnvironmentVariable("SPOTIFY_REDIRECT_URI"),
		SPOTIFY_REFRESH_TOKEN: getEnvironmentVariable("SPOTIFY_REFRESH_TOKEN"),
	});

	return {
		clientId: validatedEnvironment.SPOTIFY_CLIENT_ID,
		clientSecret: validatedEnvironment.SPOTIFY_CLIENT_SECRET,
		redirectURI: validatedEnvironment.SPOTIFY_REDIRECT_URI,
		refreshToken: validatedEnvironment.SPOTIFY_REFRESH_TOKEN,
	};
};
