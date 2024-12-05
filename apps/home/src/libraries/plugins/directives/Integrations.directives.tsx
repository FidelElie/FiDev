import { createRegExpDirective } from "../remarkRegExpDirective";

import { request } from "../../clients/request.client";

export const YoutubeEmbedDirective = createRegExpDirective({
	identifier: /:youtube\[(.*?)\](?:\[(.*?)\])?/gs,
	onMatch: (match) => {
		const [id, caption] = match.slice(1);

		return { id, caption };
	},
	getHTML: async (result) => {
		try {
			const { id, caption } = result;

			const url = `https://youtube.com/watch?v=${id}`;

			const response = await request<YoutubeOEmbedResult>({
				url: `https://www.youtube.com/oembed?format=json&url=${url}`,
			});

			return `
					<figure>
						<iframe
							title="${response.title}"
							src="https://www.youtube.com/embed/${id}"
							class="aspect-video w-full"
							allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
							referrerpolicy="strict-origin-when-cross-origin"
							allowfullscreen
						>
						</iframe>
						${
							!!caption ?
								`
									<hr class="border-slate-200 w-full border-t mt-5 mb-2"/>
									<figcaption class="font-heading">- ${caption}</figcaption>
								`
							 : ""
						}
					</figure>
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
