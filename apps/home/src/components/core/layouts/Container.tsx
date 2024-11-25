import { Dynamic } from "solid-js/web";
import type { JSX, ValidComponent } from "solid-js";

import { twMerge } from "tailwind-merge";

export const Container = (props: ContainerProps) => {
	return (
		<Dynamic
			id={props.id}
			class={twMerge("container max-w-4xl mx-auto px-5 lg:px-0", props.class)}
			component={props.as || "div"}
		>
			{props.children}
		</Dynamic>
	);
};

export type ContainerProps = {
	id?: string;
	class?: string;
	as?: ValidComponent;
	children: JSX.Element;
};
