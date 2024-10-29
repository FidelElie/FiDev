import fs from "node:fs";
import path from "node:path";

import { matter } from "@fi.dev/content";

import { MusicPostSchema } from "../../../libraries/schemas";

import { createRegExpDirective } from "../remarkRegExpDirective";

export const PostDirective = createRegExpDirective({
	identifier: /:post\[(.*?)\]/g,
	onMatch: (match) => {
		const [path, fallback] = match[1].split(":");

		return { path, fallback }
	},
	getHTML: async (result) => {
		const filePath = path.join(process.cwd(), "src/content", `${result.path}.md`);

		if (!fs.existsSync(filePath)) {
			return result.fallback || "Post not found";
		}

		const postContent = matter.read(filePath);

		if (result.path.includes("music")) {
			const postData = MusicPostSchema.parse(postContent.data);

			const [firstArtist] = postData.artists;
			const [firstImage] = postData.covers;

			return (
				`
					<a
						href="/music/${postData.slug}"
						class="inline-flex items-end not-prose px-0.5 h-1 group"
					>
						<img
							src="${firstImage.url}"
							class="mr-1 relative top-1.5 w-6 h-6 rounded-sm"
						/>
						<span class="relative top-2 transition-all group-hover:text-blue-500 max-w-48 truncate">
							${firstArtist.name} - ${postData.name}
						</span>
					</a>
				`
			);
		}
	}
});
