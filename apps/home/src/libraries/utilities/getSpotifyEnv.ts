import { SpotifyEnvSchema } from "@/libraries/schemas";

export const getSpotifyEnv = () => {
	const validatedEnvironment = SpotifyEnvSchema.parse(
		import.meta.env || process.env,
	);

	return {
		clientId: validatedEnvironment.SPOTIFY_CLIENT_ID,
		clientSecret: validatedEnvironment.SPOTIFY_CLIENT_SECRET,
		redirectURI: validatedEnvironment.SPOTIFY_REDIRECT_URI,
		refreshToken: validatedEnvironment.SPOTIFY_REFRESH_TOKEN,
	};
};
