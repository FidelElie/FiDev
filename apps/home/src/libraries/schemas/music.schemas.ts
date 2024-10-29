import { z } from "zod";

import { getConstKeys } from "@fi.dev/typescript";

export const MusicPostMetadata = {
	ratings: {
		LEVEL_0: "LEVEL_0",
		LEVEL_1: "LEVEL_1",
		LEVEL_2: "LEVEL_2",
		LEVEL_3: "LEVEL_3",
		LEVEL_4: "LEVEL_4",
		LEVEL_5: "LEVEL_5",
		LEVEL_6: "LEVEL_6"
	},
	types: {
		ALBUM: "ALBUM",
		TRACK: "TRACK"
	}
} as const;

export const MusicPostRatingMap = {
	[MusicPostMetadata.ratings.LEVEL_0]: "Instant Classic",
	[MusicPostMetadata.ratings.LEVEL_1]: "Must Listen",
	[MusicPostMetadata.ratings.LEVEL_2]: "Worth It",
	[MusicPostMetadata.ratings.LEVEL_3]: "Solid",
	[MusicPostMetadata.ratings.LEVEL_4]: "Aight",
	[MusicPostMetadata.ratings.LEVEL_5]: "Meh",
	[MusicPostMetadata.ratings.LEVEL_6]: "Hot Garbage"
} as const;

const MusicAlbumTrackSchema = z.object({
	spotifyId: z.string(),
	spotifyUrl: z.string().url(),
	name: z.string(),
	favourite: z.boolean(),
})

const MusicCoverImageSchema = z.object({
	url: z.string().url(),
	width: z.number(),
	height: z.number()
});

export const MusicArtistSchema = z.object({
	id: z.string(),
	slug: z.string(),
	spotifyId: z.string(),
	spotifyUrl: z.string().url(),
	name: z.string(),
	covers: z.array(MusicCoverImageSchema),
	genres: z.array(z.string())
});

export type MusicArtistSchema = z.infer<typeof MusicArtistSchema>;

export const SimplifiedMusicArtistSchema = z.object({
	slug: z.string(),
	name: z.string(),
	spotifyId: z.string()
});

const BaseMusicPostSchema = z.object({
	name: z.string(),
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

export const MusicPostSchema = z.union([
	BaseMusicPostSchema.merge(
		z.object({
			type: z.literal(MusicPostMetadata.types.ALBUM),
			tracks: z.array(MusicAlbumTrackSchema)
		})
	),
	BaseMusicPostSchema.merge(z.object({ type: z.literal(MusicPostMetadata.types.TRACK) }))
]);

export type MusicPostSchema = z.infer<typeof MusicPostSchema>;
