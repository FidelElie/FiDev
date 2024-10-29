import { default as FiTheme } from "@fi.dev/theme";

/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
		},
	},
	presets: [
		FiTheme
	],
	plugins: [],
}
