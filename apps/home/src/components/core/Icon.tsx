import type { JSX } from "solid-js";

import { ICONS_SPRITES } from "@/components/core/Icon.data";

export const Icon = (props: IconProps) => {
	if (!ICONS_SPRITES.includes(props.name)) {
		throw new Error(
			`Unsupported sprite - got ${props.name}\n Supported sprites: ${ICONS_SPRITES.join("\n")}`
		);
	}

	return (
		<svg width="1em" height="1em" fill="currentColor" {...props}>
			<use href={`/sprites.svg#${props.name}`} />
		</svg>
	)
}

export type IconProps = JSX.SvgSVGAttributes<SVGSVGElement> & {
	name: typeof ICONS_SPRITES[number];
}

