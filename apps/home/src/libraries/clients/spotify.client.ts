import { generateRandomString } from "@fi.dev/typescript";

import { parseValueToString } from "@/libraries/utilities";
import type {
	SpotifyConfigs,
	SpotifyResponses,
	SpotifyScopes,
	SpotifyClientConfig
} from "@/libraries/types";
import { createRequestClient } from "@/libraries/clients/request.client";

const URLS = {
	accounts: "https://accounts.spotify.com",
	api: "https://api.spotify.com"
}

export const createSpotifyClient = (config: SpotifyClientConfig) => {
	const { clientId, clientSecret, redirectURI, refreshToken } = config;

	if (!clientId || !clientSecret) {
		throw new Error("clientId and clientSecret is required to initialise Spotify client");
	}

	const headers: HeadersInit = {}

	const baseQueryParams = new URLSearchParams({
		client_id: clientId,
		client_secret: clientSecret,
		redirect_uri: redirectURI
	});

	const clients = {
		accounts: createRequestClient({ baseUrl: URLS.accounts }),
		api: createRequestClient({ baseUrl: URLS.api })
	};

	const generateBasicAuthClaim = () => {
		return `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`;
	}

	const generateBearerAuthClaim = (accessToken?: string) => {
		return { Authorization: headers.Authorization || `Bearer ${accessToken}` };
	}

	const refreshAccessToken = async (token?: string, setAuth?: boolean) => {
		const passedToken = token || refreshToken;

		if (!passedToken) { throw new Error("No refresh token was provided") }

		const payload = new URLSearchParams({
			grant_type: "refresh_token",
			refresh_token: passedToken,
			client_id: clientId
		});

		const response = await clients.accounts<SpotifyResponses["getAccessToken"]>({
			url: "/api/token",
			method: "POST",
			body: payload,
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
				Authorization: generateBasicAuthClaim()
			}
		});

		if ((!token && refreshToken) || setAuth) {
			headers.Authorization = `Bearer ${response.access_token}`;
		}

		return response;
	}

	return {
		/**
		 *
		 * @param scopes
		 * @returns
		 */
		generateAuthorizationCodeFlowURL: (scopes: SpotifyScopes[] | string) => {
			const queryParams = new URLSearchParams(baseQueryParams);

			queryParams.set("scopes", typeof scopes === "string" ? scopes : scopes.join(","));
			queryParams.set("state", generateRandomString(16));
			queryParams.set("response_type", "code");

			return `${clients.accounts.baseUrl}/authorize?${queryParams.toString()}`;
		},
		/**
		 *
		 * @returns
		 */
		getCodeFromClientCredentials: () => {
			const payload = new URLSearchParams({ grant_type: "client_credentials" });

			return clients.accounts<SpotifyResponses["getCodeFromClientCredentials"]>({
				url: "/api/token",
				method: "POST",
				body: payload,
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
					Authorization: generateBasicAuthClaim(),
				}
			});
		},
		/**
		 *
		 * @param code
		 * @param setToken for duration of client life
		 * @returns
		 */
		getAccessToken: async (code: string) => {
			const payload = new URLSearchParams({
				grant_type: "authorization_code",
				redirect_uri: redirectURI,
				code
			});

			return clients.accounts<SpotifyResponses["getAccessToken"]>({
				url: "/api/token",
				method: "POST",
				body: payload,
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
					Authorization: generateBasicAuthClaim()
				}
			});
		},
		/**
		 *
		 * @param refreshToken
		 * @returns
		 */
		refreshAccessToken,
		/**
		 *
		 * @param config
		 * @param accessToken
		 * @returns
		 */
		searchForItem: async (config: SpotifyConfigs["searchForItem"], accessToken?: string) => {
			const queryParams = new URLSearchParams(
				Object.entries(config).map(([param, value]) => [param, parseValueToString(value)])
			);

			return clients.api<SpotifyResponses["searchForItem"]>({
				url: `/v1/search?${queryParams.toString()}`,
				headers: generateBearerAuthClaim(accessToken)
			});
		},
		getArtistMusic: async (config: SpotifyConfigs["getArtistMusic"], accessToken?: string) => {
			const queryParams = new URLSearchParams(
				Object.entries(config).map(([param, value]) => [param, parseValueToString(value)])
			);

			const artistId = queryParams.get("id");

			queryParams.delete("id");

			return clients.api<SpotifyResponses["getArtistMusic"]>({
				url: `/v1/artists/${artistId}/albums?${queryParams.toString()}`,
				headers: generateBearerAuthClaim(accessToken)
			});
		},
		getAlbum: async (config: SpotifyConfigs["getAlbum"], accessToken?: string) => {
			const queryParams = new URLSearchParams(
				Object.entries(config).map(([param, value]) => [param, parseValueToString(value)])
			);

			const albumId = queryParams.get("id");

			queryParams.delete("id");

			return clients.api<SpotifyResponses["getAlbum"]>({
				url: `/v1/albums/${albumId}?${queryParams.toString()}`,
				headers: generateBearerAuthClaim(accessToken)
			});
		},
		getAlbums: async (config: SpotifyConfigs["getAlbums"], accessToken?: string) => {
			const { ids } = config;

			const maxNumberOfIds = 100;

			const numberOfBuckets = Math.ceil(ids.length / maxNumberOfIds);

			const results = await Promise.all(
				new Array(numberOfBuckets).fill(null).map(async (_, bucketIndex) => {
					const start = bucketIndex * ids.length;
					const bucketIds = ids.slice(start, start + maxNumberOfIds);

					const response = await clients.api<SpotifyResponses["getAlbums"]>({
						url: `/v1/albums?ids=${parseValueToString(bucketIds)}`,
						headers: generateBearerAuthClaim(accessToken)
					});

					return response.albums;
				})
			);

			return results.flat();
		},
		getAlbumTracks: async (config: SpotifyConfigs["getAlbumTracks"], accessToken?: string) => {
			const queryParams = new URLSearchParams(
				Object.entries(config).map(([param, value]) => [param, parseValueToString(value)])
			);

			const albumId = queryParams.get("id");

			queryParams.delete("id");

			return clients.api<SpotifyResponses["getAlbumTracks"]>({
				url: `/v1/albums/${albumId}/tracks?${queryParams.toString()}`,
				headers: generateBearerAuthClaim(accessToken)
			});
		},
		getArtist: async (config: SpotifyConfigs["getArtist"], accessToken?: string) => {
			const queryParams = new URLSearchParams(
				Object.entries(config).map(([param, value]) => [param, parseValueToString(value)])
			);

			const artistId = queryParams.get("id");

			queryParams.delete("id");

			return clients.api<SpotifyResponses["getArtist"]>({
				url: `/v1/artists/${artistId}?${queryParams.toString()}`,
				headers: generateBearerAuthClaim(accessToken)
			})
		},
		getArtists: async (config: SpotifyConfigs["getArtists"], accessToken?: string) => {
			const { ids } = config;

			const maxNumberOfIds = 100;

			const numberOfBuckets = Math.ceil(ids.length / maxNumberOfIds);

			const results = await Promise.all(
				new Array(numberOfBuckets).fill(null).map(async (_, bucketIndex) => {
					const start = bucketIndex * ids.length;
					const bucketIds = ids.slice(start, start + maxNumberOfIds);

					const response = await clients.api<SpotifyResponses["getArtists"]>({
						url: `/v1/artists?ids=${parseValueToString(bucketIds)}`,
						headers: generateBearerAuthClaim(accessToken)
					});

					return response.artists;
				})
			);

			return results.flat();
		},
		getTracks: async (config: SpotifyConfigs["getTracks"], accessToken?: string) => {
			const { ids } = config;

			const maxNumberOfIds = 100;

			const numberOfBuckets = Math.ceil(ids.length / maxNumberOfIds);

			const results = await Promise.all(
				new Array(numberOfBuckets).fill(null).map(async (_, bucketIndex) => {
					const start = bucketIndex * ids.length;
					const bucketIds = ids.slice(start, start + maxNumberOfIds);

					const response = await clients.api<SpotifyResponses["getTracks"]>({
						url: `/v1/tracks?ids=${parseValueToString(bucketIds)}`,
						headers: generateBearerAuthClaim(accessToken)
					});

					return response.tracks;
				})
			);

			return results.flat();
		}
	}
}

