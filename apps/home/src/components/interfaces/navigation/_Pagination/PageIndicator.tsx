import { createSignal } from "solid-js";
import { AiOutlineLoading } from "solid-icons/ai";

import { useEventListener } from "@/libraries/hooks";
import { astroNavigate, type paginateEntries } from "@/libraries/utilities";

export const PageIndicator = (props: PageIndicatorProps) => {
	let containerRef: HTMLDivElement | undefined;

	const [loading, setLoading] = createSignal(false);

	useEventListener("document", "astro:page-load", () => setLoading(false), {
		passive: true,
	});

	const handlePageNavigation = (value: string) => {
		if (!containerRef) {
			return;
		}

		setLoading(true);

		const url = new URL("", window.location.href);

		url.searchParams.set("page", value);

		setTimeout(() => {
			astroNavigate({
				element: containerRef,
				href: `${url.pathname}?${url.searchParams.toString()}`,
			});
		}, 250);
	};

	return (
		<div
			ref={containerRef}
			class="relative border border-slate-200 text-blue-500 rounded-lg"
		>
			<label class="sr-only" for="page-indicator">
				Page
			</label>
			<select
				id="page-indicator"
				name="page"
				class="border-none rounded-lg"
				onchange={(event) => handlePageNavigation(event.currentTarget.value)}
			>
				{new Array(props.pagination.pages || 1).fill(null).map((_, page) => (
					<option
						value={page + 1}
						selected={String(page + 1) === String(props.currentPage)}
					>
						{page + 1}
					</option>
				))}
			</select>
			{loading() && (
				<div class="bg-white transition-all w-full h-full rounded-lg absolute top-0 flex items-center justify-center">
					<AiOutlineLoading class="text-blue-500 animate-spin text-lg" />
				</div>
			)}
		</div>
	);
};

export type PageIndicatorProps = {
	pagination: ReturnType<typeof paginateEntries>["pagination"];
	currentPage: string | number;
};
