import { createSignal, For, Show } from "solid-js";
import { twJoin } from "tailwind-merge";
import { encode } from "qss";

import { astroNavigate } from "@/libraries/utilities";

import { Button, Icon, Tooltip } from "@/components/core";
import { useOnDebounce } from "@/libraries/hooks";

export const MusicGenreView = (props: MusicGenreViewProps) => {
	let genreContainerRef: HTMLDivElement | undefined;

	const [chosenGenres, setChosenGenres] = createSignal<string[]>([]);
	const [submitting, setSubmitting] = createSignal(false);
	const [search, setSearch] = createSignal("");
	const [debouncedSearch, setDebouncedSearch] = createSignal(search());
	const { debouncing } = useOnDebounce(
		search,
		(newSearch) => { setDebouncedSearch(newSearch); },
		{ delay: 500 }
	);

	const filteredGenres = () => {
		if (!debouncedSearch()) { return props.genres; }

		const loweredSearch = debouncedSearch().toLowerCase();

		return props.genres.filter(genre => genre.toLowerCase().includes(loweredSearch));
	}

	const handleGenreToggle = (genre: string) => {
		setChosenGenres((currentGenres) => {
			if (currentGenres.includes(genre)) {
				return currentGenres.filter((currentGenre) => currentGenre !== genre);
			}

			return currentGenres.concat([genre]);
		});
	};

	const clearSelectedGenres = () => setChosenGenres([]);

	const handleGenresSearch = () => {
		setSubmitting(true);
		if (!chosenGenres().length || !genreContainerRef) {
			return;
		}

		astroNavigate({
			element: genreContainerRef,
			href: `/music?${encode({ genres: chosenGenres() })}`,
		});
	};

	return (
		<div class="flex flex-col gap-5 relative">
			<aside class="sticky top-2 flex-shrink-0 border flex flex-col border-slate-200 bg-white rounded-lg w-full z-20 sm:flex-row sm:items-center">
				<div
					class="flex items-center flex-grow border-b border-slate-200 pl-2 sm:border-b-0 sm:border-r"
				>
					<div class="mr-2">
						<Show
							when={!debouncing()}
							fallback={<Icon name="circle-notch" class="text-xl text-blue-500 animate-spin"/>}
						>
							<Icon name="magnifying-glass" class="text-xl text-blue-500"/>
						</Show>
					</div>
					<label for="filter-genres" class="sr-only">Filter genres</label>
					<input
						id="filter-genres"
						type="text"
						class="border-none flex-grow rounded-tr-lg sm:rounded-none"
						placeholder="Filter genres"
						size={1}
						value={search()}
						onInput={event => setSearch(event.target.value)}
					/>
				</div>
				<div class="flex items-center" ref={genreContainerRef}>
					<Show when={chosenGenres().length}>
						<Button
							class="border-y-0 border-l-0 border-r rounded-none flex items-center justify-center"
							intent="secondary"
							aria-label="Clear selected genres"
							onClick={clearSelectedGenres}
						>
							<Icon name="broom" class="text-xl text-blue-500"/>
						</Button>
					</Show>
					<Tooltip
						triggerClass="flex-grow"
						triggerAs="div"
						trigger={(
							<Button
								onClick={handleGenresSearch}
								class="border-none flex items-center justify-center gap-1 w-full flex-grow disabled:opacity-75"
								disabled={submitting() || !chosenGenres().length}
							>
								Search
								<Show when={chosenGenres().length}>
									{ amount => <span> ({amount()})</span>}
								</Show>
								<Icon name="caret-right" class="text-xl text-blue-500 ml-0.5"/>
							</Button>
						)}
					>
						<Show
							when={chosenGenres().length}
							fallback={(
								<span class="text-blue-500 font-light">Pick some genres to enabled this</span>
							)}
						>
							<span class="font-heading text-lg text-blue-500">Chosen genres</span>
							<hr class="my-1 border-slate-200 border-t"/>
							<ul class="font-light max-h-40 overflow-y-auto">
								<For each={chosenGenres()}>
									{ genre => <li>{genre}</li> }
								</For>
							</ul>
						</Show>
					</Tooltip>
				</div>
			</aside>
			<div class="flex flex-wrap gap-3 flex-grow">
				<For
					each={filteredGenres()}
					fallback={(
						<span class="font-heading text-lg">No genres were found with this criteria</span>
					)}
				>
					{(genre) => (
						<Button
							class={twJoin(
								"border  rounded-full px-3 py-2 transition-all transform hover:scale-110 text-slate-600 duration-1000",
								chosenGenres().includes(genre)
									? "border-blue-500"
									: "border-slate-200",
							)}
							onClick={() => handleGenreToggle(genre)}
						>
							{genre}
						</Button>
					)}
				</For>
			</div>
		</div>
	);
};

export type MusicGenreViewProps = {
	genres: string[];
};
