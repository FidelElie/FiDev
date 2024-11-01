import { createSignal, For, Match, Show, Switch } from "solid-js";
import { AiOutlineLoading } from 'solid-icons/ai';
import { BsMusicNote } from "solid-icons/bs";
import { QueryClient, QueryClientProvider, createInfiniteQuery } from "@tanstack/solid-query";
import { SolidQueryDevtools } from "@tanstack/solid-query-devtools";
import { createIntersectionObserver } from "@solid-primitives/intersection-observer";
import { twJoin } from "tailwind-merge";

import { request } from "@/libraries/clients";
import { useQueryParams } from "@/libraries/hooks";
import { queryParams } from "@/libraries/utilities";
import { FetchMusicPostsRoute, type InferDTOS } from "@/libraries/api";

import { Grid } from "@/components/core";
import { MusicPostStickyPane, MusicProjectLink } from "@/components/interfaces";

type MusicPostsResponse = InferDTOS<typeof FetchMusicPostsRoute.responses>[200];

const queryClient = new QueryClient();

export const MusicProjectsView = (props: MusicProjectsViewProps) => {
	return (
		<QueryClientProvider client={queryClient}>
			<MusicProjectsContents {...props}/>
			<SolidQueryDevtools/>
		</QueryClientProvider>
	)
}

export const MusicProjectsContents = (props: MusicProjectsViewProps) => {
	const [targets, setTargets] = createSignal<Element[]>([]);

	const [query, _, queryInitialised] = useQueryParams(FetchMusicPostsRoute.dtos.query);

	const postsQuery = createInfiniteQuery(
		() => ({
			queryKey: ["/api/music", query()],
			queryFn: async ({ pageParam }) => {
				const updatedQuery = FetchMusicPostsRoute.dtos.query.parse({
					...query(),
					page: pageParam
				});

				const response = await request({
					url: `/api/music${queryParams.encodeToUrl(updatedQuery)}`
				});

				return FetchMusicPostsRoute.responses[200].parse(response);
			},
			initialPageParam: query()?.page || 1,
			getPreviousPageParam: (lastPage) => {
				return lastPage.pagination.previous ? lastPage.pagination.page - 1 : undefined;
			},
			getNextPageParam: (lastPage) => {
				return lastPage.pagination.next ? lastPage.pagination.page + 1 : undefined;
			},
			initialData: {
				pages: props.initial || [],
				pageParams: query().page ? [query().page] : props.initial?.map(page => page.pagination.page) || []
			},
			stateTime: 1000,
			enabled: queryInitialised(),
		})
	)

	createIntersectionObserver(targets, entries => {
		entries.forEach(element => {
			if (element.isIntersecting && postsQuery.hasNextPage && !postsQuery.isFetching) {
				postsQuery.fetchNextPage();
			}
		})
	});

	return (
		<div class="flex flex-col gap-2 flex-grow min-h-full">
			<Show when={!!postsQuery.hasPreviousPage}>
				<button
					class="bg-white px-3 py-2 rounded-lg text-blue-500 border border-blue-500 font-heading font-light flex items-center gap-2 disabled:opacity-50 w-min whitespace-nowrap"
					onClick={() => postsQuery.fetchPreviousPage()}
					disabled={postsQuery.isFetchingPreviousPage}
				>
					<div class="w-5 flex items-center">
						{
							!postsQuery.isFetchingPreviousPage ? (
								<BsMusicNote class="text-blue-500" />
							) : (
								<AiOutlineLoading class="text-blue-500 animate-spin"/>
							)
						}
					</div>
					Get Previous Posts
				</button>
			</Show>
			<div class="relative flex flex-col-reverse gap-2 flex-grow min-w-full md:flex-row">
				<div class="flex flex-col flex-grow">
					<Switch fallback={<LoadingSkeleton/>}>
						<Match when={postsQuery.isSuccess}>
							<Grid class="gap-x-5 gap-y-10 flex-grow">
								<For
									each={postsQuery.data?.pages.map(page => page.items).flat()}
									fallback={(
										<div class="col-span-3">
											<h1 class="text-4xl font-heading">No posts found</h1>
										</div>
									)}
								>
									{ post => <MusicProjectLink post={post} defer={!queryInitialised()}/> }
								</For>
							</Grid>
							<hr
								class={twJoin(
									"border-tw-full mt-10 mb-5 transition-all",
									!postsQuery.hasNextPage ? "border-slate-200" : "border-transparent"
								)}
								ref={element => setTargets(currentTargets => [...currentTargets, element])}
							/>
							<Show when={postsQuery.isFetchingNextPage}>
								<AiOutlineLoading class="text-blue-500 animate-spin text-2xl"/>
							</Show>
							<Show when={!postsQuery.hasNextPage}>
								<p class="font-heading">No more posts</p>
							</Show>
						</Match>
					</Switch>
				</div>
				<Show
					when={queryInitialised()}
					fallback={(
						<div class="flex-shrink-0 w-40 h-14 md:w-14 md:h-40 bg-slate-200 rounded-lg animate-pulse"/>
					)}
				>
					<MusicPostStickyPane
						genres={props.genres}
						initial={query()}
						isFetching={postsQuery.isFetching}
					/>
				</Show>
			</div>
		</div>
	)
}

const LoadingSkeleton = () => (
	<Grid class="gap-x-5 gap-y-10">
		<For each={new Array(15)}>
			{ () => <MusicProjectLink defer={true}/> }
		</For>
	</Grid>
)

export type MusicProjectsViewProps = {
	initial?: MusicPostsResponse[];
	genres: string[];
}
