import { loadEnv } from "vite";
import { defineConfig } from "astro/config";

import tailwind from "@astrojs/tailwind";

import solidJs from "@astrojs/solid-js";

import vercel from "@astrojs/vercel/serverless";

import {
	AlbumDirective,
	LyricsDirective,
	MusicDirective,
	remarkRegExpDirective,
	TrackDirective,
	YoutubeEmbedDirective,
} from "./src/libraries/plugins";

const { PORT, FLAGS } = loadEnv(process.env.NODE_ENV || "", process.cwd(), "");

export default defineConfig({
	output: "hybrid",
	devToolbar: { enabled: !!FLAGS?.includes("TOOLBAR") },
	server: {
		port: PORT ? Number(PORT) : 3000,
	},

	integrations: [
		tailwind({ applyBaseStyles: true }),
		solidJs({ devtools: !!FLAGS?.includes("DEVTOOLS") }),
	],

	image: {
		domains: ["https://i.scdn.co/image/"],
	},

	experimental: {
		contentLayer: true,
	},

	markdown: {
		rehypePlugins: [
			[
				remarkRegExpDirective,
				[YoutubeEmbedDirective, MusicDirective, AlbumDirective, TrackDirective, LyricsDirective]
			],
		],
	},

	adapter: vercel(),
});
