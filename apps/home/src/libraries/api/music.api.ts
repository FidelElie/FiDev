import { z } from "zod";

import {
	arrayQueryParam,
	MusicArtistSchema,
	MusicPostSchema,
	paginateSchema
} from "@/libraries/schemas";

/**
 *
 */
export const MusicImFeelingLuckyRoute = {
	url: "/api/music/lucky",
	method: "GET",
	responses: {
		200: z.object({
			post: MusicPostSchema
		})
	}
}

/**
 *
 */
export const FetchMusicPostsRoute = {
	url: "/api/music",
	method: "GET",
	dtos: {
		query: z.object({
			page: z.number().optional(),
			size: z.number().optional(),
			genres: arrayQueryParam().optional(),
			levels: arrayQueryParam().optional()
		}),
	},
	responses: {
		200: paginateSchema(MusicPostSchema),
	}
}

/**
 *
 */
export const FetchMusicArtistsRoute = {
	url: "/api/music/artists",
	method: "GET",
	dtos: {
		query: z.object({
			page: z.number().optional(),
			size: z.number().optional(),
			genres: arrayQueryParam().optional(),
		})
	},
	responses: {
		200: paginateSchema(MusicArtistSchema)
	}
}

/**
 *
 */
export const FetchMusicGenresRoute = {
	url: "/api/music/genres",
	method: "GET",
	dtos: {
		query: z.object({
			search: z.string().optional(),
			page: z.number().optional(),
			size: z.number().optional()
		})
	},
	responses: {
		200: paginateSchema(z.string())
	}
}
