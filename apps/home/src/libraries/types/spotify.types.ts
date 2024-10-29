export type SpotifyClientConfig = {
	clientId: string;
	clientSecret: string;
	redirectURI: string;
	refreshToken?: string;
}

export type SpotifyScopes = (
	// Images
	"ugc-image-upload" |
	// Spotify Connect
	"user-read-playback-state" |
	"user-modify-playback-state" |
	"user-read-currently-playing" |
	// Playback
	"app-remote-control" |
	"streaming" |
	// Playlists
	"playlist-read-private" |
	"playlist-read-collaborative" |
	"playlist-modify-private" |
	"playlist-modify-public" |
	// Follow
	"user-follow-modify" |
	"user-follow-read" |
	// Listening History
	"user-read-playback-position" |
	"user-top-read" |
	"user-read-recently-played" |
	// Library
	"user-library-modify" |
	"user-library-read" |
	// Users
	"user-read-email" |
	"user-read-private" |
	// Open Access
	"user-soa-link" |
	"user-soa-unlink" |
	"soa-manage-entitlements" |
	"soa-manage-partner" |
	"soa-create-partner"
);

type AlbumType = "album" | "single" | "compilation";
type Followers = { href: string | null; total: number; };
type RestrictionReasons = "market" | "product" | "explicit";
type ExternalUrls = { spotify: string };
type ReleaseDatePrecision = "year" | "month" | "day";
type AvailableMarkets = string[]; // TODO add all country codes
type Languages = string[]; // TODO Add language codes

// ! General Types
export type SpotifyImageObject = { url: string; height: number; width: number; };

export type SpotifyArtistObject = {
	external_urls: ExternalUrls;
	followers: Followers;
	genres: string[];
	href: string;
	id: string;
	images: SpotifyImageObject[];
	name: string;
	popularity: number;
	type: "artist";
	uri: string;
};

export type SpotifySimplifiedArtistObject = {
	external_urls: ExternalUrls;
	href: string;
	id: string;
	name: string;
	uri: string;
};

export type SpotifyTrackObject = {
	album: Omit<SpotifySimplifiedAlbumObject, "genres">;
	artists: SpotifyArtistObject[];
	available_markets: AvailableMarkets;
	disc_number: number;
	duration_ms: number;
	explicit: boolean;
	external_ids: { isrc: string; ean: string; upc: string };
	external_urls: ExternalUrls;
	href: string;
	id: string;
	is_playable: boolean;
	linked_from: {};
	restrictions: { reason: RestrictionReasons; };
	name: string;
	popularity: number;
	preview_url: string | null;
	track_number: number;
	type: "track";
	uri: string;
	is_local: string;
};

export type SpotifyAlbumObject<T> = {
	album_type: AlbumType;
	total_tracks: number;
	available_markets: AvailableMarkets;
	external_urls: ExternalUrls;
	href: string;
	id: string;
	images: SpotifyImageObject[];
	name: string;
	release_date: string;
	release_date_precision: ReleaseDatePrecision;
	restrictions: { reason: RestrictionReasons; };
	type: "album";
	uri: string;
	album_group: "album" | "single" | "compilation" | "appears_on";
	genres: string[];
} & T;

export type SpotifySimplifiedAlbumObject = SpotifyAlbumObject<{
	artists: SpotifySimplifiedArtistObject[]
}>;

export type SpotifyPlaylistObject = {
	collaborative: boolean;
	description: string;
	external_urls: ExternalUrls;
	href: string;
	id: string;
	images: SpotifyImageObject[];
	name: string;
	owner: {
		external_urls: ExternalUrls;
		followers: Followers;
		href: string;
		id: string;
		type: "user";
		uri: string;
		display_name: string | null;
	};
	public: boolean;
	snapshot_id: string;
	tracks: {
		href: string;
		total: number;
	};
	type: "playlist";
	uri: string;
};

export type SpotifySimplifiedShowObject = {
	available_markets: AvailableMarkets;
	copyrights: SpotifyCopyrightObject[];
	description: string;
	html_description: string;
	explicit: boolean;
	external_urls: ExternalUrls;
	href: string;
	id: string;
	images: SpotifyImageObject[];
	is_externally_hosted: boolean;
	languages: Languages;
	media_type: string;
	name: string;
	publisher: string;
	type: "show";
	uri: string;
	total_episodes: number;
};

export type SpotifySimplifiedEpisodeObject = {
	audio_preview_url: string;
	description: string;
	html_description: string;
	duration_ms: string;
	explicit: boolean;
	external_urls: ExternalUrls;
	href: string;
	id: string;
	images: SpotifyImageObject[];
	is_externally_hosted: boolean;
	is_playable: boolean;
	languages: Languages;
	name: string;
	release_date: string;
	release_date_precision: ReleaseDatePrecision;
	resume_point: { fully_played: boolean; resume_position_ms: number; };
	type: "episode";
	uri: string;
	restrictions: RestrictionReasons;
};

export type SpotifySimplifiedAudiobookObject = {
	authors: SpotifyAuthorObject[];
	available_markets: AvailableMarkets;
	copyrights: SpotifyCopyrightObject[];
	description: string;
	html_description: string;
	edition: string;
	explicit: boolean;
	external_urls: ExternalUrls;
	href: string;
	id: string;
	images: SpotifyImageObject[];
	languages: Languages;
	media_type: string;
	name: string;
	narrators: SpotifyNarratorObject[];
	published: string;
	type: "audiobook";
	uri: string;
	total_chapters: number;
};

export type SpotifyAuthorObject = { name: string; };

export type SpotifyCopyrightObject = { text: string; type: string; };

export type SpotifyNarratorObject = { name: string; };

// ! Endpoint Types
type SpotifyResponsePayload<T> = {
	href: string;
	limit: number;
	next: string | null;
	offset: number;
	previous: string | null;
	total: number;
} & T;

export type SpotifyConfigs = {
	searchForItem: {
		q: string;
		type: ("album" | "artist" | "playlist" | "track" | "show" | "episode")[];
		market?: AvailableMarkets[number];
		limit?: number;
		offset?: number;
		include_external?: "audio"
	};
	getArtistMusic: {
		id: string;
		include_groups?: "album" | "single" | "appears_on" | "compilation";
		market?: AvailableMarkets[number];
		limit?: number;
		offset?: number;
	};
	getAlbum: {
		id: string;
		market?: AvailableMarkets[number];
	};
	getAlbums: { ids: string[] | string; };
	getAlbumTracks: {
		id: string;
		market?: AvailableMarkets[number];
		limit?: number;
		offset?: number;
	};
	getArtist: { id: string; market?: AvailableMarkets[number]; };
	getArtists: { ids: string[] | string; };
	getTrack: { id: string; market?: AvailableMarkets[number]; };
	getTracks: { ids: string[] | string; };
};

export type SpotifyResponses = {
	getCodeFromClientCredentials: {
		access_token: string;
		token_type: "bearer";
		expires_in: number;
	};
	getAccessToken: {
		access_token: string;
		token_type: string;
		scope: SpotifyScopes[];
		expires_in: number;
		refresh_token: string;
	};
	searchForItem: {
		tracks: SpotifyResponsePayload<{ items: SpotifyTrackObject[]; }>;
		artists: SpotifyResponsePayload<{ items: SpotifyArtistObject[]; }>;
		albums: SpotifyResponsePayload<{ items: SpotifySimplifiedAlbumObject[]; }>;
		playlists: SpotifyResponsePayload<{ items: SpotifyPlaylistObject[]; }>;
		shows: SpotifyResponsePayload<{ items: SpotifySimplifiedShowObject[]; }>;
		episodes: SpotifyResponsePayload<{ items: SpotifySimplifiedEpisodeObject[]; }>;
		audiobooks: SpotifyResponsePayload<{ items: SpotifySimplifiedAudiobookObject[]; }>;
	};
	getArtistMusic: SpotifyResponsePayload<{ items: SpotifySimplifiedAlbumObject[]; }>;
	getAlbum: SpotifyAlbumObject<{ artists: SpotifySimplifiedArtistObject[] }>;
	getAlbums: { albums: SpotifyAlbumObject<{ artists: SpotifySimplifiedArtistObject[] }>[]; };
	getAlbumTracks: SpotifyResponsePayload<{ items: SpotifyTrackObject[]; }>;
	getArtist: SpotifyArtistObject;
	getArtists: { artists: SpotifyArtistObject[]; };
	getTrack: SpotifyTrackObject;
	getTracks: { tracks: SpotifyTrackObject[]; };
};
