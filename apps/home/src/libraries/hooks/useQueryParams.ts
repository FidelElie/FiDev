import { createSignal, onCleanup, onMount } from "solid-js"
import { z, type ZodSchema } from "zod";

import { queryParams } from "../utilities";

export const useQueryParams = <T extends ZodSchema>(validator?: T) => {
	const [initialised, setInitialised] = createSignal(false);
	const [query, setQuery] = createSignal<Partial<z.infer<T>>>({});

	const updateQueryParams = () => {
		const windowParams = queryParams.getWindowQuery<T>();

		const validatedParams = validator ? validator.parse(windowParams) : windowParams;

		setQuery((params) => ({...params, ...validatedParams }));
		setInitialised(true);
	}

	const updateQuery = (newQuery: z.infer<T>) => {
		const updateParams = { ...query(), ...newQuery };

		const validatedParams = validator ? validator.parse(updateParams) : updateParams

		const encodedParams = queryParams.encodeToUrl(validatedParams);

		const currentUrl = new URL("", window.location.href);

		currentUrl.search = encodedParams;

		history.pushState(validatedParams, "", currentUrl);
		setQuery((params) => ({...params, ...validatedParams }));
		window.dispatchEvent(new Event("popstate"));
	}

	onMount(() => {
		window.addEventListener("popstate", updateQueryParams, { passive: true });

		updateQueryParams();

		onCleanup(() => {
			window.removeEventListener("popstate", updateQueryParams);
		})
	});

	return [query, updateQuery, initialised] as const;
}
