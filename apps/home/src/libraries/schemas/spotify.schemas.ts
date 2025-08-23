import { z } from "zod";

export const SpotifyEnvSchema = z.object({
	SPOTIFY_CLIENT_ID: z.string(),
	SPOTIFY_CLIENT_SECRET: z.string(),
	SPOTIFY_REDIRECT_URI: z.string(),
	SPOTIFY_REFRESH_TOKEN: z.string().optional(),
});

export const getSpotifyEnv = () => {
	const validatedEnvironment = SpotifyEnvSchema.parse({
		SPOTIFY_CLIENT_ID: process.env.SPOTIFY_CLIENT_ID,
		SPOTIFY_CLIENT_SECRET: process.env.SPOTIFY_CLIENT_SECRET,
		SPOTIFY_REDIRECT_URI: process.env.SPOTIFY_REDIRECT_URI,
		SPOTIFY_REFRESH_TOKEN: process.env.SPOTIFY_REFRESH_TOKEN,
	});

	return {
		clientId: validatedEnvironment.SPOTIFY_CLIENT_ID,
		clientSecret: validatedEnvironment.SPOTIFY_CLIENT_SECRET,
		redirectURI: validatedEnvironment.SPOTIFY_REDIRECT_URI,
		refreshToken: validatedEnvironment.SPOTIFY_REFRESH_TOKEN,
	};
};
