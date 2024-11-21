import { createSignal, For, Match, Show, Switch } from "solid-js";
import { createInfiniteQuery } from "@tanstack/solid-query";
import { createIntersectionObserver } from "@solid-primitives/intersection-observer";
import { twJoin } from "tailwind-merge";

import { request } from "@/libraries/clients";
import { useQueryParams } from "@/libraries/hooks";
import { queryParams } from "@/libraries/utilities";
import { FetchMusicArtistsRoute } from "@/libraries/api";
import type { InferDTOS } from "@/libraries/types";

import { MusicArtistEntry } from "@/components/interfaces";
import { withQueryProvider } from "@/components/providers";
import { Button } from "@/components/core";

type MusicArtistsResponse = InferDTOS<
	typeof FetchMusicArtistsRoute.responses
>[200];

export const MusicArtistsView = withQueryProvider(
	(props: MusicArtistsViewProps) => {
		const { url, dtos, responses } = FetchMusicArtistsRoute;

		const [targets, setTargets] = createSignal<Element[]>([]);
		const [query, _, queryInitialised] = useQueryParams(dtos.query);

		const artistsQuery = createInfiniteQuery(() => ({
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
					artistsQuery.hasNextPage &&
					!artistsQuery.isFetching
				) {
					artistsQuery.fetchNextPage();
				}
			});
		});

		return (
			<div class="flex flex-col gap-2 flex-grow min-h-full">
				<Show when={!!artistsQuery.hasPreviousPage}>
					<div class="flex items-center space-x-4">
						<Button
							intent="secondary"
							onClick={() => artistsQuery.fetchPreviousPage()}
							disabled={artistsQuery.isFetchingPreviousPage}
						>
							Get previous posts
						</Button>
						<Show when={artistsQuery.isFetchingPreviousPage}>
							<p class="font-heading text-sm animate-pulse">Loading...</p>
						</Show>
					</div>
				</Show>
				<div class="relative flex flex-col-reverse gap-2 flex-grow min-w-full md:flex-row">
					<div class="flex flex-col flex-grow">
						<Switch>
							<Match when={artistsQuery.isSuccess}>
								<div class="gap-5 flex flex-wrap">
									<For
										each={artistsQuery.data?.pages
											.map((page) => page.items)
											.flat()}
										fallback={
											<div class="col-span-3">
												<h1 class="text-4xl font-heading">No artists found</h1>
											</div>
										}
									>
										{(artist) => (
											<MusicArtistEntry
												artist={artist}
												defer={!queryInitialised()}
											/>
										)}
									</For>
								</div>
								<hr
									class={twJoin(
										"border-tw-full mt-10 mb-5 transition-all",
										!artistsQuery.hasNextPage
											? "border-slate-200"
											: "border-transparent",
									)}
									ref={(element) =>
										setTargets((currentTargets) => [...currentTargets, element])
									}
								/>
								<Show when={artistsQuery.isFetchingNextPage}>
									<p class="font-heading text-sm animate-pulse">Loading...</p>
								</Show>
								<Show when={!artistsQuery.hasNextPage}>
									<p class="font-heading">No more artists</p>
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

export type MusicArtistsViewProps = {
	initial?: MusicArtistsResponse[];
	genres: string[];
};
