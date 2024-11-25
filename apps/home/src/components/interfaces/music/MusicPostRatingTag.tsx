import { twJoin } from "tailwind-merge";

import { MusicPostRatingMap } from "@/libraries/constants";

export const MusicPostRatingTag = (props: MusicPostRatingTagProps) => {
	return (
		<div
			class={twJoin(
				"py-1 px-2 border border-slate-200 rounded-lg w-min whitespace-nowrap",
				props.class,
			)}
		>
			<p class="text-sm tracking-tight font-heading">
				{MusicPostRatingMap[props.rating]}
			</p>
		</div>
	);
};

export type MusicPostRatingTagProps = {
	class?: string;
	rating: keyof typeof MusicPostRatingMap;
};
