// @ts-check
import { loadEnv } from "vite";
import { defineConfig } from 'astro/config';

import tailwind from "@astrojs/tailwind";

import solidJs from "@astrojs/solid-js";

import vercel from "@astrojs/vercel/serverless";

import {
  PostDirective,
  remarkRegExpDirective,
  YoutubeEmbedDirective
} from "./src/libraries/plugins";

const { PORT, FLAGS } = loadEnv(process.env.NODE_ENV || "", process.cwd(), "");

export default defineConfig({
  output: "hybrid",
  devToolbar: { enabled: !!FLAGS?.includes("TOOLBAR"), },
  server: {
    port: PORT ? Number(PORT) : 3000,
  },

  integrations: [tailwind({ applyBaseStyles: true }), solidJs({})],

  image: {
    domains: ["https://i.scdn.co/image/"]
  },

  experimental: {
    contentLayer: true,
  },

  markdown: {
    rehypePlugins: [
      [
        remarkRegExpDirective,
        [YoutubeEmbedDirective, PostDirective]
      ],
    ],
  },

  adapter: vercel(),
});
