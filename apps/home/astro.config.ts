import { loadEnv } from "vite";
import { defineConfig } from "astro/config";

import tailwind from "@astrojs/tailwind";

import solidJs from "@astrojs/solid-js";

import sitemap from "@astrojs/sitemap";

import vercel from "@astrojs/vercel/serverless";

import {
    AlbumDirective,
    FutureCommentDirective,
    ImageDirective,
    LinkDirective,
    LyricsDirective,
    MusicDirective,
    remarkRegExpDirective,
    TrackDirective,
    VideoDirective,
    YoutubeEmbedDirective,
} from "./src/libraries/plugins";

const { PORT, FLAGS, SITE } = loadEnv(process.env.NODE_ENV || "", process.cwd(), "");

export default defineConfig({
    site: SITE || "https://fidelelie.com",
    output: "hybrid",
    devToolbar: { enabled: !!FLAGS?.includes("TOOLBAR") },
    server: {
        port: PORT ? Number(PORT) : 3000,
    },

    integrations: [
      tailwind({ applyBaseStyles: true }),
      solidJs({ devtools: !!FLAGS?.includes("DEVTOOLS") }),
      sitemap(),
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
                [
                    YoutubeEmbedDirective,
                    MusicDirective,
                    AlbumDirective,
                    TrackDirective,
                    LyricsDirective,
                    VideoDirective,
                    ImageDirective,
                    LinkDirective,
                    FutureCommentDirective,
                ],
            ],
        ],
    },

    adapter: vercel(),
});
