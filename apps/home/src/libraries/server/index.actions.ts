import { getCollection } from "astro:content";

import { SearchWebsiteRoute } from "@/libraries/api";
import { queryParams } from "@/libraries/utilities";

export const searchWebsiteAction = async (request: Request) => {
	const { dtos, responses } = SearchWebsiteRoute;

	const params = queryParams.decodeFromUrl(request.url);

	const { term } = dtos.query.parse(params);

	const [
		musicResult,
		artistsResult
	] = await Promise.all([
		getCollection("music", (entry) => {
			return (
				entry.slug.toLowerCase().includes(term) ||
				entry.data.name.toLowerCase().includes(term) ||
				entry.data.slug?.toLowerCase().includes(term) ||
				entry.data.artists.some(artist => artist.name.toLowerCase().includes(term)) ||
				entry.data.genres.some(genre => genre.toLowerCase().includes(term))
			);
		}),
		getCollection("artists", (entry) => {
			return (
				entry.data.slug.toLowerCase().includes(term) ||
				entry.data.name.toLowerCase().includes(term) ||
				entry.data.genres.some(genre => genre.toLowerCase().includes(term))
			)
		}),
	]);

	const searchResults = {
		music: 	musicResult.slice(0, 5).map(entry => ({
			...entry.data,
			slug: entry.slug,
			preview: entry.body.slice(0, 150)
		})),
		artists: artistsResult.slice(0, 6).map(entry => entry.data)
	}

	return responses[200].parse(searchResults);
}
