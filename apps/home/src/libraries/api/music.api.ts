import { z, ZodSchema } from "zod";
import { MusicPostSchema } from "../schemas";

const paginateSchema = <T extends ZodSchema>(schema: T) => {
	return z.object({
		items: z.array(schema),
		pagination: z.object({
			page: z.number(),
			size: z.number(),
			next: z.boolean(),
			previous: z.boolean(),
		})
	})
}

export const MusicImFeelingLuckyRoute = {
	url: "/api/music/lucky",
	method: "GET",
	responses: {
		200: z.object({
			post: MusicPostSchema
		})
	}
}

export const FetchMusicPostsRoute = {
	url: "/api/music",
	method: "GET",
	dtos: {
		query: z.object({
			page: z.number().optional(),
			size: z.number().optional(),
			genres: z.union([z.array(z.string()), z.string()]).transform(input => Array.isArray(input) ? input : [input]).optional(),
			levels: z.union([z.array(z.string()), z.string()]).transform(input => Array.isArray(input) ? input : [input]).optional()
		}),
	},
	responses: {
		200: paginateSchema(MusicPostSchema),
	}
}

export type InferDTOS<T extends { [key: string | number]: ZodSchema }> = {
	[key in keyof T]: z.infer<T[keyof T]>
}
