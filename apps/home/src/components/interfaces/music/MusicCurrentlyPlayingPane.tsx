import {
	createEffect,
	createSignal,
	For,
	Match,
	onCleanup,
	onMount,
	Show,
	Switch,
} from "solid-js";
import { createQuery, useQueryClient } from "@tanstack/solid-query";
import { Image } from "@unpic/solid";
import { twJoin } from "tailwind-merge";

import { AppManifest } from "@/configs";

import { request } from "@/libraries/clients";
import { MusicPostMetadata } from "@/libraries/constants";
import type { SpotifyTrackObject } from "@/libraries/types";
import { GetCurrentlyPlayingTrackRoute } from "@/libraries/api/music.api";

import { Link, Passthrough, Icon, Tooltip, Popover } from "@/components/core";
import { withQueryProvider } from "@/components/providers/withQueryProvider";

type TrackState = {
	duration: number | null;
	remaining: number | null;
	playing: boolean;
};

const TRACK_STATES: TrackState = {
	duration: null,
	remaining: null,
	playing: false,
};

const currentPlayingQueryKey = [GetCurrentlyPlayingTrackRoute.url];

export const MusicCurrentlyPlayingPane = withQueryProvider(() => {
	const { responses } = GetCurrentlyPlayingTrackRoute;

	let trackDurationRef: HTMLDivElement | null;

	const [enabled, setEnabled] = createSignal(false);
	const [trackState, setTrackState] = createSignal(TRACK_STATES);

	const queryClient = useQueryClient();
	const currentPlayingQuery = createQuery(() => ({
		queryKey: currentPlayingQueryKey,
		queryFn: async () => {
			const response = await request<{ item: SpotifyTrackObject | null }>({
				url: `${GetCurrentlyPlayingTrackRoute.url}`,
			});

			return responses[200].parse(response);
		},
		refetchInterval: 1000 * 60, // 1 minute
		enabled: enabled(),
	}));

	const isLoading = () => {
		return currentPlayingQuery.isLoading || currentPlayingQuery.fetchStatus === "idle";
	}

	const trackPercentage = () => {
		const { remaining, duration } = trackState();

		return Math.min(((remaining || 0) / (duration || 1)) * 100, 100);
	};

	createEffect(() => {
		const currentTrackState = currentPlayingQuery.data ?? TRACK_STATES;

		setTrackState(currentTrackState);

		if (
			currentTrackState.playing &&
			currentPlayingQuery.data?.remaining &&
			currentPlayingQuery.data?.duration
		) {
			const songProgressInterval = setInterval(() => {
				setTrackState((data) => ({
					...data,
					remaining: !data.remaining ? data.remaining : data.remaining + 1000,
				}));
			}, 1000);
			const songEndTimeout = setTimeout(() => {
				queryClient.invalidateQueries({ queryKey: currentPlayingQueryKey });
			}, currentPlayingQuery.data?.duration -
				currentPlayingQuery.data.remaining);

			onCleanup(() => {
				clearInterval(songProgressInterval);
				clearTimeout(songEndTimeout);
			});
		}
	});

	onMount(() => {
		setEnabled(true);
	});

	return (
		<div class="border border-slate-200 rounded-lg w-full md:w-4/5">
			<div class="flex items-center p-2.5 justify-between">
				<div class="flex items-center gap-1">
					<h2 class="font-heading text-sm">what's playing?</h2>
					<Show
						when={currentPlayingQuery.data}
						fallback={
							<Show when={currentPlayingQuery.isLoading}>
								<div class="bg-slate-200 h-2 rounded w-16" />
							</Show>
						}
					>
						{(context) => (
							<div class="flex items-center gap-2 ml-2 animate-in fade-in">
								<div class="h-5 border-r border-slate-200" />
								<Tooltip
									trigger={(
										<Icon
											name="shuffle"
											class={twJoin(
												"text-xl transition",
												context().shuffled && "text-blue-500"
											)}
										/>
									)}
								>
									Shuffle
								</Tooltip>
								<Tooltip
									trigger={(
										<Icon
											name={context().repeating === "track" ? "repeat-once" : "repeat"}
											class={twJoin(
												"text-xl transition",
												context().repeating !== "off" && "text-blue-500"
											)}
										/>
									)}
								>
									Repeating {context().repeating === "track" && "Track"}
								</Tooltip>
							</div>
						)}
					</Show>
				</div>
				<Show when={currentPlayingQuery.data}>
					{
						currentlyPlaying => (
							<div class="flex items-center gap-3">
								<For each={currentlyPlaying().posts || []}>
									{(post) => (
										<Link href={AppManifest.links.pages["/music/:slug"](post.slug)} class="text-sm">
											Go to {post.type === MusicPostMetadata.types.ALBUM ? "album" : "track"} post
										</Link>
									)}
								</For>
								<Popover
									placement="bottom-end"
									trigger={
										<Icon
											name="spotify"
											class="text-xl text-slate-600"
											aria-label="Spotify-links"
										/>
									}
									contentClass="flex flex-col"
									triggerClass="border border-slate-200 rounded p-0.5"
								>
									<Link
										href={currentlyPlaying().artist.uri}
										class="no-underline py-2 px-3 flex items-center gap-1"
									>
										<Icon name="user" class="text-blue-500"/>
										Go to artist
									</Link>
									<Link
										href={currentlyPlaying().uri}
										class="no-underline py-2 px-3 flex items-center gap-1"
									>
										<Icon name="music-quaver" class="text-blue-500"/>
										Go to track
									</Link>
								</Popover>
							</div>
						)
					}
				</Show>
			</div>
			<hr class="border-slate-200 border-t" />
			<div class="p-2.5 flex gap-3 sm:items-center">
				<div class="h-20 w-20 flex-shrink-0 rounded-xl overflow-hidden border border-slate-200 flex flex-col items-center justify-center md:flex-row">
					<Switch>
						<Match when={currentPlayingQuery.isSuccess}>
							<Show
								when={currentPlayingQuery.data?.covers[0].url}
								fallback={<Icon name="cassette-tape" class="text-3xl text-blue-500"/>}
							>
								{(url) => (
									<Image
										src={url()}
										alt={currentPlayingQuery.data?.name}
										layout="fullWidth"
										class="animate-in fade-in"
									/>
								)}
							</Show>
						</Match>
						<Match when={isLoading()}>
							<Icon name='circle-notch' class="animate-spin text-blue-500 text-4xl"/>
						</Match>
					</Switch>
				</div>
				<div class="flex flex-col flex-grow">
					<Show
						when={currentPlayingQuery.isSuccess}
						fallback={
							<div class="space-y-1.5">
								<div class="bg-slate-200 rounded w-20 h-5 animate-pulse" />
								<div class="bg-slate-200 rounded-lg w-40 h-6 animate-pulse" />
								<div class="bg-slate-200 rounded w-full h-4 animate-pulse" />
							</div>
						}
					>
						<div class="flex justify-between animate-in fade-in">
							<div class="mb-1.5">
								<Show
									when={!!currentPlayingQuery.data}
									fallback={
										<p class="text-sm text-blue-500">Check back later</p>
									}
								>
									<Passthrough
										layout={(children) => (
											<a
												href={AppManifest.links.pages["/music/artists/:slug"](
													currentPlayingQuery.data?.artist.slug || "",
												)}
												class="underline underline-offset-4 decoration-blue-500"
											>
												{children}
											</a>
										)}
										disabled={!currentPlayingQuery.data?.artist.slug}
									>
										<span class="text-sm">
											{currentPlayingQuery.data?.artist.name}
										</span>
									</Passthrough>
								</Show>
								<h2 class="text-sm font-heading md:text-lg">
									{currentPlayingQuery.data?.name || "Nothing at the moment"}
								</h2>
							</div>
							<Show when={currentPlayingQuery.data}>
								<Icon name={trackState().playing ? "play" : "pause"} class="text-xl"/>
							</Show>
						</div>
						<div
							class="border border-slate-200 rounded h-4 w-full overflow-hidden p-0.5"
							ref={trackDurationRef!}
						>
							<div
								class={twJoin(
									"transition-all rounded h-full bg-blue-500 ease-in-out",
									trackPercentage() ? "opacity-100" : "opacity-0",
								)}
								style={{ width: `${trackPercentage() || 0}%` }}
							/>
						</div>
					</Show>
				</div>
			</div>
		</div>
	);
});
