import { Show } from "solid-js";

import type { MusicPostSchema } from "@/libraries/schemas"

import { Icon, Link, Popover, type IconProps } from "@/components/core"
import { AppManifest } from "@/configs";

export const MusicLinksPane = (props: MusicLinksPaneProps) => {
	const [firstArtist] = props.post.artists;

	const generateSpotifyLinks = () => {
		return {
			...(firstArtist ? {
				artistLink: AppManifest.links.external["spotify:directive"]("artist", firstArtist.spotifyId)
			} : {}),
			musicLink: AppManifest.links.external["spotify:directive"](
				props.post.type === "ALBUM" ? "album" : "track",
				props.post.spotifyId
			)
		}
	}

	const generateAppleLinks = () => {
		return {
			...(firstArtist ? {
				artistLink: AppManifest.links.external["apple-music:search"](firstArtist.name)
			} : {}),
			musicLink: AppManifest.links.external["apple-music:search"](
				`${firstArtist.name || ""} - ${props.post.name}`.trim()
			)
		}
	}

	const generateSoundCloudLinks = () => {
		return {
			...(firstArtist ? {
				artistLink: AppManifest.links.external["soundcloud:search"](firstArtist.name)
			} : {}),
			musicLink: AppManifest.links.external["soundcloud:search"](
				`${firstArtist.name || ""} - ${props.post.name}`.trim()
			)
		}
	}

	return (
		<div class="flex justify-end gap-1 md:flex-col-reverse">
			<MusicLinkDropdown
				icon="apple-logo"
				text="Apple Music"
				{...generateAppleLinks()}
				blank
			/>
			<MusicLinkDropdown
				icon="soundcloud"
				text="SoundCloud"
				{...generateSoundCloudLinks()}
				blank
			/>
			<MusicLinkDropdown
				icon="spotify"
				text="Spotify"
				{...generateSpotifyLinks()}
			/>
		</div>
	)
}

const MusicLinkDropdown = (props: MusicLinkDropdownProps) => {
	return (
		<Popover
			placement="bottom-end"
			trigger={
				<div class="flex items-center gap-1 text-sm">
					<Icon
						name={props.icon}
						class="text-xl text-blue-500"
						aria-label="Spotify-links"
					/>
					{props.text}
				</div>
			}
			contentClass="flex flex-col"
			triggerClass="border border-slate-200 rounded-lg py-1 px-2"
		>
			<Show when={props.artistLink}>
				{(artistLink) => (
					<Link
						href={artistLink()}
						class="no-underline py-2 px-3 flex items-center gap-1"
						{...(props.blank ? { target: "_blank" } : {})}
					>
						<Icon name="user" class="text-blue-500" />
						Go to artist
					</Link>
				)}
			</Show>
			<Link
				href={props.musicLink}
				class="no-underline py-2 px-3 flex items-center gap-1"
				{...(props.blank ? { target: "_blank" } : {})}
			>
				<Icon name="music-quaver" class="text-blue-500" />
				Go to music
			</Link>
		</Popover>
	)
}

type MusicLinkDropdownProps = {
	icon: IconProps["name"];
	text: string;
	artistLink?: string;
	musicLink?: string;
	blank?: boolean;
}

export type MusicLinksPaneProps = {
	post: MusicPostSchema;
}
