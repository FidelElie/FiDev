import { createSignal, For, Match, onMount, Show, Switch } from "solid-js";
import { createQuery } from "@tanstack/solid-query";

import { request } from "@/libraries/clients";
import { queryParams } from "@/libraries/utilities";
import { SearchWebsiteRoute } from "@/libraries/api";
import { useOnDebounce } from "@/libraries/hooks";

import { withQueryProvider } from "@/components/providers";
import { MusicProjectEntry } from "@/components/interfaces";
import { Grid } from "@/components/core";
import { AiOutlineLoading } from "solid-icons/ai";
import { twJoin } from "tailwind-merge";

export const SearchPane = withQueryProvider(
	() => {
		let searchRef: HTMLInputElement | null;

		const { url, dtos, responses } = SearchWebsiteRoute;

		const [search, setSearch] = createSignal("");
		const [debouncedSearch, setDebouncedSearch] = createSignal(search());
		const { debouncing } = useOnDebounce(
			search,
			(newSearch) => { setDebouncedSearch(newSearch); }
		);

		const query = () => ({ term: debouncedSearch() });

		const searchQuery = createQuery(
			() => ({
				queryKey: [url, query()],
				queryFn: async () => {
					const validatedQuery = dtos.query.parse(query());
					const requestUrl = `${url}${queryParams.encodeToUrl(validatedQuery)}`;
					const response = await request({ url: requestUrl });

					return responses[200].parse(response);
				},
				enabled: !!debouncedSearch(),
				placeholderData: (prev) => prev
			})
		);

		onMount(() => { if (searchRef) { searchRef.focus(); } });

		return (
			<div class="space-y-8">
				<div class="flex items-center border-b border-x-0 border-t-0 border-slate-200 gap-2">
					<label for="search-bar" class="sr-only">
						Search bar
					</label>
					<input
						ref={searchRef!}
						id="search-bar"
						class="w-full text-3xl font-heading px-0 py-2 flex-grow border-transparent focus:border-transparent focus:ring-0"
						placeholder="What would you like to find?..."
						value={search()}
						onInput={event => setSearch(event.currentTarget.value)}
					/>
					<AiOutlineLoading
						class={twJoin(
							"text-blue-500 text-2xl transition-all duration-700",
							(debouncing() || searchQuery.isFetching) ? "animate-spin opacity-100" : "opacity-0"
						)}
					/>
				</div>
				<Switch>
					<Match when={searchQuery.isSuccess && !!debouncedSearch()}>
						<Show
							when={searchQuery.data?.music.length || searchQuery.data?.artists.length}
							fallback={<p class="text-2xl">No results found</p>}
						>
							<Show when={searchQuery.data?.music.length}>
								<div class="space-y-5">
									<h2 class="font-heading text-xl text-blue-500">music projects</h2>
									<Grid>
										<For each={searchQuery.data?.music || []}>
											{ entry => <MusicProjectEntry post={entry}/> }
										</For>
									</Grid>
								</div>
							</Show>
						</Show>
					</Match>
					<Match
						when={
							(
								searchQuery.isLoading ||
								searchQuery.fetchStatus === "fetching"
							) &&!!debouncedSearch()
						}
					>
						<div class="flex items-center">
							<AiOutlineLoading class="animate-spin text-blue-500 text-3xl"/>
							<span class="font-light text-2xl">Searching...</span>
						</div>
					</Match>
				</Switch>
			</div>
		)
	},
	{ devtools: true }
);
