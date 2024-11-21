import { createSignal, For, Match, Show, Switch } from "solid-js";
import { createInfiniteQuery } from "@tanstack/solid-query";
import { createIntersectionObserver } from "@solid-primitives/intersection-observer";
import { twJoin } from "tailwind-merge";

import { request } from "@/libraries/clients";
import { useQueryParams } from "@/libraries/hooks";
import { queryParams } from "@/libraries/utilities";
import { FetchMusicPostsRoute } from "@/libraries/api";
import type { InferDTOS } from "@/libraries/types";

import { Button, Grid } from "@/components/core";
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
			<div class="flex flex-col gap-2 flex-grow min-h-full">
				<Show
					when={queryInitialised()}
					fallback={
						<div class="flex-shrink-0 w-40 h-11 bg-slate-200 rounded-lg animate-pulse" />
					}
				>
					<MusicPostStickyPane
						genres={props.genres}
						initial={query()}
						isFetching={postsQuery.isFetching}
					/>
				</Show>
				<Show when={!!postsQuery.hasPreviousPage}>
					<div class="flex items-center space-x-4">
						<Button
							intent="secondary"
							onClick={() => postsQuery.fetchPreviousPage()}
							disabled={postsQuery.isFetchingPreviousPage}
						>
							Get previous posts
						</Button>
						<Show when={postsQuery.isFetchingPreviousPage}>
							<p class="font-heading text-sm animate-pulse">Loading...</p>
						</Show>
					</div>
				</Show>
				<div class="relative flex flex-col gap-2">
					<div class="flex flex-col">
						<Switch fallback={<LoadingSkeleton />}>
							<Match when={postsQuery.isSuccess}>
								<Grid class="gap-x-5 gap-y-10">
									<For
										each={postsQuery.data?.pages
											.map((page) => page.items)
											.flat()}
										fallback={
											<div class="col-span-3">
												<h1 class="text-4xl font-heading">No projects found</h1>
											</div>
										}
									>
										{(post) => (
											<MusicProjectEntry
												post={post}
												defer={!queryInitialised()}
											/>
										)}
									</For>
								</Grid>
								<hr
									class={twJoin(
										"border-tw-full mt-10 mb-5 transition-all",
										!postsQuery.hasNextPage
											? "border-slate-200"
											: "border-transparent",
									)}
									ref={(element) =>
										setTargets((currentTargets) => [...currentTargets, element])
									}
								/>
								<Show when={postsQuery.isFetchingNextPage}>
									<p class="font-heading text-sm animate-pulse">Loading...</p>
								</Show>
								<Show when={!postsQuery.hasNextPage}>
									<p class="font-heading">No more posts</p>
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
