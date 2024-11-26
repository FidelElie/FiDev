import path from "path"

import { z } from "zod";

import { getEntriesFromFilePaths, getPostsPathsFromRootDir } from "@fi.dev/content";

import { createRegExpDirective } from "../remarkRegExpDirective";
import { MusicPostSchema } from "../../schemas";

const metadata: { entries: MusicPostSchema[] | null} = { entries: null }

const fetchCorrespondingPostBySpotifyId = (spotifyId: string) => {
	const entries = (() => {
		const filePath = path.join(process.cwd(), "src/content/music");

		const currentPaths = getPostsPathsFromRootDir(filePath);

		/** This only accounts for if the total number of posts have changed not the metadata itself */
		if (metadata.entries && currentPaths.length === metadata.entries.length) {
			return metadata.entries;
		}

		const postMetaData = getEntriesFromFilePaths(getPostsPathsFromRootDir(filePath));

		const validatedMetadata = z.array(MusicPostSchema).parse(postMetaData);

		metadata.entries = validatedMetadata;

		return validatedMetadata;
	})();

	const post = entries.find(entry => entry.spotifyId === spotifyId);

	return post || null;
}

const FallbackLink = (props: { href: string; text: string; }) => {
	return (
		`
			<a
				href="${props.href}"
				class="inline-flex items-center flex-wrap px-0.5 h-1 not-prose underline-offset-2"
			>
				<svg width="1em" height="1em" class="text-blue-500 text-xl relative mr-1 top-1.5" mr-2 fill="currentColor">
					<use href="#icon-sprite-spotify">
				</svg>
				<span
					class="text-sm relative top-1 underline decoration-blue-500 underline-offset-2 font-heading font-normal"
				>
					${props.text}
				</span>
			</a>
		`
	)
}

const PostEntry = (props: { post: MusicPostSchema }) => {
	const { slug, name, artists, covers } = props.post;

	const [artist] = artists;
	const [cover] = covers.toSorted(
		(coverA, coverB) => coverA.width - coverB.width
	);

	return (
		`
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
					class="relative top-2 text-sm underline decoration-blue-500 font-heading"
				>
					${artist.name} - ${name}
				</span>
			</a>
		`
	)
}

/**
 * Directive for creating a music alum post link
 */
export const AlbumDirective = createRegExpDirective({
	identifier: /:album\[(.*?)\]/g,
	onMatch: (match) => {
		const [id, text] = match[1].split(":");

		return { id, text }
	},
	getHTML: (result) => {
		const { id,  text } = result;

		const post = fetchCorrespondingPostBySpotifyId(id);

		if (!post?.slug) {
			return FallbackLink({ href: `spotify:album:${id}`, text });
		}

		return PostEntry({ post });
	}
});

/**
 * Directive for creating a music track post link
 */
export const TrackDirective = createRegExpDirective({
	identifier: /:track\[(.*?)\]/g,
	onMatch: (match) => {
		const [id, text] = match[1].split(":");

		return { id, text }
	},
	getHTML: (result) => {
		const { id,  text } = result;

		const post = fetchCorrespondingPostBySpotifyId(id);

		if (!post?.slug) {
			return FallbackLink({ href: `spotify:track:${id}`, text });
		}

		return PostEntry({ post });
	}
});

/** Generic Directive for creating music post links - must specify post type */
export const MusicDirective = createRegExpDirective({
	identifier: /:music\[(.*?)\]/g,
	onMatch: (match) => {
		const [id, type, text] = match[1].split(":");

		return { id, type: type?.toLowerCase(), text }
	},
	getHTML: (result) => {
		const { id, type, text } = result;

		const post = fetchCorrespondingPostBySpotifyId(id);

		if (!post?.slug) {
			const constructedSpotifyLink = `spotify:${type}:${id}`;

			return FallbackLink({ href: constructedSpotifyLink, text })
		}

		return PostEntry({ post });
	}
});

const LyricQuote = (props: {
	quote: string[]; text: string; id?: string; type?: string; remark?: string
}) => {
	const { quote, text, id, type, remark } = props;

	return (
		`
			<div class="not-prose">
				<div class="lyrics">
					<blockquote>
						${quote.map((line, lineIndex, lines) => (
							`${line}${lineIndex !== lines.length - 1 ? "<br/>" : ""}`
						)).join("")}
					</blockquote>
					<div class="flex flex-col">
						<hr class="border-t border-slate-200 mt-4 mb-1.5"/>
						<span>
							Taken from ${id && type ? MusicDirective.getHTML({ id, type, text }) : text}
						</span>
						${remark ? `<span class="text-sm font-light">${remark}</span>` : ""}
					</div>
				</div>
			</div>
		`
	)
}

export const LyricsDirective = createRegExpDirective({
	identifier: /:lyrics\[(.*?)\]/g,
	onMatch: (match) => {
		const [quote, identifiers, subtitle] = match[1].split(":");

		return { quote, identifiers, subtitle }
	},
	getHTML: (result) => {
		const { quote, identifiers, subtitle } = result;

		const splitQuote = quote.split("\\n");

		const [text, id, type] = identifiers.split("#");

		return LyricQuote({
			quote: splitQuote,
			text,
			id,
			type,
			...(subtitle ? { remark: subtitle } : {})
		});
	}
})


