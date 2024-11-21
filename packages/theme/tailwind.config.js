import { default as TailwindCSSFormsPlugin } from "@tailwindcss/forms";
import { default as TailwindCSSTypographyPlugin } from "@tailwindcss/typography";

/** @type {import('tailwindcss').Config} */
export default {
	darkMode: "class",
	theme: {
		extend: {
			fontFamily: {
				heading: ["Space Grotesk Variable", "sans-serif"],
				copy: ["Nunito Variable", "sans-serif"],
			},
		},
	},
	plugins: [TailwindCSSFormsPlugin, TailwindCSSTypographyPlugin],
};
