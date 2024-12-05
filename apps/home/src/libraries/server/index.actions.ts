import { getCollection } from "astro:content";

import { getEnvironmentVariable } from "@fi.dev/typescript";

import { queryParams } from "@/libraries/utilities";
import { createKitClient } from "@/libraries/clients";
import { MusicPostMetadata } from "@/libraries/constants";
import { SearchWebsiteRoute, SubscribeToWebsiteRoute } from "@/libraries/api";

export const searchWebsiteAction = async (request: Request) => {
	const { dtos, responses } = SearchWebsiteRoute;

	const params = queryParams.decodeFromUrl(request.url);

	const { term } = dtos.query.parse(params);

	const loweredTerm = term.toLowerCase();

	const [musicResult, artistsResult] = await Promise.all([
		getCollection("music", (entry) => {
			return (
				entry.id.toLowerCase().includes(loweredTerm) ||
				entry.data.name.toLowerCase().includes(loweredTerm) ||
				entry.data.slug?.toLowerCase().includes(loweredTerm) ||
				entry.data.artists.some((artist) =>
					artist.name.toLowerCase().includes(loweredTerm),
				) ||
				entry.data.genres.some((genre) =>
					genre.toLowerCase().includes(loweredTerm),
				) ||
				(entry.data.type === MusicPostMetadata.types.ALBUM &&
					entry.data.tracks.some((track) =>
						track.name.toLowerCase().includes(loweredTerm),
					))
			);
		}),
		getCollection("artists", (entry) => {
			return (
				entry.data.slug.toLowerCase().includes(loweredTerm) ||
				entry.data.name.toLowerCase().includes(loweredTerm) ||
				entry.data.genres.some((genre) =>
					genre.toLowerCase().includes(loweredTerm),
				)
			);
		}),
	]);

	const musicPosts = await Promise.all(
		musicResult.slice(0, 5).map(async (entry) => {
			return {
				...entry.data,
				slug: entry.id,
			};
		}),
	);

	const searchResults = {
		music: musicPosts,
		artists: artistsResult.slice(0, 6).map((entry) => entry.data),
	};

	return responses[200].parse(searchResults);
};

export const subscribeToWebsite = async (request: Request) => {
	const { dtos, responses } = SubscribeToWebsiteRoute;

	const body = await request.json();

	const validatedBody = dtos.body.parse(body);

	const kitClient = createKitClient({
		apiKey: getEnvironmentVariable("KIT_API_KEY"),
	});

	await kitClient.createSubscriber(validatedBody);

	return responses[202].parse(null);
};
