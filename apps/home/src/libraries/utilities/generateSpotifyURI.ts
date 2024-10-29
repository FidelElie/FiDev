const SPOTIFY_OPEN_DOMAIN = "https://open.spotify.com/";

export const generateSpotifyURI = (url: string) => {
	const spotifyURL = new URL("", url);

	if (spotifyURL.host === SPOTIFY_OPEN_DOMAIN) {
		console.warn(`Error generating spotify uri - invalid domain found got ${spotifyURL.host}`);
		return "/";
	}

	const [type, id] = spotifyURL.pathname.split("/").filter(Boolean);

	return `spotify:${type}:${id}`;
}
