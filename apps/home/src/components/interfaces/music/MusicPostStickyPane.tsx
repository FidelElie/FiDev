import { Show, For, batch } from "solid-js";
import { createStore } from "solid-js/store";
import { twMerge } from "tailwind-merge";

import { useQueryParams } from "@/libraries/hooks";
import { MusicPostRatingMap } from "@/libraries/constants";
import { FetchMusicPostsRoute } from "@/libraries/api";
import type { InferDTOS } from "@/libraries/types";

import { Popover, Select, Button } from "@/components/core";

export const MusicPostStickyPane = (props: MusicPostStickyPaneProps) => {
	const [query, setQuery] = useQueryParams(FetchMusicPostsRoute.dtos.query);

	const [store, setStore] = createStore({
		genres: props.initial?.genres || [],
		levels: props.initial?.levels || [],
	});

	const configIsClearable = () => {
		return !!query().genres?.length || !!query().levels?.length;
	};

	const configIsDirty = () => {
		const { genres = [], levels = [] } = query();

		if (
			store.genres.length !== genres.length ||
			store.levels.length !== levels.length
		) {
			return true;
		}

		return (
			store.genres.some((genre) => !genres?.includes(genre)) ||
			store.levels.some((level) => !levels?.includes(level))
		);
	};

	const updateConfig = () => {
		setQuery({ ...query(), ...store });
	};

	const clearConfig = () => {
		batch(() => {
			setQuery({ ...query(), genres: [], levels: [] });
			setStore({
				genres: props.initial?.genres || [],
				levels: props.initial?.levels || [],
			});
		});
	};

	return (
		<aside
			class={twMerge(
				"flex-shrink-0 flex sticky top-1 h-11 z-20",
				"border border-blue-500 rounded-lg bg-white w-min",
				props.class,
			)}
		>
			<Popover
				placement="bottom-start"
				flip="top start"
				trigger="Filter posts"
				triggerClass="px-3 py-2 whitespace-nowrap"
				contentClass="p-2 min-w-64 max-w-96 flex flex-col bg-white space-y-2"
			>
				<div>
					<p class="font-heading text-lg text-blue-500 font-light">Genres</p>
					<Select
						label="Select genres"
						onChange={(genres) => setStore("genres", genres)}
						values={store.genres || []}
						options={props.genres}
						placeholder="Filter by genres"
						valueComponent={(genres) => (
							<div class="flex gap-2">
								<div class="flex-grow flex-wrap flex gap-1">
									<For each={genres}>
										{(genre) => (
											<span class="border border-slate-200 rounded-lg px-2 py-1 flex items-center gap-1 w-min">
												<span class="truncate max-w-16">{genre}</span>
											</span>
										)}
									</For>
								</div>
							</div>
						)}
						itemComponent={(genre) => (
							<div class="py-1 px-3 flex items-center justify-between cursor-pointer">
								<span class="font-heading font-light">{genre}</span>
								<Select.SelectedIndicator>
									<div class="bg-blue-500 w-2 h-2 rounded-full"/>
								</Select.SelectedIndicator>
							</div>
						)}
						class="px-3 py-2 border border-slate-200 rounded-lg w-full text-left"
						labelClass="sr-only"
						listClass="bg-white border-slate-200 z-20 border rounded-lg max-h-32 overflow-y-auto"
					/>
				</div>
				<div>
					<p class="font-heading text-lg text-blue-500 font-light">Ratings</p>
					<Select
						label="Select ratings"
						onChange={(levels) => setStore("levels", levels)}
						values={store.levels || []}
						options={Object.keys(MusicPostRatingMap)}
						placeholder="Filter by ratings"
						valueComponent={(ratings) => (
							<div class="flex gap-2">
								<div class="flex-grow flex-wrap flex gap-1">
									<For each={ratings}>
										{(level) => (
											<span class="border border-slate-200 rounded-lg px-2 py-1 flex items-center gap-1 w-min whitespace-nowrap">
												{
													MusicPostRatingMap[
														level as keyof typeof MusicPostRatingMap
													]
												}
											</span>
										)}
									</For>
								</div>
							</div>
						)}
						itemComponent={(level) => (
							<div class="py-1 px-3 flex items-center justify-between cursor-pointer">
								<span class="font-heading font-light">
									{MusicPostRatingMap[level as keyof typeof MusicPostRatingMap]}
								</span>
								<Select.SelectedIndicator>
									<div class="bg-blue-500 w-2 h-2 rounded-full"/>
								</Select.SelectedIndicator>
							</div>
						)}
						class="px-3 py-2 border border-slate-200 rounded-lg w-full text-left"
						labelClass="sr-only"
						listClass="bg-white border-slate-200 z-20 border rounded-lg max-h-32 overflow-y-auto"
					/>
				</div>
				<Button onClick={updateConfig} intent={configIsDirty() ? "primary" : "secondary"}>
					Save
				</Button>
			</Popover>
			<Show when={store.genres?.length + store.levels?.length}>
				{(amount) => (
					<div class="flex items-center justify-center px-2 border-l border-slate-200">
						<div class="w-4 h-4 rounded-full border border-blue-500 flex items-center justify-center ">
							<span class="text-xs font-heading">{amount()}</span>
						</div>
					</div>
				)}
			</Show>
			<Show when={configIsClearable()}>
				<button onClick={clearConfig} class="border-l border-slate-200 px-3">
					Clear
				</button>
			</Show>
		</aside>
	);
};

export type MusicPostStickyPaneProps = {
	class?: string;
	genres: string[];
	initial?: InferDTOS<typeof FetchMusicPostsRoute.dtos>["query"];
	isFetching?: boolean;
};
