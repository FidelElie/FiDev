import type { JSX } from "solid-js";
import { Popover as KobaltePopover, type PopoverRootProps } from "@kobalte/core/popover";
import { twMerge } from "tailwind-merge";

export const Popover = (props: PopoverProps) => {
	return (
		<KobaltePopover placement={props.placement}>
			<KobaltePopover.Trigger
				class={props.triggerClass}
				as={props.triggerAs}
			>
				{props.trigger}
			</KobaltePopover.Trigger>
			<KobaltePopover.Portal>
				<KobaltePopover.Content
					as={props.contentAs}
					class={twMerge("bg-white border border-slate-200 rounded-lg", props.contentClass)}
				>
					{props.children}
					<KobaltePopover.Arrow/>
				</KobaltePopover.Content>
			</KobaltePopover.Portal>
		</KobaltePopover>
	)
}

type PopoverProps = {
	placement?: PopoverRootProps["placement"];
	flip?: PopoverRootProps["flip"];
	trigger: JSX.Element;
	triggerClass?: string;
	triggerAs?: keyof JSX.HTMLElementTags;
	contentAs?: keyof JSX.HTMLElementTags;
	contentClass?: string;
	children: JSX.Element;
}
