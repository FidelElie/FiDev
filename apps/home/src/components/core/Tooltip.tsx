import type { JSX } from "solid-js";
import { twMerge } from "tailwind-merge";
import { Tooltip as KolbalteTooltip, type TooltipRootProps } from "@kobalte/core/tooltip";

export const Tooltip = (props: TooltipProps) => {
	return (
		<KolbalteTooltip placement={props.placement} flip={props.flip}>
			<KolbalteTooltip.Trigger class={props.triggerClass} as={props.triggerAs}>
				{props.trigger}
			</KolbalteTooltip.Trigger>
			<KolbalteTooltip.Portal>
				<KolbalteTooltip.Content
					as={props.contentAs}
					class={twMerge("bg-white border border-slate-200 rounded-lg", props.contentClass)}
				>
					{props.children}
					<KolbalteTooltip.Arrow />
				</KolbalteTooltip.Content>
			</KolbalteTooltip.Portal>
		</KolbalteTooltip>
	)
}

export type TooltipProps = {
	placement?: TooltipRootProps["placement"];
	flip?: TooltipRootProps["flip"];
	trigger?: JSX.Element;
	triggerClass?: string;
	contentClass?: string;
	children: JSX.Element;
	triggerAs?: keyof JSX.HTMLElementTags;
	contentAs?: keyof JSX.HTMLElementTags;
}
