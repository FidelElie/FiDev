import { Dynamic } from "solid-js/web";
import type { ValidComponent } from "solid-js";
import type { JSX } from "solid-js/jsx-runtime";

import { twMerge } from "tailwind-merge";

export const Container = (props: ContainerProps) => {

	return (
		<Dynamic
			class={twMerge("container max-w-4xl mx-auto px-5 lg:px-0", props.class)}
			component={props.as || "div"}
		>
			{ props.children }
		</Dynamic>
	)
}

export type ContainerProps = {
	class?: string;
	as?: ValidComponent;
	children: JSX.Element;
}
