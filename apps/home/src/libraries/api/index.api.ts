import { z } from "zod";

import { MusicArtistSchema, MusicPostSchema } from "../schemas";

export const SearchWebsiteRoute = {
	url: "/api/search",
	method: "GET",
	dtos: { query: z.object({ term: z.string() }) },
	responses: {
		200: z.object({
			music: z.array(MusicPostSchema).default([]),
			artists: z.array(MusicArtistSchema).default([]),
		})
	}
};
