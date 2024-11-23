import { Show } from "solid-js";

import type { MusicPostSchema } from "@/libraries/schemas";

import { Icon, Link, Popover } from "@/components/core";

export const SpotifyLinkDropdown = (props: SpotifyLinkDropdownProps) => {
	const [firstArtist] = props.post.artists;

	return (
		<Popover
			placement="bottom-end"
			trigger={
				<div class="flex items-center gap-1 text-sm">
					<Icon
						name="spotify"
						class="text-xl text-blue-500"
						aria-label="Spotify-links"
					/>
					Spotify
				</div>
			}
			contentClass="flex flex-col"
			triggerClass="border border-slate-200 rounded-lg py-1 px-2"
		>
			<Show when={firstArtist}>
				{
					artist => (
						<Link
							href={`spotify:artist:${artist().spotifyId}`}
							class="no-underline py-2 px-3 flex items-center gap-1"
						>
							<Icon name="user" class="text-blue-500"/>
							Go to artist
						</Link>
					)
				}
			</Show>
			<Link
				href={`spotify:${props.post.type === "ALBUM" ? "album" : "track"}:${props.post.spotifyId}`}
				class="no-underline py-2 px-3 flex items-center gap-1"
			>
				<Icon name="music-quaver" class="text-blue-500"/>
				Go to {props.post.type === "ALBUM" ? "album" : "track"}
			</Link>
		</Popover>
	)
}

export type SpotifyLinkDropdownProps = {
	post: MusicPostSchema;
}
