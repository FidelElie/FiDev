import { loadEnv } from "vite";
import { defineConfig } from "astro/config";

import tailwind from "@astrojs/tailwind";

import solidJs from "@astrojs/solid-js";

import sitemap from "@astrojs/sitemap";

import vercel from "@astrojs/vercel";

import { rehypePlugins } from "./src/libraries/plugins";

import compressor from "astro-compressor";

const { PORT, FLAGS, SITE } = loadEnv(
	process.env.NODE_ENV || "",
	process.cwd(),
	"",
);

export default defineConfig({
	site: SITE || "https://fidelelie.com",
	output: "static",
	devToolbar: { enabled: !!FLAGS?.includes("TOOLBAR") },
	server: {
		port: PORT ? Number(PORT) : 3000,
	},

	integrations: [
		tailwind({ applyBaseStyles: true }),
		solidJs({ devtools: !!FLAGS?.includes("DEVTOOLS") }),
		sitemap(),
		compressor(),
	],

	image: {
		domains: ["https://i.scdn.co/image/"],
	},

	markdown: {
		rehypePlugins,
	},

	adapter: vercel(),
});
