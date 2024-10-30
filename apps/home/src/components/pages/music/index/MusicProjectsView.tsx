import { createSignal, For, onMount, Show } from "solid-js";
import { AiOutlineLoading } from 'solid-icons/ai';
import { twJoin } from "tailwind-merge";
import { createIntersectionObserver } from "@solid-primitives/intersection-observer";

import type { MusicPostSchema } from "@/libraries/schemas";

import { MusicProjectLink } from "@/components/interfaces";
import type { paginateEntries } from "@/libraries/utilities";
import { DevCode } from "@/components/core";
import { request } from "@/libraries/clients";

export const MusicProjectsView = (props: MusicProjectsViewProps) => {
	const [targets, setTargets] = createSignal<Element[]>([]);
	const [currentPosts, setCurrentPosts] = createSignal(props.posts || []);
	const [pagination, setPagination] = createSignal(props.pagination || {
		page: 1,
		next: null,
		previous: null
	});
	const [loading, setLoading] = createSignal(false);
	const [defer, setDefer] = createSignal(true);

	const fetchNewPosts = async () => {
		setLoading(true);

		const params = new URLSearchParams();

		const newPage = pagination().page + 1;

		params.set("page", String(newPage));

		setPagination(currentPagination => ({ ...currentPagination, page: newPage }));

		const response = await request<any>({ url: `/api/music?${params.toString()}` });

		setTimeout(
			() => {
				setCurrentPosts(posts => [...posts, ...response.items]);
				setPagination(response.pagination);
				setLoading(false);
			},
			500
		);
	}

	createIntersectionObserver(targets, entries => {
		entries.forEach(element => {
			if (element.isIntersecting) { fetchNewPosts(); }
		})
	});

	onMount(() => {
		setDefer(false);
	});

	return (
		<div class="flex flex-col items-center space-y-10">
			<DevCode>{pagination()}</DevCode>
			<div class="grid grid-flow-row grid-cols-1 item md:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-10 w-full">
				<For
					each={currentPosts()}
					fallback={(
						<div>
							<h1 class="text-4xl font-heading">No posts found</h1>
						</div>
					)}
				>
					{ post => <MusicProjectLink post={post} defer={defer()}/> }
				</For>
			</div>
			<hr
				class="border-t border-slate-200 w-full"
				ref={element => setTargets(currentTargets => [...currentTargets, element])}
			/>
			<Show when={loading()}>
				<AiOutlineLoading class="text-blue-500 animate-spin text-2xl"/>
			</Show>
			<Show when={!loading() && !pagination().next}>
				<p class="font-heading">No more posts</p>
			</Show>
		</div>
	)
}

export type MusicProjectsViewProps = {
	posts?: MusicPostSchema[];
	pagination?: ReturnType<typeof paginateEntries>["pagination"];
}
