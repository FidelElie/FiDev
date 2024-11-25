import type { JSX } from "solid-js";
import { twMerge } from "tailwind-merge";
import type { VariantProps } from "class-variance-authority";

import { ButtonConfig } from "@/components/core/inputs/Button.config";
import { LinkConfig } from "@/components/core/navigation/Link.config";

const ButtonConfigMap = {
	button: ButtonConfig,
	link: LinkConfig,
};

const BaseButton = (props: ButtonProps) => {
	const config = ButtonConfigMap[props.nature || "button"];

	return (
		<button
			{...props}
			class={twMerge(
				config({ intent: props.intent || "primary" }),
				props.class,
			)}
		>
			{props.children}
		</button>
	);
};

export const Button = Object.assign(BaseButton, {
	Link: (props: Omit<ButtonProps, "nature">) => (
		<BaseButton {...props} nature="link" />
	),
});

export type ButtonProps = JSX.ButtonHTMLAttributes<HTMLButtonElement> &
	(
		| ({ nature?: "button" } & VariantProps<typeof ButtonConfig>)
		| ({ nature?: "link" } & VariantProps<typeof LinkConfig>)
	);
