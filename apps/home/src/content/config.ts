import { defineCollection, getCollection } from "astro:content";

import { distributeToBuckets, sanitiseToURLSlug } from "@fi.dev/typescript";

import { MusicArtistSchema, MusicPostSchema } from "@/libraries/schemas";

import { getSpotifyEnv } from "@/libraries/utilities";
import { createSpotifyClient } from "@/libraries/clients";
import type { SpotifyArtistObject } from "@/libraries/types";

const music = defineCollection({
	type: "content",
	schema: MusicPostSchema
});

const artists = defineCollection({
	type: "content_layer",
	loader: async () => {
		console.log("Fetching spotify artist metadata");
		const musicPosts = await getCollection("music");

		const spotifyClient = createSpotifyClient(getSpotifyEnv());

		await spotifyClient.refreshAccessToken();

		const flattenedMusicArtists = musicPosts.map(post => post.data.artists).flat();

		const uniqueArtists = Array.from(
			new Map(flattenedMusicArtists.map(entry => [entry.spotifyId, entry])).values()
		);

		let artists: SpotifyArtistObject[] = [];

		const spotifyArtistIdBuckets = distributeToBuckets(
			uniqueArtists.map(artist => artist.spotifyId), 10
		);

		for (const [bucketIndex, bucketIds] of spotifyArtistIdBuckets.entries()) {
			console.log(`Fetching artist bucket ${bucketIndex + 1} of ${spotifyArtistIdBuckets.length}`);

			const spotifyArtists = await spotifyClient.getArtists({ ids: bucketIds });

			artists.push(...spotifyArtists);
		}

		return artists.map(artist => {
			const artistSlug = sanitiseToURLSlug(artist.name);

			return {
				id: artist.id,
				slug: artistSlug,
				spotifyId: artist.id,
				spotifyUrl: artist.external_urls.spotify,
				name: artist.name,
				covers: artist.images,
				genres: artist.genres
			} satisfies MusicArtistSchema
		})
	},
	schema: MusicArtistSchema
})

export const collections = {
	music,
	artists
};
