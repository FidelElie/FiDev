import { Image } from "@unpic/solid";
import { twJoin } from "tailwind-merge";

import type { MusicArtistSchema } from "@/libraries/schemas";

import { Passthrough } from "@/components/core";
import { ProjectPlaceholderPNG } from "@/assets";

export const MusicArtistEntry = (props: MusicArtistEntryProps) => {
	return (
		<Passthrough
			layout={children => (
				<a
						href={`/music/artists/${props.artist?.slug}`}
						class="group flex flex-row items-center gap-3 rounded-lg"
					>
						{children}
					</a>
			)}
			disabled={!props.artist}
		>
			<div class="w-24 h-24 flex-shrink-0">
				{
					!!props.artist?.covers.length && (
						<Image
							src={props.defer ? ProjectPlaceholderPNG.src : props.artist?.covers[0].url}
							alt={`${props.artist?.name} cover`}
							class="rounded-lg aspect-square border border-slate-200"
							layout="fullWidth"
							loading="lazy"
							{...{ style: { "view-transition-name": props.artist?.slug } }}
						/>
					)
				}
			</div>
			<div class="flex flex-col gap-1 pr-2.5 truncate max-w-64 relative">
				<div class={twJoin("transition-all", props.defer ? "opacity-0" : "opacity-100")}>
					<h2 class="font-heading text-lg">{props.artist?.name}</h2>
					<p
						class="text-gray-500 font-light text-sm truncate"
						title={props.artist?.genres?.join(", ") || undefined}
					>
						{props.artist?.genres.length ? props.artist?.genres.join(", ") : "no genres listed"}
					</p>
				</div>
				<div
					class={twJoin(
						"absolute top-0 w-full h-10 bg-slate-200 rounded transition-all",
						props.defer ? "opacity-100 animate-pulse" : "opacity-0"
					)}
					aria-busy={true}
				/>
			</div>
		</Passthrough>
	)
}

export type MusicArtistEntryProps = {
	artist?: MusicArtistSchema;
	defer?: boolean;
}
