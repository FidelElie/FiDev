import { createSignal, For, Match, onMount, Show, Switch } from "solid-js";
import { createQuery } from "@tanstack/solid-query";
import { twJoin } from "tailwind-merge";

import { request } from "@/libraries/clients";
import { queryParams } from "@/libraries/utilities";
import { SearchWebsiteRoute } from "@/libraries/api";
import { useOnDebounce } from "@/libraries/hooks";

import { withQueryProvider } from "@/components/providers";
import { Grid, Icon } from "@/components/core";
import { MusicPostSearchEntry } from "@/components/pages/search/_SearchPane/MusicPostSearchEntry";
import { MusicArtistSearchEntry } from "@/components/pages/search/_SearchPane/MusicArtistSearchEntry";

export const SearchPane = withQueryProvider(
	() => {
		let searchRef: HTMLInputElement | undefined;

		const { url, dtos, responses } = SearchWebsiteRoute;

		const [search, setSearch] = createSignal("");
		const [debouncedSearch, setDebouncedSearch] = createSignal(search());
		const { debouncing } = useOnDebounce(search, (newSearch) => {
			setDebouncedSearch(newSearch);
		});

		const query = () => ({ term: debouncedSearch() });

		const searchQuery = createQuery(() => ({
			queryKey: [url, query()],
			queryFn: async () => {
				const validatedQuery = dtos.query.parse(query());
				const requestUrl = `${url}${queryParams.encodeToUrl(validatedQuery)}`;
				const response = await request({ url: requestUrl });

				return responses[200].parse(response);
			},
			enabled: !!debouncedSearch(),
			placeholderData: (prev) => prev,
		}));

		onMount(() => {
			if (searchRef) {
				searchRef.focus();
			}
		});

		return (
			<div class="space-y-8">
				<div class="flex items-center border-b border-x-0 border-t-0 border-slate-200 gap-2">
					<label for="search-bar" class="sr-only">
						Search bar
					</label>
					<input
						ref={searchRef!}
						id="search-bar"
						class="w-full text-lg font-heading px-0 py-2 flex-grow border-transparent focus:border-transparent focus:ring-0 md:text-3xl"
						placeholder="What would you like to find?..."
						value={search()}
						onInput={(event) => setSearch(event.currentTarget.value)}
					/>
					<Icon
						name="circle-notch"
						class={twJoin(
							"text-4xl transition text-blue-500",
							debouncing() || searchQuery.isFetching
								? "opacity-100 animate-spin"
								: "opacity-0",
						)}
					/>
				</div>
				<Switch>
					<Match when={searchQuery.isSuccess && !!debouncedSearch()}>
						<Show
							when={
								searchQuery.data?.music.length ||
								searchQuery.data?.artists.length
							}
							fallback={<p class="text-2xl">No results found</p>}
						>
							<Show when={searchQuery.data?.music.length}>
								<div class="space-y-5">
									<h2 class="font-heading text-xl text-blue-500">music</h2>
									<For each={searchQuery.data?.music || []}>
										{(entry) => <MusicPostSearchEntry post={entry} />}
									</For>
								</div>
							</Show>
							<Show when={searchQuery.data?.artists.length}>
								<div class="space-y-5">
									<h2 class="font-heading text-xl text-blue-500">artists</h2>
									<Grid>
										<For each={searchQuery.data?.artists || []}>
											{(artist) => <MusicArtistSearchEntry artist={artist} />}
										</For>
									</Grid>
								</div>
							</Show>
						</Show>
					</Match>
				</Switch>
			</div>
		);
	},
	{ devtools: true },
);
