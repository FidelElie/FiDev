import { Dynamic } from "solid-js/web";
import type { ValidComponent } from "solid-js";
import type { JSX } from "solid-js/jsx-runtime";

import { twMerge } from "tailwind-merge";

export const Grid = (props: GridProps) => {
	return (
		<Dynamic
			class={twMerge(
				"grid grid-flow-row gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3",
				props.class,
			)}
			component={props.as || "div"}
		>
			{props.children}
		</Dynamic>
	);
};

export type GridProps = {
	class?: string;
	as?: ValidComponent;
	children: JSX.Element;
};
