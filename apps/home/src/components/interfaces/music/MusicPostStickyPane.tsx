import { Show, For, batch } from "solid-js";
import { createStore } from "solid-js/store";
import { twJoin, twMerge } from "tailwind-merge";

import { useQueryParams } from "@/libraries/hooks";
import { MusicPostRatingMap } from "@/libraries/constants";
import { FetchMusicPostsRoute } from "@/libraries/api";
import type { InferDTOS } from "@/libraries/types";

import { Popover, Select, Button, Icon } from "@/components/core";

export const MusicPostStickyPane = (props: MusicPostStickyPaneProps) => {
	const [query, setQuery] = useQueryParams(FetchMusicPostsRoute.dtos.query);

	const [store, setStore] = createStore({
		genres: props.initial?.genres || [],
		levels: props.initial?.levels || [],
		search: props.initial?.search || "",
	});

	const configIsClearable = () => {
		return (
			!!query().genres?.length || !!query().levels?.length || !!query().search
		);
	};

	const configIsDirty = () => {
		const { genres = [], levels = [], search = "" } = query();

		if (
			store.genres.length !== genres.length ||
			store.levels.length !== levels.length ||
			store.search !== search
		) {
			return true;
		}

		return (
			store.genres.some((genre) => !genres?.includes(genre)) ||
			store.levels.some((level) => !levels?.includes(level)) ||
			store.search !== search
		);
	};

	const updateConfig = () => {
		setQuery({ ...query(), ...store });
	};

	const clearConfig = () => {
		batch(() => {
			setQuery({ ...query(), genres: [], levels: [], search: "" });
			setStore({
				genres: props.initial?.genres || [],
				levels: props.initial?.levels || [],
				search: props.initial?.search || "",
			});
		});
	};

	return (
		<aside
			class={twMerge(
				"flex-shrink-0 flex flex-col sticky top-1 z-20",
				"border border-slate-200 rounded-lg bg-white",
				"md:flex-row",
				props.class,
			)}
		>
			<Popover
				placement="bottom-start"
				flip="top start"
				trigger={
					<div class="flex items-center gap-1 relative pl-3 pr-5 py-2">
						<Icon name="sliders-horizontal" class="text-2xl text-blue-500" />
						<span>Filter</span>
						<Show when={store.genres?.length + store.levels?.length}>
							{(amount) => (
								<div class="w-4 h-4 rounded-full border border-blue-500 flex items-center justify-center absolute top-0.5 right-0.5">
									<span class="text-xs font-heading">
										{amount() < 10 ? amount() : ":)"}
									</span>
								</div>
							)}
						</Show>
					</div>
				}
				triggerClass="whitespace-nowrap border-b md:border-r md:border-b-0 border-slate-200"
				contentClass="p-3 z-20 min-w-64 max-w-96 flex flex-col bg-white space-y-2"
			>
				<div>
					<div class="flex items-center">
						<Icon name="playlist" class="mr-1.5 text-xl text-blue-500" />
						<p class="font-heading text-lg font-light">Filter by genres</p>
					</div>
					<Select
						label="Select genres"
						onChange={(genres) => setStore("genres", genres)}
						values={store.genres || []}
						options={props.genres}
						placeholder="Select genres"
						valueComponent={(genres) => (
							<div class="flex items-center gap-2">
								<div class="flex-grow flex-wrap flex gap-1">
									<For each={genres}>
										{(genre) => (
											<span class="border border-slate-200 rounded-lg px-2 py-1 flex items-center gap-1 w-min">
												<span class="truncate max-w-32">{genre}</span>
											</span>
										)}
									</For>
								</div>
								<Icon name="caret-down" class="text-blue-500 text-2xl" />
							</div>
						)}
						itemComponent={(genre) => (
							<div class="py-1 px-3 flex items-center justify-between cursor-pointer">
								<span class="font-heading font-light">{genre}</span>
								<Select.SelectedIndicator>
									<Icon name="check" class="text-blue-500 text-xl" />
								</Select.SelectedIndicator>
							</div>
						)}
						class="px-3 py-2 border border-slate-200 rounded-lg w-full text-left"
						labelClass="sr-only"
						listClass="bg-white border-slate-200 z-20 border rounded-lg max-h-32 overflow-y-auto"
					/>
				</div>
				<div>
					<div class="flex items-center">
						<Icon name="star" class="mr-1.5 text-xl text-blue-500" />
						<p class="font-heading text-lg font-light">Filter by rating</p>
					</div>
					<Select
						label="Select ratings"
						onChange={(levels) => setStore("levels", levels)}
						values={store.levels || []}
						options={Object.keys(MusicPostRatingMap)}
						placeholder="Select ratings"
						valueComponent={(ratings) => (
							<div class="flex items-center gap-2">
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
								<Icon name="caret-down" class="text-blue-500 text-2xl" />
							</div>
						)}
						itemComponent={(level) => (
							<div class="py-1 px-3 flex items-center justify-between cursor-pointer">
								<span class="font-heading font-light">
									{MusicPostRatingMap[level as keyof typeof MusicPostRatingMap]}
								</span>
								<Select.SelectedIndicator>
									<Icon name="check" class="text-blue-500 text-xl" />
								</Select.SelectedIndicator>
							</div>
						)}
						class="px-3 py-2 border border-slate-200 rounded-lg w-full text-left"
						labelClass="sr-only"
						listClass="bg-white border-slate-200 z-20 border rounded-lg max-h-32 overflow-y-auto"
					/>
				</div>
			</Popover>
			<div
				class={twJoin(
					"flex items-center gap-1 pl-2 flex-grow",
					!configIsDirty() && !configIsClearable()
						? "rounded-r-lg border-r-0"
						: "border-b md:border-r md:border-b-0 border-slate-200",
				)}
			>
				<label for="search" class="sr-only">
					Search posts
				</label>
				<Icon
					name="magnifying-glass"
					class="text-blue-500 text-xl flex-shrink-0"
				/>
				<input
					id="search"
					type="text"
					placeholder="Search"
					value={store.search}
					size={1}
					onInput={(event) => setStore("search", event.currentTarget.value)}
					class={twJoin(
						"border-none flex-grow",
						!configIsDirty() && !configIsClearable() && "rounded-r-lg",
					)}
				/>
			</div>
			<div class="flex items-center">
				<Show when={configIsDirty()}>
					<Button
						onClick={updateConfig}
						class={twJoin(
							"flex items-center flex-grow justify-center border-slate-200",
							configIsClearable()
								? "border-y-0 border-l-0 border-r"
								: "border-none",
						)}
					>
						<Icon name="floppy-disk" class="text-blue-500 text-xl mr-1" />
						Save
					</Button>
				</Show>
				<Show when={configIsClearable()}>
					<Button
						onClick={clearConfig}
						class="flex items-center border-none flex-grow justify-center"
					>
						<Icon name="broom" class="text-blue-500 text-xl mr-1" />
						Clear
					</Button>
				</Show>
			</div>
		</aside>
	);
};

export type MusicPostStickyPaneProps = {
	class?: string;
	genres: string[];
	initial?: InferDTOS<typeof FetchMusicPostsRoute.dtos>["query"];
	isFetching?: boolean;
};
