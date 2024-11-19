import {
	createEffect,
	createSignal,
	on,
	onCleanup,
	type Accessor,
} from "solid-js";

import type { PromiseOrNot } from "@fi.dev/typescript";

const DEFAULT_DEBOUNCE_OPTIONS = {
	delay: 1000,
};

export const useOnDebounce = <T>(
	value: Accessor<T>,
	onDebounce: (newValue: T) => PromiseOrNot<void>,
	options?: UseDebounceOptions,
) => {
	const debounceOptions = { ...DEFAULT_DEBOUNCE_OPTIONS, ...(options || {}) };

	let timerHandle: NodeJS.Timeout | null = null;

	const [debouncing, setDebouncing] = createSignal(false);

	const cancelTimeout = () => {
		if (!timerHandle) {
			return;
		}

		clearTimeout(timerHandle);
	};

	createEffect(
		on(
			value,
			(newValue) => {
				cancelTimeout();
				setDebouncing(true);
				timerHandle = setTimeout(() => {
					setDebouncing(false);
					onDebounce(newValue);
				}, debounceOptions.delay);
			},
			// FIXME without this there is an infinite loop
			{ defer: true },
		),
	);

	onCleanup(() => {
		cancelTimeout();
	});

	return { debouncing, cancel: cancelTimeout };
};

type UseDebounceOptions = {
	/** The delay in milliseconds to debounce for */
	delay?: number;
};
