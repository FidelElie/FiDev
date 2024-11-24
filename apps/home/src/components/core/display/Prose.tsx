import { Dynamic } from "solid-js/web";
import type { JSX, ValidComponent } from "solid-js";

import { twMerge } from "tailwind-merge";

export const Prose = (props: ProseProps) => {
	return (
		<Dynamic
			class={twMerge(
				"prose max-w-full",
				"prose-headings:font-heading",
				"prose-h2:text-2xl md:prose-h2:text-3xl prose-h2:font-normal",
				"prose-h3:font-light prose-h3:text-blue-500",
				"prose-a:decoration-blue-500 prose-a:underline-offset-2",
				props.class
			)}
			component={props.as || "article"}
		>
			{props.children}
		</Dynamic>
	)
}

export type ProseProps = {
	as?: ValidComponent;
	class?: string;
	children: JSX.Element;
}
