import { getCollection } from "astro:content";

import { queryParams, paginateEntries } from "@/libraries/utilities";

import {
	FetchMusicArtistsRoute,
	FetchMusicGenresRoute,
	FetchMusicPostsRoute
} from "@/libraries/api/music.api";

/**
 *
 * @param request
 * @returns
 */
export const fetchMusicProjects = async (request: Request) => {
	const { dtos, responses } = FetchMusicPostsRoute;

	const { page, size, genres, levels } = dtos.query.parse(queryParams.decodeFromUrl(request.url));

	const musicPosts = await getCollection("music", (post) => {
		const includedByGenre = !genres?.length || genres.some(
			genre => post.data.genres.includes(genre)
		);

		const includedByRating = !levels?.length || levels.includes(post.data.rating);

		return includedByGenre && includedByRating;
	});

	const result = paginateEntries(
		musicPosts,
		{ page, size, defaultSize: 15 }
	);

	const validatedResult = responses[200].parse({
		...result,
			items: result.items.map(item => ({ ...item.data, slug: item.slug }))
	});

	return validatedResult;
}

/**
 *
 * @param request
 * @returns
 */
export const fetchMusicArtists = async (request: Request) => {
	const { dtos, responses } = FetchMusicArtistsRoute;

	const { page, size } = dtos.query.parse(queryParams.decodeFromUrl(request.url));

	const artistEntries = await getCollection("artists", (artist) => {
		return !!artist.data.genres.length;
	});

	const result = paginateEntries(
		artistEntries,
		{ page, size, defaultSize: 20 }
	);

	const validatedResult = responses[200].parse({
		...result,
		items: result.items.map(item => item.data)
	});

	return validatedResult;
}

/**
 *
 * @param request
 * @returns
 */
export const fetchMusicGenres = async (request: Request) => {
	const { dtos, responses } = FetchMusicGenresRoute;

	const { page, size, search } = dtos.query.parse(queryParams.decodeFromUrl(request.url));

	const musicProjects = await getCollection("music");

	const uniqueGenres = new Set(musicProjects.map(post => post.data.genres).flat());

	const genres = Array.from(
		uniqueGenres,
		(genre) => {
			if (!search) { return genre; }

			return genre.includes(search) ? genre : [];
		}
	).flat();

	const result = paginateEntries(
		genres,
		{ page, size, defaultSize: Number.MAX_SAFE_INTEGER }
	);

	const validatedResult = responses[200].parse(result);

	return validatedResult;
}
