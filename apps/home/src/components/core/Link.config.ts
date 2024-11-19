import { cva } from "class-variance-authority";

export const LinkConfig = cva(
	["underline underline-offset-4 decoration-1.5 transition transition-500"],
	{
		variants: {
			intent: {
				primary: "decoration-blue-500 hover:text-blue-500",
				secondary: "decoration-slate-200 hover:text-slate-200",
			},
		},
	},
);
