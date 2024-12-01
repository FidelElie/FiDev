import { Image } from "@unpic/solid";

import { AppManifest } from "@/configs";

import type { SearchWebsiteRoute } from "@/libraries/api";
import type { InferDTOS } from "@/libraries/types";

export const MusicArtistSearchEntry = (props: MusicArtistSearchEntryProps) => {
	return (
		<a
			href={AppManifest.links.pages["/music/artists/:slug"](props.artist.slug)}
			class="flex flex-col space-y-2 w-full group"
		>
			<Image
				src={props.artist?.covers[0].url}
				class="aspect-square rounded-full border border-slate-200 transition-all"
				alt={props.artist?.name}
				layout="fullWidth"
				loading="lazy"
				{...{ style: { "view-transition-name": props.artist?.slug } }}
			/>
			<div class="space-y-1">
				<h2 class="font-heading text-lg transition-all group-hover:text-blue-500">
					{props.artist.name}
				</h2>
				<p class="text-sm">{props.artist.genres.join(", ")}</p>
			</div>
		</a>
	);
};

export type MusicArtistSearchEntryProps = {
	artist: InferDTOS<
		(typeof SearchWebsiteRoute)["responses"]
	>[200]["artists"][number];
};
