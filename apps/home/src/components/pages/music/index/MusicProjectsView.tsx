import { createEffect, createSignal, For, Match, Show, Switch } from "solid-js";
import { createInfiniteQuery } from "@tanstack/solid-query";
import { createIntersectionObserver } from "@solid-primitives/intersection-observer";
import { twJoin } from "tailwind-merge";

import { request } from "@/libraries/clients";
import { useQueryParams } from "@/libraries/hooks";
import { queryParams } from "@/libraries/utilities";
import { FetchMusicPostsRoute } from "@/libraries/api";
import type { InferDTOS } from "@/libraries/types";

import { Button, Grid, Icon } from "@/components/core";
import {
	MusicPostStickyPane,
	MusicProjectEntry,
} from "@/components/interfaces";
import { withQueryProvider } from "@/components/providers";

type MusicPostsResponse = InferDTOS<typeof FetchMusicPostsRoute.responses>[200];

export const MusicProjectsView = withQueryProvider(
	(props: MusicProjectsViewProps) => {
		const { url, dtos, responses } = FetchMusicPostsRoute;

		const [targets, setTargets] = createSignal<Element[]>([]);
		const [query, _, queryInitialised] = useQueryParams(dtos.query);

		const postsQuery = createInfiniteQuery(() => ({
			queryKey: [url, query()],
			queryFn: async ({ pageParam }) => {
				const updatedQuery = dtos.query.parse({ ...query(), page: pageParam });

				const response = await request({
					url: `${url}${queryParams.encodeToUrl(updatedQuery)}`,
				});

				return responses[200].parse(response);
			},
			initialPageParam: query()?.page || 1,
			getPreviousPageParam: (firstPage) => {
				return firstPage.pagination.previous
					? firstPage.pagination.page - 1
					: undefined;
			},
			getNextPageParam: (lastPage) => {
				return lastPage.pagination.next
					? lastPage.pagination.page + 1
					: undefined;
			},
			initialData: {
				pages: props.initial || [],
				pageParams: query().page
					? [query().page]
					: props.initial?.map((page) => page.pagination.page) || [],
			},
			stateTime: 1000,
			enabled: queryInitialised(),
		}));

		const isLoading = () => {
			return postsQuery.isLoading || postsQuery.fetchStatus !== "idle" || !queryInitialised();
		};

		const noPosts = () => {
			return !postsQuery.data?.pages.map((page) => page.items).flat().length;
		}

		createIntersectionObserver(targets, (entries) => {
			entries.forEach((element) => {
				if (
					element.isIntersecting &&
					postsQuery.hasNextPage &&
					!postsQuery.isFetching
				) {
					postsQuery.fetchNextPage();
				}
			});
		});

		return (
			<div class="flex flex-col gap-2.5 flex-grow min-h-full">
				<Show
					when={!isLoading()}
					fallback={
						<div class="flex-shrink-0 h-11 bg-slate-200 rounded-lg animate-pulse" />
					}
				>
					<MusicPostStickyPane
						genres={props.genres}
						initial={query()}
						isFetching={postsQuery.isFetching}
					/>
				</Show>
				<Show when={!!postsQuery.hasPreviousPage}>
					<Button
						intent="secondary"
						class="flex items-center gap-1.5 w-min whitespace-nowrap"
						onClick={() => postsQuery.fetchPreviousPage()}
						disabled={postsQuery.isFetchingPreviousPage}
					>
						<Show
							when={!postsQuery.isFetchingPreviousPage}
							fallback={<Icon name="circle-notch" class="text-xl text-blue-500 animate-spin"/>}
						>
							<Icon name="caret-up" class="text-xl text-blue-500"/>
						</Show>
						Get previous posts
					</Button>
				</Show>
				<div class="relative flex flex-col gap-2">
					<div class="flex flex-col">
						<Switch fallback={<LoadingSkeleton />}>
							<Match when={postsQuery.isSuccess}>
								<Grid class="gap-x-5 gap-y-10">
									<For each={postsQuery.data?.pages.map((page) => page.items).flat()}>
										{(post) => (
											<MusicProjectEntry
												post={post}
												defer={isLoading()}
											/>
										)}
									</For>
								</Grid>
								<Show when={postsQuery.hasNextPage || !noPosts()}>
									<hr
										class="border-tw-full mt-10 mb-5 transition-all border-slate-200"
										ref={(element) =>
											setTargets((currentTargets) => [...currentTargets, element])
										}
									/>
								</Show>
								<Show when={postsQuery.isFetchingNextPage}>
									<div class="flex items-center gap-1.5">
										<Icon name="circle-notch" class="text-blue-500 animate-spin text-xl"/>
										<p class="font-heading text-sm animate-pulse">Loading...</p>
									</div>
								</Show>
								<Show when={!postsQuery.hasNextPage}>
									<p class="font-heading text-2xl font-light mt-3">
										{
											noPosts() ? "No posts found with your criteria" : "You've reached the end - more to come soon"
										}
									</p>
								</Show>
							</Match>
						</Switch>
					</div>
				</div>
			</div>
		);
	},
	{ devtools: true },
);

const LoadingSkeleton = () => (
	<Grid class="gap-x-5 gap-y-10">
		<For each={new Array(15)}>{() => <MusicProjectEntry defer={true} />}</For>
	</Grid>
);

export type MusicProjectsViewProps = {
	initial?: MusicPostsResponse[];
	genres: string[];
};
