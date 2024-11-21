import { createSignal, Show } from "solid-js";

import { AppManifest } from "@/configs";

import { astroNavigate } from "@/libraries/utilities";
import { request } from "@/libraries/clients";
import { MusicImFeelingLuckyRoute } from "@/libraries/api";

import { Button } from "@/components/core";

export const MusicFeelingLuckyButton = () => {
	let buttonRef: HTMLDivElement | undefined;

	const [submitting, setSubmitting] = createSignal(false);

	const getFeelingLuckyPost = async () => {
		if (!buttonRef || submitting()) {
			return;
		}

		setSubmitting(true);
		try {
			const { url, method, responses } = MusicImFeelingLuckyRoute;

			const response = await request({ url, method });

			const validatedResponse = responses[200].parse(response);

			const pathname = AppManifest.links.pages["/music/:slug"](
				validatedResponse.post.slug || "",
			);

			setTimeout(() => {
				astroNavigate({ element: buttonRef, href: pathname });
			}, 1000);
		} catch (error) {
			console.error(error);
			setSubmitting(false);
		}
	};

	return (
		<div ref={buttonRef!}>
			<Button
				class="flex items-center gap-1 relative"
				onClick={getFeelingLuckyPost}
				disabled={submitting()}
			>
				<span class="font-heading">I'm feeling lucky</span>
				<Show when={submitting()}>
					<p class="animate-in fade-in text-xs absolute bottom-0 left-1.5 font-heading">
						Loading...
					</p>
				</Show>
			</Button>
		</div>
	);
};
