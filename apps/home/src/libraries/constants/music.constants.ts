export const MusicPostMetadata = {
	ratings: {
		LEVEL_0: "LEVEL_0",
		LEVEL_1: "LEVEL_1",
		LEVEL_2: "LEVEL_2",
		LEVEL_3: "LEVEL_3",
		LEVEL_4: "LEVEL_4",
		LEVEL_5: "LEVEL_5",
		LEVEL_6: "LEVEL_6",
	},
	types: {
		ALBUM: "ALBUM",
		TRACK: "TRACK",
	},
} as const;

export const MusicPostRatingMap = {
	[MusicPostMetadata.ratings.LEVEL_0]: "Instant Classic",
	[MusicPostMetadata.ratings.LEVEL_1]: "Must Listen",
	[MusicPostMetadata.ratings.LEVEL_2]: "Worth It",
	[MusicPostMetadata.ratings.LEVEL_3]: "Solid",
	[MusicPostMetadata.ratings.LEVEL_4]: "Aight",
	[MusicPostMetadata.ratings.LEVEL_5]: "Meh",
	[MusicPostMetadata.ratings.LEVEL_6]: "Hot Garbage",
} as const;
