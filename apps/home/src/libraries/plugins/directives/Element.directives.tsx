import { twJoin } from "tailwind-merge";

import { createRegExpDirective } from "../remarkRegExpDirective";

export const VideoDirective = createRegExpDirective({
	identifier: /:video\[(.*?)\]\[(.*?)\](?:\[(.*?)\])?/gs,
	onMatch: (match) => {
		const [href, modifiers, caption] = match.slice(1);

		return { href, modifiers, caption };
	},
	getHTML: (result) => {
		const { href, modifiers, caption } = result;

		const fullWith = modifiers.includes("full");
		const autoplay = modifiers.includes("autoplay");
		const controls = modifiers.includes("controls");
		const lazy = modifiers.includes("lazy");
		const loop = modifiers.includes("loop");

		const videoClasses = twJoin("w-full", !fullWith && "md:w-3/4");

		return `
				<figure>
					<video
						src="${href}"
						class="${videoClasses}"
						${controls ? "controls" : ""}
						${lazy ? 'loading="lazy"' : ""}
						${autoplay ? "autoplay muted" : ""}
						${loop ? "loop" : ""}
					>
					</video>
					${
						!!caption
							? `
							<hr class="border-slate-200 w-full border-t mt-5 mb-2"/>
							<figcaption class="font-heading">- ${caption}</figcaption>
						`
							: ""
					}
				</figure>
			`;
	},
});

export const ImageDirective = createRegExpDirective({
	identifier: /:image\[(.*?)\]\((.*?)\)\[(.*?)\](?:\[(.*?)\])?/gs,
	onMatch: (match) => {
		const [alt, href, modifiers, caption] = match.slice(1);

		return { alt, href, modifiers, caption };
	},
	getHTML: (result) => {
		const { alt, href, modifiers, caption } = result;

		const fullWith = modifiers.includes("full");
		const lazy = modifiers.includes("lazy");

		const imageClasses = twJoin("w-full", !fullWith && "md:w-3/4");

		return `
				<figure>
					<img
						src="${href}"
						alt="${alt}"
						class="${imageClasses}"
						${lazy ? 'loading="lazy"' : ""}
					>
					</img>
					${
						!!caption
							? `
								<hr class="border-slate-200 w-full border-t mt-5 mb-2"/>
								<figcaption class="font-heading">- ${caption}</figcaption>
							`
							: ""
					}
				</figure>
			`;
	},
});

export const LinkDirective = createRegExpDirective({
	identifier: /:link\[(.*?)\]\((.*?)\)\[(.*?)\]/gs,
	onMatch: (match) => {
		const [text, href, modifiers] = match.slice(1);

		return { text, href, modifiers };
	},
	getHTML: (result) => {
		const { text, href, modifiers } = result;

		const _blank = modifiers.includes("_blank");

		return `
				<a href="${href} ${_blank ? 'target="_blank"' : ""}>
					${text}
				</a>
			`;
	},
});

export const FutureCommentDirective = createRegExpDirective({
	identifier: /:future-comment\[(.*?)\]\[(.*?)\]/gs,
	onMatch: (match) => {
		const [text, date] = match.slice(1);

		return { text, date };
	},
	getHTML: (result) => {
		const { text, date } = result;

		const parsedDate = new Date(date);

		return `
				<div class="rounded-lg border border-slate-200  not-prose flex flex-col">
					<div class="flex items-center gap-3 p-2">
						<div class="w-16 h-16 rounded-full overflow-hidden">
							<img src="/taking-photo.jpg" loading="lazy"/>
						</div>
						<div>
							<p class="font-heading text-xl tracking-tight">Future Fidel's comments</p>
							<span class="text-sm text-blue-500 tracking-tight -mt-1">
								As of ${parsedDate.toDateString()}
							</span>
						</div>
					</div>
					<hr class="border-t border-slate-200"/>
					<div class="p-2">
						<q class="font-heading font-light tracking-tight">
							${text}
						</q>
					</div>
				</div>
			`;
	},
});

export const QuoteDirective = createRegExpDirective({
	identifier: /:quote\[(.*?)\]/g,
	onMatch: (match) => {
		const [content] = match.slice(1);

		return { content }
	},
	getHTML: (result) => {
		const { content } = result;

		return `<q>${content}</q>`
	}
});

