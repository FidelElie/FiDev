import path from "path";

import { z } from "zod";

import {
	getEntriesFromFilePaths,
	getPostsPathsFromRootDir,
} from "@fi.dev/content";

import { createRegExpDirective } from "../remarkRegExpDirective";
import { MusicPostSchema } from "../../schemas";
import { MusicPostMetadata } from "../../constants";

const metadata: { entries: MusicPostSchema[] | null } = { entries: null };

const getPostsEntries = () => {
	const filePath = path.join(process.cwd(), "src/content/music");

	const currentPaths = getPostsPathsFromRootDir(filePath);

	/** This only accounts for if the total number of posts have changed not the metadata itself */
	if (metadata.entries && currentPaths.length === metadata.entries.length) {
		return metadata.entries;
	}

	const postMetaData = getEntriesFromFilePaths(
		getPostsPathsFromRootDir(filePath),
	);

	const validatedMetadata = z.array(MusicPostSchema).parse(postMetaData);

	metadata.entries = validatedMetadata;

	return validatedMetadata;
};

const fetchCorrespondingPostBySpotifyId = (spotifyId: string) => {
	const entries = getPostsEntries();

	const post = entries.find((entry) => entry.spotifyId === spotifyId);

	return post || null;
};

const fetchCorrespondingAlbumPost = (spotifyId: string) => {
	const entries = getPostsEntries();

	const post = entries.find(
		(entry) =>
			entry.type === MusicPostMetadata.types.ALBUM &&
			entry.tracks.some((track) => track.spotifyId === spotifyId),
	);

	return post || null;
};

const constructPopulatedLinkText = (config: {
	text: string;
	post: MusicPostSchema;
	showArtist: boolean;
	showAlbum: boolean;
}) => {
	const { text, post, showArtist, showAlbum } = config;
	const [firstArtist] = post.artists;

	const showAlbumInfo = showAlbum || showArtist;

	return [
		text,
		showAlbumInfo ? `on the album ${post.name}` : [],
		showArtist ? `(${firstArtist.name})` : [],
	]
		.flat()
		.join(" ");
};

const FallbackLink = (props: { href: string; text: string }) => {
	return `
			<a
				href="${props.href}"
				class="inline-flex items-center flex-wrap px-0.5 h-1 not-prose underline-offset-2"
			>
				<svg width="1em" height="1em" class="text-blue-500 text-xl relative mr-1 top-1.5" mr-2 fill="currentColor">
					<use href="#icon-sprite-spotify">
				</svg>
				<span
					class="relative top-1 underline decoration-blue-500 underline-offset-2 font-heading font-normal"
				>
					${props.text}
				</span>
			</a>
		`;
};

const PostEntry = (props: { post: MusicPostSchema }) => {
	const { slug, name, artists, covers } = props.post;

	const [artist] = artists;
	const [cover] = covers.toSorted(
		(coverA, coverB) => coverA.width - coverB.width,
	);

	return `
			<a
				href="/music/${slug}"
				class="inline-flex items-center not-prose px-0.5 h-1"
			>
				<img
					src="${cover.url}"
					class="relative mr-1.5 top-1.5 w-7 h-7 rounded-sm"
					style="view-transition-name:${slug};"
				/>
				<span
					class="relative top-2 underline decoration-blue-500 underline-offset-2 font-heading"
				>
					${artist.name} - ${name}
				</span>
			</a>
		`;
};

/**
 * Directive for creating a music alum post link
 */
export const AlbumDirective = createRegExpDirective({
	identifier: /:album\[(.*?)\]\[(.*?)\]/g,
	onMatch: (match) => {
		const [id, text] = match.slice(1);

		return { id, text };
	},
	getHTML: (result) => {
		const { id, text } = result;

		const post = fetchCorrespondingPostBySpotifyId(id);

		if (!post?.slug) {
			return FallbackLink({ href: `spotify:album:${id}`, text });
		}

		return PostEntry({ post });
	},
});

/**
 * Directive for creating a music track post link
 */
export const TrackDirective = createRegExpDirective({
	identifier: /:track\[(.*?)\]\[(.*?)\](?:\[(.*?)\])?/gs,
	onMatch: (match) => {
		const [id, text, modifiers] = match.slice(1);

		return { id, text, modifiers };
	},
	getHTML: (result) => {
		const { id, text, modifiers = "" } = result;

		const post = fetchCorrespondingPostBySpotifyId(id);

		if (!post?.slug) {
			const constructedLink = `spotify:track:${id}`;
			const correspondingAlbumPost = fetchCorrespondingAlbumPost(id);

			if (!correspondingAlbumPost) {
				return FallbackLink({ href: constructedLink, text });
			}

			const linkText = constructPopulatedLinkText({
				text,
				post: correspondingAlbumPost,
				showAlbum: !!modifiers?.includes("album"),
				showArtist: !!modifiers?.includes("artist"),
			});

			return FallbackLink({ href: constructedLink, text: linkText });
		}

		return PostEntry({ post });
	},
});

/** Generic Directive for creating music post links - must specify post type */
export const MusicDirective = createRegExpDirective({
	identifier: /:music\[(.*?)\]\[(.*?)\]\[(.*?)\](?:\[(.*?)\])?/gs,
	onMatch: (match) => {
		const [id, type, text, modifiers] = match.slice(1);

		return { id, type: type?.toLowerCase(), text, modifiers };
	},
	getHTML: (result) => {
		const { id, type, text, modifiers } = result;

		const post = fetchCorrespondingPostBySpotifyId(id);

		if (!post?.slug) {
			const constructedLink = `spotify:${type}:${id}`;

			if (type === "track") {
				const correspondingAlbumPost = fetchCorrespondingAlbumPost(id);

				if (!correspondingAlbumPost) {
					return FallbackLink({ href: constructedLink, text });
				}

				const linkText = constructPopulatedLinkText({
					text,
					post: correspondingAlbumPost,
					showAlbum: !!modifiers?.includes("album"),
					showArtist: !!modifiers?.includes("artist"),
				});

				return FallbackLink({ href: constructedLink, text: linkText });
			}

			return FallbackLink({ href: constructedLink, text });
		}

		return PostEntry({ post });
	},
});

const LyricQuote = (props: {
	quote: string[];
	text: string;
	id?: string;
	artist?: string;
	remark?: string;
}) => {
	const { quote, text, id, remark, artist } = props;

	return `
			<div class="not-prose">
				<div class="lyrics">
					<blockquote>
						${quote.map((line, lineIndex, lines) => `${line[0].toUpperCase() + line.slice(1)}${lineIndex !== lines.length - 1 ? "<br/>" : ""}`).join("")}
					</blockquote>
					<div class="flex flex-col">
						<hr class="border-t border-slate-200 mt-2 mb-1.5"/>
						<span>
							From ${id ? TrackDirective.getHTML({ id, text, modifiers: "album" }) : text}${artist ? ` by ${artist}` : ""}
						</span>
						${remark ? `<span class="text-sm font-light mt-2 ml-2">${remark}</span>` : ""}
					</div>
				</div>
			</div>
		`;
};

export const LyricsDirective = createRegExpDirective({
	identifier: /:lyrics\[(.*?)\]\[(.*?)\](?:\[(.*?)\])?/gs,
	onMatch: (match) => {
		const [quote, link, subtitle] = match.slice(1);

		return { quote, link, subtitle };
	},
	getHTML: (result) => {
		const { quote, link, subtitle } = result;

		const splitQuote = quote
			.replace("\\n", "\n")
			.trim()
			.split("\n")
			.filter(Boolean);

		const [text, id, artist] = link
			.replace("\\n", "")
			.replace("\n", "")
			.trim()
			.split(":");

		return LyricQuote({
			quote: splitQuote,
			text,
			id,
			artist,
			...(subtitle ? { remark: subtitle } : {}),
		});
	},
});
