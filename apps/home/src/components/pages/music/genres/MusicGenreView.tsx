import { createSignal, For, Show } from "solid-js";
import { twJoin } from "tailwind-merge";
import { encode } from "qss";

import { astroNavigate } from "@/libraries/utilities";
import { Button } from "@/components/core";

export const MusicGenreView = (props: MusicGenreViewProps) => {
	let genreContainerRef: HTMLDivElement | undefined;

	const [genres, setGenres] = createSignal<string[]>([]);
	const [submitting, setSubmitting] = createSignal(false);

	const handleGenreToggle = (genre: string) => {
		setGenres((currentGenres) => {
			if (currentGenres.includes(genre)) {
				return currentGenres.filter((currentGenre) => currentGenre !== genre);
			}

			return currentGenres.concat([genre]);
		});
	};

	const clearSelectedGenres = () => setGenres([]);

	const handleGenresSearch = () => {
		setSubmitting(true);
		if (!genres().length || !genreContainerRef) {
			return;
		}

		astroNavigate({
			element: genreContainerRef,
			href: `/music?${encode({ genres: genres() })}`,
		});
	};

	return (
		<div class="flex flex-col-reverse gap-2 relative md:flex-row">
			<div class="flex flex-wrap gap-3 flex-grow">
				<For each={props.genres}>
					{(genre) => (
						<Button
							class={twJoin(
								"border  rounded-full px-3 py-2 transition-all transform hover:scale-110 text-slate-600 duration-1000",
								genres().includes(genre)
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
			<aside class="sticky top-2 w-full flex-shrink-0  md:w-64 md:relative">
				<div class="sticky top-4 border border-slate-200 bg-white rounded-lg w-full p-5 space-y-3">
					<span>Genres: {genres().length}</span>
					<div class="flex items-center gap-3" ref={genreContainerRef}>
						<Button
							onClick={handleGenresSearch}
							disabled={submitting() || !genres().length}
						>
							Search genres
						</Button>
						<Show when={genres().length}>
							<Button.Link onClick={clearSelectedGenres}>Clear</Button.Link>
						</Show>
					</div>
				</div>
			</aside>
		</div>
	);
};

export type MusicGenreViewProps = {
	genres: string[];
};
