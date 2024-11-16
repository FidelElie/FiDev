import { getCollection } from "astro:content";

import { SearchWebsiteRoute } from "../api";
import { queryParams } from "../utilities";

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
				entry.data.artists.some(
					artist => artist.name.toLowerCase().includes(term)
				)
			);
		}),
		getCollection("artists", (entry) => entry.data.slug.toLowerCase().includes(term)),
	]);

	const searchResults = {
		music: musicResult.map(entry => ({ ...entry.data, slug: entry.slug })).slice(0, 3),
		artists: artistsResult.map(entry => entry.data).slice(0, 3)
	}

	return responses[200].parse(searchResults);
}
