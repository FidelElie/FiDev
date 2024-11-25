import type { JSX } from "solid-js";
import { twMerge } from "tailwind-merge";
import type { VariantProps } from "class-variance-authority";

import { ButtonConfig } from "@/components/core/inputs/Button.config";
import { LinkConfig } from "@/components/core/navigation/Link.config";

const LinkConfigMap = {
	button: ButtonConfig,
	link: LinkConfig,
};

const BaseLink = (props: LinkProps) => {
	const config = LinkConfigMap[props.nature || "link"];

	return (
		<a
			{...props}
			class={twMerge(
				config({ intent: props.intent || "primary" }),
				props.class,
			)}
		>
			{props.children}
		</a>
	);
};

export const Link = Object.assign(BaseLink, {
	Button: (props: Omit<LinkProps, "nature">) => (
		<BaseLink {...props} nature="button" />
	),
});

export type LinkProps = JSX.AnchorHTMLAttributes<HTMLAnchorElement> &
	(
		| ({ nature?: "button" } & VariantProps<typeof ButtonConfig>)
		| ({ nature?: "link" } & VariantProps<typeof LinkConfig>)
	);
