import { createRegExpDirective } from "../remarkRegExpDirective";

import { request } from "../../clients/request.client";

export const YoutubeEmbedDirective = createRegExpDirective({
	identifier: /:youtube\[(.*?)\]/g,
	onMatch: (match) => {
		return { id: match[1] };
	},
	getHTML: async (result) => {
		try {
			const url = `https://youtube.com/watch?v=${result.id}`;

			const response = await request<YoutubeOEmbedResult>({
				url: `https://www.youtube.com/oembed?format=json&url=${url}`,
			});

			return `
					<iframe
						title="${response.title}"
						src="https://www.youtube.com/embed/${result.id}"
						class="aspect-video w-full"
						allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
						referrerpolicy="strict-origin-when-cross-origin"
						allowfullscreen
					/>
				`;
		} catch (error) {
			console.error(error);
			return process.env.NODE === "development"
				? "[Error Loading Youtube Embed]"
				: "";
		}
	},
});

type YoutubeOEmbedResult = {
	title: string;
	author_name: string;
	author_url: string;
	type: string;
	height: number;
	width: number;
	version: string;
	provider_name: string;
	provider_url: string;
	thumbnail_height: number;
	thumbnail_width: number;
	thumbnail_url: string;
	html: string;
};
