import { z } from "zod";

import { getConstKeys } from "@fi.dev/typescript";

import { MusicPostMetadata } from "@/libraries/constants";
import { BaseMusicPostSchema, MusicArtistSchema } from "@/libraries/schemas";

export const SearchWebsiteRoute = {
	url: "/api/search",
	method: "GET",
	dtos: { query: z.object({ term: z.string() }) },
	responses: {
		200: z.object({
			music: z
				.array(
					BaseMusicPostSchema.pick({
						name: true,
						artists: true,
						covers: true,
						slug: true,
						spotifyId: true,
						rating: true,
					}).merge(
						z.object({
							preview: z.string(),
							type: z.enum(getConstKeys(MusicPostMetadata.types)),
						}),
					),
				)
				.default([]),
			artists: z
				.array(
					MusicArtistSchema.pick({
						name: true,
						slug: true,
						spotifyId: true,
						covers: true,
						genres: true,
					}),
				)
				.default([]),
		}),
	},
};

export const SubscribeToWebsiteRoute = {
	url: "/api/subscribers",
	method: "POST",
	dtos: {
		body: z.object({ forename: z.string(), email: z.string().email() })
	},
	responses: {
		202: z.null()
	}
}
