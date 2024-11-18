import { Show, For, batch } from "solid-js";
import { createStore } from "solid-js/store";

import { OcTrash2 } from "solid-icons/oc";
import { VsChevronDown } from "solid-icons/vs";
import { FiCheck, FiSave } from "solid-icons/fi";
import { RiDocumentFolderMusicLine } from 'solid-icons/ri'
import { AiOutlineClear, AiOutlineLoading, AiOutlineStar } from "solid-icons/ai";

import { twMerge } from "tailwind-merge";

import { useQueryParams } from "@/libraries/hooks";
import { MusicPostRatingMap } from "@/libraries/constants";
import { FetchMusicPostsRoute } from "@/libraries/api";
import type { InferDTOS } from "@/libraries/types";

import { Popover, Tooltip, Select } from "@/components/core";


export const MusicPostStickyPane = (props: MusicPostStickyPaneProps) => {
	const [query, setQuery] = useQueryParams(FetchMusicPostsRoute.dtos.query);

	const [store, setStore] = createStore({
		genres: props.initial?.genres || [],
		levels: props.initial?.levels || [],
	});

	const configIsClearable = () => {
		return !!query().genres?.length || !!query().levels?.length;
	}

	const configIsDirty = () => {
		const { genres = [], levels = [] } = query();

		if (store.genres.length !== genres.length || store.levels.length !== levels.length) {
			return true;
		}

		return (
			store.genres.some(genre => !genres?.includes(genre)) ||
			store.levels.some(level => !levels?.includes(level))
		);
	}

	const updateConfig = () => { setQuery({ ...query(), ...store }); }

	const clearConfig = () => {
		batch(() => {
			setQuery({ ...query(), genres: [], levels: [] });
			setStore({
				genres: props.initial?.genres || [],
				levels: props.initial?.levels || [],
			});
		});
	}

	return (
		<aside
			class={
				twMerge(
					"flex-shrink-0 flex sticky top-2 md:relative gap-2 md:top-0 w-min md:flex-col",
					props.class
				)
			}
		>
			<div class="rounded-lg border h-min w-min border-slate-200 flex-shrink-0 sticky top-2 flex items-center bg-white md:flex-col">
				<Popover
					placement="left"
					flip={"bottom"}
					trigger={(
						<Tooltip
							placement="left"
							flip={"bottom"}
							trigger={(
								<>
									<RiDocumentFolderMusicLine class="text-xl text-blue-500"/>
									<Show when={store.genres?.length}>
										{ amount => (
											<div class="w-4 h-4 rounded-full border border-blue-500 flex items-center justify-center absolute right-1 top-1">
												<span class="text-xs font-heading">{amount()}</span>
											</div>
										) }
									</Show>
								</>
							)}
							contentClass="p-2"
						>
							Filter by genres
						</Tooltip>
					)}
					triggerClass="w-14 h-14 flex items-center justify-center flex-shrink-0"
					contentClass="flex flex-col space-y-2 max-w-72 p-2.5"
				>
					<div class="flex items-center gap-1">
						<RiDocumentFolderMusicLine class="text-xl text-blue-500"/>
						<p class="font-heading">
							Filter by genres
						</p>
					</div>
					<Select
						label="Select genres"
						onChange={genres => setStore("genres", genres)}
						values={store.genres || []}
						options={props.genres}
						placeholder="Select genres"
						valueComponent={(genres) => (
							<div class="flex gap-2">
								<div class="flex-grow flex-wrap flex gap-1">
									<For each={genres}>
										{ genre => (
											<span class="border border-slate-200 rounded-lg px-2 py-1 flex items-center gap-1 w-min">
												<span class="truncate max-w-16">
													{genre}
												</span>
												<OcTrash2 class="text-sm text-blue-500"/>
											</span>
										)}
									</For>
								</div>
								<VsChevronDown class="text-blue-500 text-2xl mt-1"/>
							</div>
						)}
						itemComponent={(genre) => (
							<div class="py-1 px-3 flex items-center justify-between cursor-pointer">
								<span class="font-heading font-light">{genre}</span>
								<Select.SelectedIndicator>
									<FiCheck class="text-blue-500"/>
								</Select.SelectedIndicator>
							</div>
						)}
						class="px-3 py-2 border border-slate-200 rounded-lg w-64 text-left"
						labelClass="sr-only"
						listClass="bg-white border-slate-200 border rounded-lg max-h-32 overflow-y-auto"
					/>
				</Popover>
				<hr class="border-t border-slate-200 w-full"/>
				<Popover
					placement="left"
					flip={"bottom"}
					trigger={(
						<Tooltip
							placement="left"
							flip={"bottom"}
							trigger={(
								<>
									<AiOutlineStar class="text-xl text-blue-500"/>
									<Show when={store.levels?.length}>
										{ amount => (
											<div class="w-4 h-4 rounded-full border border-blue-500 flex items-center justify-center absolute right-1 top-1">
												<span class="text-xs font-heading">{amount()}</span>
											</div>
										) }
									</Show>
								</>
							)}
							contentClass="p-2"
						>
							Filter by ratings
						</Tooltip>
					)}
					triggerClass="w-14 h-14 flex items-center justify-center flex-shrink-0 relative"
					contentClass="flex flex-col space-y-2 max-w-72 p-2.5"
				>
					<div class="flex items-center gap-1">
						<AiOutlineStar class="text-xl text-blue-500"/>
						<p class="font-heading">
							Filter by ratings
						</p>
					</div>
					<Select
						label="Select genres"
						onChange={levels => setStore("levels", levels)}
						values={store.levels || []}
						options={Object.keys(MusicPostRatingMap)}
						placeholder="Select ratings"
						valueComponent={(ratings) => (
							<div class="flex gap-2">
								<div class="flex-grow flex-wrap flex gap-1">
									<For each={ratings}>
										{
											level => (
												<span class="border border-slate-200 rounded-lg px-2 py-1 flex items-center gap-1 w-min whitespace-nowrap">
													{MusicPostRatingMap[level as keyof typeof MusicPostRatingMap]}
													<OcTrash2 class="text-sm text-blue-500"/>
												</span>
											)
										}
									</For>
								</div>
								<VsChevronDown class="text-blue-500 text-2xl mt-1"/>
							</div>
						)}
						itemComponent={(level) => (
							<div class="py-1 px-3 flex items-center justify-between cursor-pointer">
								<span class="font-heading font-light">
									{MusicPostRatingMap[level as keyof typeof MusicPostRatingMap]}
								</span>
								<Select.SelectedIndicator>
									<FiCheck class="text-blue-500"/>
								</Select.SelectedIndicator>
							</div>
						)}
						class="px-3 py-2 border border-slate-200 rounded-lg w-64 text-left"
						labelClass="sr-only"
						listClass="bg-white border-slate-200 border rounded-lg max-h-32 overflow-y-auto"
					/>
				</Popover>
			</div>
			<Show when={configIsDirty()}>
				<hr class="border-t border-slate-200 w-full"/>
				<Tooltip
					placement="left"
					flip={"bottom"}
					trigger={(
						<button onClick={updateConfig} class="w-14 h-14 flex items-center justify-center">
							<FiSave class="text-xl text-white" />
						</button>
					)}
					triggerAs="div"
					triggerClass="bg-blue-500 flex-shrink-0 relative rounded-lg"
					contentClass="p-2"
				>
					Save
				</Tooltip>
			</Show>
			<Show when={configIsClearable()}>
				<Tooltip
					placement="left"
					flip={"bottom"}
					trigger={(
						<button onClick={clearConfig}>
							<AiOutlineClear class="text-xl text-blue-500" />
						</button>
					)}
					triggerAs="div"
					triggerClass="w-14 h-14 flex items-center justify-center flex-shrink-0 relative border border-slate-200 rounded-lg bg-white"
					contentClass="p-2"
				>
					Clear all
				</Tooltip>
			</Show>
			<Show when={props.isFetching}>
				<div class="w-14 h-14 flex items-center justify-center flex-shrink-0">
					<AiOutlineLoading class="text-blue-500 animate-spin text-2xl"/>
				</div>
			</Show>
		</aside>
	)
}

export type MusicPostStickyPaneProps = {
	class?: string;
	genres: string[];
	initial?: InferDTOS<typeof FetchMusicPostsRoute.dtos>["query"];
	isFetching?: boolean;
}
