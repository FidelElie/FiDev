import { Show, type JSX } from "solid-js"

export const Passthrough = (props: PassthroughProps) => {
	return (
		<Show when={!props.disabled} fallback={props.children}>
			{props.layout(props.children)}
		</Show>
	)
}

export type PassthroughProps = {
	layout: (children: JSX.Element) => JSX.Element;
	children: JSX.Element;
	disabled?: boolean;
}
