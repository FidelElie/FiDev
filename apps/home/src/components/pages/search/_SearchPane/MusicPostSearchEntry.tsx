import { Image } from "@unpic/solid";

import { AppManifest } from "@/configs";

import type { SearchWebsiteRoute } from "@/libraries/api";
import type { InferDTOS } from "@/libraries/types";

import { MusicPostRatingTag } from "@/components/interfaces";

export const MusicPostSearchEntry = (props: MusicPostSearchEntryProps) => {
	const [firstArtist] = props.post.artists

	return (
		<a
			href={AppManifest.links.pages["/music/:slug"](props.post.slug!)}
			class="flex items-center gap-5 w-full max-w-full group"
		>
			<div class="w-36 h-36 flex-shrink-0">
				<Image
					src={props.post?.covers[0].url}
					class="aspect-square rounded-lg border border-slate-200 transition-all"
					alt={props.post?.name}
					layout="fullWidth"
					loading="lazy"
					{...{ style: { "view-transition-name": props.post?.slug } }}
				/>
			</div>
			<div class="flex flex-col space-y-2">
				<h2 class="font-heading text-xl transition-all group-hover:text-blue-500">
					{firstArtist.name} - {props.post.name}
				</h2>
				<MusicPostRatingTag rating={props.post.rating}/>
				<p class="line-clamp-1">
					{props.post.preview}...
				</p>
			</div>
		</a>
	)
}

export type MusicPostSearchEntryProps = {
	post: InferDTOS<typeof SearchWebsiteRoute["responses"]>[200]["music"][number];
}
