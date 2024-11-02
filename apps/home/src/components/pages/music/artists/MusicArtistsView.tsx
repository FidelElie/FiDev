import { createSignal, For, Match, Show, Switch } from "solid-js";
import { createInfiniteQuery, QueryClient, QueryClientProvider } from "@tanstack/solid-query";
import { createIntersectionObserver } from "@solid-primitives/intersection-observer";
import { SolidQueryDevtools } from "@tanstack/solid-query-devtools";
import { twJoin } from "tailwind-merge";

import { AiOutlineLoading } from "solid-icons/ai";
import { BsMusicNote } from "solid-icons/bs";

import { request } from "@/libraries/clients";
import { useQueryParams } from "@/libraries/hooks";
import { queryParams } from "@/libraries/utilities";
import { FetchMusicArtistsRoute } from "@/libraries/api";
import type { InferDTOS } from "@/libraries/types";

import { MusicArtistEntry } from "@/components/interfaces";

const queryClient = new QueryClient();

type MusicArtistsResponse = InferDTOS<typeof FetchMusicArtistsRoute.responses>[200];

export const MusicArtistsView = (props: MusicArtistsViewProps) => {
	return (
		<QueryClientProvider client={queryClient}>
			<MusicArtistsContents {...props}/>
			<SolidQueryDevtools/>
		</QueryClientProvider>
	)
}

const MusicArtistsContents = (props: MusicArtistsViewProps) => {
	const { url, dtos, responses } = FetchMusicArtistsRoute;

	const [targets, setTargets] = createSignal<Element[]>([]);
	const [query, _, queryInitialised] = useQueryParams(dtos.query);

	const artistsQuery = createInfiniteQuery(
		() => ({
			queryKey: [url, query()],
			queryFn: async ({ pageParam }) => {
				const updatedQuery = dtos.query.parse({ ...query(), page: pageParam });
				const response = await request({ url: `${url}${queryParams.encodeToUrl(updatedQuery)}`});

				return responses[200].parse(response);
			},
			initialPageParam: query()?.page || 1,
			getPreviousPageParam: (firstPage) => {
				return firstPage.pagination.previous ? firstPage.pagination.page - 1 : undefined;
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
	);

	createIntersectionObserver(targets, entries => {
		entries.forEach(element => {
			if (element.isIntersecting && artistsQuery.hasNextPage && !artistsQuery.isFetching) {
				artistsQuery.fetchNextPage();
			}
		})
	});

	return (
		<div class="flex flex-col gap-2 flex-grow min-h-full">
			<Show when={!!artistsQuery.hasPreviousPage}>
				<button
					class="bg-white px-3 py-2 rounded-lg text-blue-500 border border-blue-500 font-heading font-light flex items-center gap-2 disabled:opacity-50 w-min whitespace-nowrap"
					onClick={() => artistsQuery.fetchPreviousPage()}
					disabled={artistsQuery.isFetchingPreviousPage}
				>
					<div class="w-5 flex items-center">
						{
							!artistsQuery.isFetchingPreviousPage ? (
								<BsMusicNote class="text-blue-500" />
							) : (
								<AiOutlineLoading class="text-blue-500 animate-spin"/>
							)
						}
					</div>
					Get previous artists
				</button>
			</Show>
			<div class="relative flex flex-col-reverse gap-2 flex-grow min-w-full md:flex-row">
				<div class="flex flex-col flex-grow">
					<Switch>
						<Match when={artistsQuery.isSuccess}>
							<div class="gap-x-5 gap-y-10 flex flex-wrap">
								<For
									each={artistsQuery.data?.pages.map(page => page.items).flat()}
									fallback={(
										<div class="col-span-3">
											<h1 class="text-4xl font-heading">No artists found</h1>
										</div>
									)}
								>
									{ artist => <MusicArtistEntry artist={artist} defer={!queryInitialised()}/> }
								</For>
							</div>
							<hr
								class={twJoin(
									"border-tw-full mt-10 mb-5 transition-all",
									!artistsQuery.hasNextPage ? "border-slate-200" : "border-transparent"
								)}
								ref={element => setTargets(currentTargets => [...currentTargets, element])}
							/>
							<Show when={artistsQuery.isFetchingNextPage}>
								<AiOutlineLoading class="text-blue-500 animate-spin text-2xl"/>
							</Show>
							<Show when={!artistsQuery.hasNextPage}>
								<p class="font-heading">No more artists</p>
							</Show>
						</Match>
					</Switch>
				</div>
			</div>
		</div>
	)
}

export type MusicArtistsViewProps = {
	initial?: MusicArtistsResponse[];
	genres: string[];
}
