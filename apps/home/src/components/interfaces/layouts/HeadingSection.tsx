import { Show } from "solid-js";

export const HeadingSection = (props: HeadingSectionProps) => {
	return (
		<div class="flex flex-col justify-between gap-2">
			<div class="flex flex-col space-y-1">
				<h1 class="font-heading text-5xl tracking-tighter">{props.title.toString()}</h1>
				<Show when={props.subtitle}>
					<h2 class="text-lg font-light font-heading tracking-tight text-blue-500">
						{props.subtitle}
					</h2>
				</Show>
			</div>
		</div>
	)
}

export type HeadingSectionProps = {
	title: string;
	subtitle?: string;
}
