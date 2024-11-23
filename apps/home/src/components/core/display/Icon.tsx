import { splitProps, type JSX } from "solid-js";

import { ICONS_SPRITES } from "@/components/core/display/Icon.data";

export const Icon = (props: IconProps) => {
	const [capturedProps, svgProps] = splitProps(props, ["name"]);

	if (!ICONS_SPRITES.includes(capturedProps.name)) {
		throw new Error(
			`Unsupported sprite - got ${capturedProps.name}\n Supported sprites: ${ICONS_SPRITES.join("\n")}`
		);
	}

	return (
		<svg width="1em" height="1em" fill="currentColor" {...svgProps}>
			<use href={`#icon-sprite-${capturedProps.name}`} />
		</svg>
	)
}

export type IconProps = Omit<JSX.SvgSVGAttributes<SVGSVGElement>, "name"> & {
	name: typeof ICONS_SPRITES[number];
}

