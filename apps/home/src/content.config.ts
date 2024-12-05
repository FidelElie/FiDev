import { z } from "zod";
import path from "path";
import { glob } from "astro/loaders";
import { defineCollection  } from "astro:content";

import { sanitiseToURLSlug } from "@fi.dev/typescript";

import { MusicArtistSchema, MusicPostSchema } from "@/libraries/schemas";

import { getSpotifyEnv } from "@/libraries/utilities";
import { createSpotifyClient } from "@/libraries/clients";
import { getEntriesFromFilePaths, getPostsPathsFromRootDir } from "@fi.dev/content";

const music = defineCollection({
	loader: glob({
		pattern: '**/*.md',
		base: "src/content/music",
	}),
	schema: MusicPostSchema,
});

const artists = defineCollection({
	loader: async () => {
		console.log("Fetching spotify artist metadata");

		const musicPosts = getEntriesFromFilePaths(
			getPostsPathsFromRootDir(path.join(process.cwd(), "src/content/music")),
		);

		const validatedPosts = z.array(MusicPostSchema).parse(musicPosts)

		console.log("Creating Spotify Client");
		const spotifyClient = createSpotifyClient(getSpotifyEnv());

		await spotifyClient.refreshAccessToken();

		const flattenedMusicArtists = validatedPosts
			.map((post) => post.artists)
			.flat();

		const uniqueArtists = Array.from(
			new Map(
				flattenedMusicArtists.map((entry) => [entry.spotifyId, entry]),
			).values(),
		);

		const artists = await spotifyClient.getArtists({
			ids: uniqueArtists.map((artist) => artist.spotifyId),
		});

		console.log(`Artists to sync: ${artists.length}`);

		return artists.map((artist) => {
			const artistSlug = sanitiseToURLSlug(artist.name);

			return {
				id: artist.id,
				slug: artistSlug,
				spotifyId: artist.id,
				spotifyUrl: artist.external_urls.spotify,
				name: artist.name,
				covers: artist.images,
				genres: artist.genres,
			} satisfies MusicArtistSchema;
		});
	},
	schema: MusicArtistSchema,
});

export const misc = defineCollection({
	loader: glob({
		pattern: "**/*.md",
		base: "src/content/misc"
	})
})

export const collections = {
	music,
	artists,
	misc
};
