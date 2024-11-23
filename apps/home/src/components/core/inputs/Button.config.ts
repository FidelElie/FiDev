import { cva } from "class-variance-authority";

export const ButtonConfig = cva(
	[
		"px-3 py-2 rounded-lg border font-heading transition duration-500 ease-in-out",
		"focus:outline-none focus:ring-2 focus:ring-offset-2",
	],
	{
		variants: {
			intent: {
				primary: ["border-blue-500 focus:ring-blue-500"],
				secondary: ["border-slate-200 focus:ring-slate-200"],
			},
		},
	},
);
