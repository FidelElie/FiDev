import { onCleanup, onMount } from "solid-js";

export const useEventListener = <EventType extends keyof DocumentEventMap>(
	target: "window" | "document" | HTMLElement,
	event: EventType,
	onEvent: (event: Event) => void,
	options?: boolean | AddEventListenerOptions,
) => {
	onMount(() => {
		const resolvedTarget = (() => {
			switch (target) {
				case "window":
					return window;
				case "document":
					return document;
				default:
					return target;
			}
		})();

		resolvedTarget.addEventListener(event, onEvent, options);

		onCleanup(() => {
			resolvedTarget.removeEventListener(event, onEvent);
		});
	});
};
