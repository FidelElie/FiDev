import { z } from "zod";

import { getConstKeys } from "@fi.dev/typescript";

import {
	arrayQueryParam,
	dateTransferSchema,
	MusicArtistSchema,
	MusicCoverImageSchema,
	MusicPostSchema,
	paginateSchema,
} from "@/libraries/schemas";
import { MusicPostRatingMap } from "@/libraries/constants";

/**
 *
 */
export const MusicImFeelingLuckyRoute = {
	url: "/api/music/lucky",
	method: "GET",
	responses: {
		200: z.object({
			post: MusicPostSchema,
		}),
	},
};

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
			levels: arrayQueryParam().optional(),
		}),
	},
	responses: {
		200: paginateSchema(MusicPostSchema),
	},
};

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
		}),
	},
	responses: {
		200: paginateSchema(MusicArtistSchema),
	},
};

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
			size: z.number().optional(),
		}),
	},
	responses: {
		200: paginateSchema(z.string()),
	},
};

/**
 *
 */
export const FetchMusicProjectStatsRoute = {
	url: "/api/music/:postSlug/stats",
	method: "GET",
	dtos: {
		params: z.object({ postSlug: z.string() }),
	},
	responses: {
		200: z
			.object({
				views: z.number(),
				liked: z.number(),
				ratings: z.record(z.enum(getConstKeys(MusicPostRatingMap)), z.number()),
				publishedAt: dateTransferSchema().optional(),
				updatedAt: dateTransferSchema().optional(),
			})
			.nullable(),
	},
};

/**
 *
 */
export const UpdateMusicProjectRoute = {
	url: "/api/music/:postSlug",
	method: "PATCH",
	dtos: {
		params: z.object({ postSlug: z.string() }),
	},
	responses: {
		200: z.object({}),
	},
};

export const GetCurrentlyPlayingTrackRoute = {
	url: "/api/music/playing",
	method: "GET",
	responses: {
		200: z.union([
			z.object({
				name: z.string(),
				uri: z.string(),
				covers: z.array(MusicCoverImageSchema),
				remaining: z.number(),
				duration: z.number(),
				playing: z.boolean(),
				shuffled: z.boolean(),
				repeating: z.enum(["track", "off", "context"]),
				posts: z.array(
					z.object({
						name: z.string(),
						slug: z.string(),
						type: z.enum(["ALBUM", "TRACK"]),
					}),
				),
				artist: z.object({
					name: z.string(),
					slug: z.string(),
					uri: z.string()
				}),
			}),
			z.null(),
		]),
	},
};
