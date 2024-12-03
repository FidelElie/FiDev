import { getCollection } from "astro:content";

import {
	queryParams,
	paginateEntries,
	getSpotifyEnv,
} from "@/libraries/utilities";
import { createSpotifyClient } from "@/libraries/clients";
import type { MusicPostSchema } from "@/libraries/schemas";
import {
	FetchMusicArtistsRoute,
	FetchMusicGenresRoute,
	FetchMusicPostsRoute,
	GetCurrentlyPlayingTrackRoute,
} from "@/libraries/api/music.api";
import { MusicPostMetadata } from "@/libraries/constants";

/**
 *
 * @param request
 * @returns
 */
export const fetchMusicProjects = async (request: Request) => {
	const { dtos, responses } = FetchMusicPostsRoute;

	const { page, size, genres, levels, search } = dtos.query.parse(
		queryParams.decodeFromUrl(request.url),
	);

	const musicPosts = await getCollection("music", (post) => {
		const includedByGenre =
			!genres?.length ||
			genres.some((genre) => post.data.genres.includes(genre));

		const includedByRating =
			!levels?.length || levels.includes(post.data.rating);

		const includedBySearch = (() => {
			if (!search) {
				return true;
			}

			const lowerSearch = search.toLowerCase();

			return (
				post.data.name.toLowerCase().includes(lowerSearch) ||
				post.data.artists.some((artist) =>
					artist.name.toLowerCase().includes(lowerSearch),
				) ||
				post.data.genres.some((genre) =>
					genre.toLowerCase().includes(lowerSearch),
				) ||
				(post.data.type === MusicPostMetadata.types.ALBUM &&
					post.data.tracks.some((track) =>
						track.name.toLowerCase().includes(lowerSearch),
					))
			);
		})();

		return includedByGenre && includedByRating && includedBySearch;
	});

	const sortedPosts = musicPosts.toSorted((postA, postB) => {
		return (
			new Date(postB.data.date || Date.now()).valueOf() -
			new Date(postA.data.date || Date.now()).valueOf()
		);
	});

	const result = paginateEntries(sortedPosts, { page, size, defaultSize: 15 });

	const validatedResult = responses[200].parse({
		...result,
		items: result.items.map((item) => ({ ...item.data, slug: item.slug })),
	});

	return validatedResult;
};

/**
 *
 * @returns
 */
export const fetchMusicPostsTotal = async () => {
	const musicPosts = await getCollection("music");

	return musicPosts.length;
};

/**
 *
 * @param request
 * @returns
 */
export const fetchMusicArtists = async (request: Request) => {
	const { dtos, responses } = FetchMusicArtistsRoute;

	const { page, size } = dtos.query.parse(
		queryParams.decodeFromUrl(request.url),
	);

	const artistEntries = (
		await getCollection("artists", (artist) => {
			return !!artist.data.genres.length;
		})
	).toSorted((artistA, artistB) =>
		artistA.data.name.localeCompare(artistB.data.name),
	);

	const result = paginateEntries(artistEntries, {
		page,
		size,
		defaultSize: 20,
	});

	const validatedResult = responses[200].parse({
		...result,
		items: result.items.map((item) => item.data),
	});

	return validatedResult;
};

/**
 *
 * @param request
 * @returns
 */
export const fetchMusicGenres = async (request: Request) => {
	const { dtos, responses } = FetchMusicGenresRoute;

	const { page, size, search } = dtos.query.parse(
		queryParams.decodeFromUrl(request.url),
	);

	const musicProjects = await getCollection("music");

	const uniqueGenres = new Set(
		musicProjects.map((post) => post.data.genres).flat(),
	);

	const genres = Array.from(uniqueGenres, (genre) => {
		if (!search) {
			return genre;
		}

		return genre.includes(search) ? genre : [];
	})
		.flat()
		.toSorted((genreA, genreB) => genreA.localeCompare(genreB));

	const result = paginateEntries(genres, {
		page,
		size,
		defaultSize: Number.MAX_SAFE_INTEGER,
	});

	const validatedResult = responses[200].parse(result);

	return validatedResult;
};

export const getCurrentPlayingTrack = async () => {
	const { responses } = GetCurrentlyPlayingTrackRoute;

	const spotifyClient = createSpotifyClient(getSpotifyEnv());

	await spotifyClient.refreshAccessToken();

	const currentPlayingResponse = await spotifyClient.getPlaybackState({});

	const [artistEntries, musicPosts] = await Promise.all([
		getCollection("artists"),
		getCollection("music"),
	]);

	const currentlyPlaying = currentPlayingResponse?.item;

	if (!currentlyPlaying || currentlyPlaying.type === "episode") {
		return null;
	}

	const [firstArtist] = currentlyPlaying.album.artists;

	const getPostInformation = (post?: {
		slug: string;
		data: MusicPostSchema;
	}) => {
		if (!post?.slug) {
			return null;
		}

		return {
			name: post.data.name,
			slug: post.slug || post.data.slug,
			type: post.data.type,
		};
	};

	const artistEntry = artistEntries.find(
		(artist) => artist.data.id === firstArtist.id,
	);

	const musicTrackEntry = getPostInformation(
		musicPosts.find((post) => post.data.spotifyId === currentlyPlaying.id),
	);

	const musicAlbumEntry = getPostInformation(
		musicPosts.find(
			(post) => post.data.spotifyId === currentlyPlaying.album.id,
		),
	);

	const response = {
		name: currentlyPlaying.name,
		uri: currentlyPlaying.uri,
		covers: currentlyPlaying.album.images,
		remaining: currentPlayingResponse.progress_ms,
		duration: currentlyPlaying.duration_ms,
		playing: currentPlayingResponse.is_playing,
		shuffled: currentPlayingResponse.shuffle_state,
		repeating: currentPlayingResponse.repeat_state,
		posts: [
			...(musicTrackEntry ? [musicTrackEntry] : []),
			...(musicAlbumEntry ? [musicAlbumEntry] : []),
		],
		artist: {
			name: firstArtist.name,
			slug: artistEntry?.data.slug || "",
			uri: firstArtist.uri,
		},
	};

	return responses[200].parse(response);
};
