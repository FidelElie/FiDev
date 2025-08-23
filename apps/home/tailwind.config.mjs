import { default as TailwindKolbaltePlugin } from "@kobalte/tailwindcss";
import { default as TailwindAnimatePlugin } from "tailwindcss-animate";

import { default as TailwindCSSFormsPlugin } from "@tailwindcss/forms";
import { default as TailwindCSSTypographyPlugin } from "@tailwindcss/typography";

/** @type {import('tailwindcss').Config} */
export default {
	content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
	theme: {
		extend: {
			textDecorationThickness: {
				1.5: "1.5px",
			},
			fontFamily: {
				heading: ["Space Grotesk Variable", "sans-serif"],
				copy: ["Nunito Variable", "sans-serif"],
			},
		},
	},
	plugins: [
		TailwindCSSFormsPlugin,
		TailwindCSSTypographyPlugin,
		TailwindKolbaltePlugin,
		TailwindAnimatePlugin,
		function({ addVariant }) {
			addVariant("astro", "& > astro-island, & > astro-slot");
		},
	],
};
