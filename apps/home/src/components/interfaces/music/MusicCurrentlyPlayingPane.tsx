import { createEffect, createSignal, For, Match, onCleanup, onMount, Show, Switch } from "solid-js";
import { createQuery, useQueryClient } from "@tanstack/solid-query";
import { Image } from "@unpic/solid";
import { twJoin } from "tailwind-merge";

import { AppManifest } from "@/configs";

import { BiSolidAlbum } from "solid-icons/bi";
import { AiOutlineLoading } from 'solid-icons/ai';
import { FiMusic } from "solid-icons/fi";

import { request } from "@/libraries/clients";
import { MusicPostMetadata } from "@/libraries/constants";
import { generateSpotifyURI } from "@/libraries/utilities";
import type { SpotifyTrackObject } from "@/libraries/types";
import { GetCurrentlyPlayingTrackRoute } from "@/libraries/api/music.api";

import { Passthrough, Tooltip } from "@/components/core";
import { withQueryProvider } from "@/components/providers/withQueryProvider";

type TrackState = { duration: number | null; remaining: number | null; playing: boolean; }

const TRACK_STATES: TrackState = {
	duration: null,
	remaining: null,
	playing: false,
}

const currentPlayingQueryKey = [GetCurrentlyPlayingTrackRoute.url];

export const MusicCurrentlyPlayingPane = withQueryProvider(() => {
	const { responses } = GetCurrentlyPlayingTrackRoute;

	let trackDurationRef: HTMLDivElement | null;

	const [enabled, setEnabled] = createSignal(false);
	const [trackState, setTrackState] = createSignal(TRACK_STATES);

	const queryClient = useQueryClient();
	const currentPlayingQuery = createQuery(
		() => ({
			queryKey: currentPlayingQueryKey,
			queryFn: async () => {
				const response = await request<{ item: SpotifyTrackObject | null }>({
					url: `${GetCurrentlyPlayingTrackRoute.url}`
				});

				return responses[200].parse(response);
			},
			refetchInterval: 1000 * 60, // 1 minute
			enabled: enabled()
		}),
	);

	const trackPercentage = () => {
		const { remaining, duration } = trackState();

		return Math.min(((remaining || 0) / (duration || 1)) * 100, 100);
	}

	createEffect(() => {
		const currentTrackState = currentPlayingQuery.data ?? TRACK_STATES;

		setTrackState(currentTrackState);

		if (
			currentTrackState.playing &&
			currentPlayingQuery.data?.remaining &&
			currentPlayingQuery.data?.duration
		) {
			const songProgressInterval = setInterval(
				() => {
					setTrackState(data => ({
						...data,
						remaining: !data.remaining ? data.remaining : data.remaining + 1000
					}));
				},
				1000
			);
			const songEndTimeout = setTimeout(
				() => {
					queryClient.invalidateQueries({ queryKey: currentPlayingQueryKey })
				},
				currentPlayingQuery.data?.duration - currentPlayingQuery.data.remaining
			);

			onCleanup(() => {
				clearInterval(songProgressInterval);
				clearTimeout(songEndTimeout)
			});
		}
	});

	onMount(() => { setEnabled(true); });

	return (
		<div class="border border-slate-200 rounded-lg w-full md:w-4/5 min-h-40">
			<div class="flex items-center p-2.5 justify-between">
				<div class="flex items-center gap-1">
					<a
						href={generateSpotifyURI(AppManifest.links.socials.SPOTIFY)}
						aria-label="My Spotify profile"
						class="underline underline-offset-4 decoration-green-600"
					>
						Spotify
					</a>
					<h2 class="font-heading">what's playing?</h2>
					<Show
						when={currentPlayingQuery.data}
						fallback={(
							<Show when={currentPlayingQuery.isLoading}>
								<div class="bg-slate-200 h-2 rounded w-16"/>
							</Show>
						)}
					>
						{
							context => (
								<div class="flex items-center gap-2 ml-2">
									<div class="h-5 border-r border-slate-200"/>
									<span
										class={twJoin(
											"transition-all font-heading text-sm",
											context().shuffled && "text-blue-500"
										)}
									>
										Shuffling
									</span>
									<span
										class={twJoin(
											"transition-all font-heading text-sm",
											context().repeating && "text-blue-500"
										)}
									>
										Repeating
									</span>
								</div>
							)
						}
					</Show>
				</div>
				<Show when={!!currentPlayingQuery.data?.posts.length}>
					<div class="flex gap-4">
						<For each={currentPlayingQuery.data?.posts || []}>
							{ post => (
								<Tooltip
									triggerAs="span"
									trigger={(
										<a
											href={`/music/${post.slug}`}
											class="text-sm flex items-center justify-center bg-blue rounded h-5 w-5 bg-blue-500"
										>
											{
												post.type === MusicPostMetadata.types.ALBUM ?
													<BiSolidAlbum class="text-white text-xs" /> :
													<FiMusic class="text-white text-xs"/>
											}
										</a>
									)}
									contentClass="p-1.5"
								>
									Go to post
								</Tooltip>
							)}
						</For>
					</div>
				</Show>
			</div>
			<hr class="border-slate-200 border-t"/>
			<div class="p-2.5 flex items-center gap-3">
				<div
					class="h-20 w-20 rounded-xl overflow-hidden border border-slate-200 flex items-center justify-center"
				>
					<Switch>
						<Match when={currentPlayingQuery.isSuccess}>
							<Show
								when={currentPlayingQuery.data?.covers[0].url}
								fallback={<BiSolidAlbum class="text-slate-300 text-3xl" />}
							>
								{
									url => (
										<Image
											src={url()}
											alt={currentPlayingQuery.data?.name}
											layout="fullWidth"
											{
												...{ style: {
													"view-transition-name": currentPlayingQuery.data?.posts[0]?.slug
												}}
											}
										/>
									)
								}
							</Show>
						</Match>
						<Match when={currentPlayingQuery.isLoading}>
							<AiOutlineLoading class="animate-spin text-2xl text-blue-500"/>
						</Match>
					</Switch>
				</div>
				<div class="flex flex-col flex-grow">
					<Show
						when={currentPlayingQuery.isSuccess}
						fallback={(
							<div class="space-y-1.5">
								<div class="bg-slate-200 rounded w-20 h-5 animate-pulse"/>
								<div class="bg-slate-200 rounded-lg w-40 h-6 animate-pulse"/>
								<div class="bg-slate-200 rounded w-full h-4 animate-pulse"/>
							</div>
						)}
					>
						<div class="flex justify-between">
							<div class="mb-1.5 truncate">
								<Show
									when={!!currentPlayingQuery.data}
									fallback={<p class="text-sm text-blue-500">Check back later</p>}
								>
									<Passthrough
										layout={children => (
											<a
												href={`/music/artists/${currentPlayingQuery.data?.artist.slug}`}
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
								<h2 class="font-heading text-lg">
									{currentPlayingQuery.data?.name || "Nothing is playing at the moment"}
								</h2>
							</div>
							<Show when={currentPlayingQuery.data}>
								<Tooltip
									triggerAs="div"
									triggerClass="h-min text-sm"
									contentClass="px-2 py-1.5"
									trigger={(
										<Show when={trackState().playing} fallback="Paused">
											Playing
										</Show>
									)}
								>
									{trackState().playing ? "Playing" : "Paused"}
								</Tooltip>
							</Show>
						</div>
						<div
							class="border border-slate-200 rounded h-4 w-full overflow-hidden p-0.5"
							ref={trackDurationRef!}
						>
							<div
								class={twJoin("transition-all rounded h-full bg-blue-500 ease-in-out", trackPercentage() ? "opacity-100" : "opacity-0")}
								style={{ width: `${trackPercentage() || 0}%` }}
							/>
						</div>
					</Show>
				</div>
			</div>
		</div>
	)
});
