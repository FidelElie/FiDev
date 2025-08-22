import type { RehypePlugins } from "astro";

import { unified } from "unified";

import { default as rehypeStringify } from "rehype-stringify";
import { default as remarkParse } from "remark-parse";
import { default as remarkRehype } from "remark-rehype";

import {
	AlbumDirective,
	FutureCommentDirective,
	ImageDirective,
	LinkDirective,
	LyricsDirective,
	MusicDirective,
	QuoteDirective,
	TrackDirective,
	VideoDirective,
	YoutubeEmbedDirective,
} from "./directives";
import { remarkRegExpDirective } from "./remarkRegExpDirective";

export const rehypePlugins = [
	[
		remarkRegExpDirective,
		[
			YoutubeEmbedDirective,
			MusicDirective,
			AlbumDirective,
			TrackDirective,
			LyricsDirective,
			VideoDirective,
			ImageDirective,
			LinkDirective,
			FutureCommentDirective,
			QuoteDirective,
		],
	],
] satisfies RehypePlugins;

export const compileOutputWithPlugins = async (input: string) => {
	return unified()
		.use(remarkParse)
		.use(remarkRehype)
		.use(rehypePlugins)
		.use(rehypeStringify)
		.process(input);
};
