import { z } from "zod";

export const SpotifyEnvSchema = z.object({
	SPOTIFY_CLIENT_ID: z.string(),
	SPOTIFY_CLIENT_SECRET: z.string(),
	SPOTIFY_REDIRECT_URI: z.string(),
	SPOTIFY_REFRESH_TOKEN: z.string().optional()
});

export const getSpotifyEnv = () => {
	const validatedEnvironment = SpotifyEnvSchema.parse(process.env);

	return {
		clientId: validatedEnvironment.SPOTIFY_CLIENT_ID,
		clientSecret: validatedEnvironment.SPOTIFY_CLIENT_SECRET,
		redirectURI: validatedEnvironment.SPOTIFY_REDIRECT_URI,
		refreshToken: validatedEnvironment.SPOTIFY_REFRESH_TOKEN
	}
}
