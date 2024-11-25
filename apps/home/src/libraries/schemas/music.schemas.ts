import { z } from "zod";

import { getConstKeys } from "@fi.dev/typescript";

import { InsertPostSchema } from "./database.schemas";
import { MusicPostMetadata } from "../constants";

const MusicAlbumTrackSchema = z.object({
	spotifyId: z.string(),
	spotifyUrl: z.string().url(),
	name: z.string(),
	favourite: z.boolean(),
});

export const MusicCoverImageSchema = z.object({
	url: z.string().url(),
	width: z.number(),
	height: z.number(),
});

export const MusicArtistSchema = z.object({
	id: z.string(),
	slug: z.string(),
	spotifyId: z.string(),
	spotifyUrl: z.string().url(),
	name: z.string(),
	covers: z.array(MusicCoverImageSchema),
	genres: z.array(z.string()),
});

export type MusicArtistSchema = z.infer<typeof MusicArtistSchema>;

export const SimplifiedMusicArtistSchema = z.object({
	slug: z.string(),
	name: z.string(),
	spotifyId: z.string(),
});

export const BaseMusicPostSchema = z.object({
	name: z.string(),
	date: z.coerce
		.date()
		.transform((date) => date.toISOString())
		.optional(),
	slug: z.string().optional(),
	spotifyId: z.string(),
	spotifyUrl: z.string().url(),
	artists: z.array(SimplifiedMusicArtistSchema),
	covers: z.array(MusicCoverImageSchema),
	duration: z.number(), // In milliseconds
	release: z.coerce.string(),
	rating: z.enum(getConstKeys(MusicPostMetadata.ratings)),
	genres: z.array(z.string()),
});

const BaseDatabaseMusicPostSchema = InsertPostSchema.pick({
	publishedAt: true,
	updatedAt: true,
	liked: true,
	ratings: true,
	views: true,
});

export const MusicPostSchema = z.union([
	BaseMusicPostSchema.merge(
		z.object({
			type: z.literal(MusicPostMetadata.types.ALBUM),
			tracks: z.array(MusicAlbumTrackSchema),
		}),
	),
	BaseMusicPostSchema.merge(
		z.object({ type: z.literal(MusicPostMetadata.types.TRACK) }),
	),
]);

export type MusicPostSchema = z.infer<typeof MusicPostSchema>;

export const DatabaseMusicPostSchema = z.union([
	BaseMusicPostSchema.merge(
		z.object({
			type: z.literal(MusicPostMetadata.types.ALBUM),
			tracks: z.array(MusicAlbumTrackSchema),
		}),
	).merge(BaseDatabaseMusicPostSchema),
	BaseMusicPostSchema.merge(
		z.object({ type: z.literal(MusicPostMetadata.types.TRACK) }),
	).merge(BaseDatabaseMusicPostSchema),
]);

export type DatabaseMusicPostSchema = z.infer<typeof DatabaseMusicPostSchema>;
