import { Show } from "solid-js";
import { Image } from "@unpic/solid";
import { twJoin } from "tailwind-merge";

import { ProjectPlaceholderPNG } from "@/assets";

import type { MusicPostSchema } from "@/libraries/schemas";

import { Passthrough } from "@/components/core";

export const MusicProjectLink = (props: MusicProjectLinkProps) => (
	<Passthrough
		layout={children => (
			<a
				href={`/music/${props.post?.slug}`}
				aria-label={`${props.post?.artists[0].name} - ${props.post?.name}`}
			>
				{children}
			</a>
		)}
		disabled={!props.post}
	>
		<span class="w-full aspect-square justify-self-center flex gap-2 flex-col">
			<Image
				src={props.defer ? ProjectPlaceholderPNG.src : props.post?.covers[0].url || ProjectPlaceholderPNG.src}
				class={twJoin(
					"w-full h-full object-cover rounded-lg border border-slate-200 transition-all",
					props.defer && "animate-pulse"
				)}
				alt={props.post?.name}
				layout="fullWidth"
				loading="lazy"
				{...{ style: { "view-transition-name": props.post?.slug } }}
			/>
			<Show when={props.info !== false}>
				<div class="space-y-1 relative h-5">
					<div class={twJoin("transition-all", props.defer ? "opacity-0" : "opacity-100")}>
						<p class="text-xs">{props.post?.artists[0].name}</p>
						<p class={"truncate font-heading"}>{props.post?.name}</p>
					</div>
					<div
						class={twJoin(
							"absolute top-0 w-full h-10 bg-slate-200 rounded transition-all",
							props.defer ? "opacity-100 animate-pulse" : "opacity-0"
						)}
						aria-busy={true}
					/>
				</div>
			</Show>
		</span>
	</Passthrough>
)

export type MusicProjectLinkProps = {
	post?: MusicPostSchema;
	defer?: boolean;
	info?: boolean;
}
