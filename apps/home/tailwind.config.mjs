import { default as FiTheme } from "@fi.dev/theme";

import { default as TailwindKolabaltePlugin } from "@kobalte/tailwindcss";


/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			textDecorationThickness: {
				"1.5": "1.5px"
			}
		},
	},
	presets: [
		FiTheme
	],
	plugins: [
		TailwindKolabaltePlugin,
		function ({ addVariant }) {
			addVariant("astro", "& > astro-island, & > astro-slot");
		}
	],
}
