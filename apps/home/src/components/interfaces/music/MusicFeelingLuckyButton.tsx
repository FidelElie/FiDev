import { createSignal, Show } from "solid-js";

import { AppManifest } from "@/configs";

import { request } from "@/libraries/clients";
import { astroNavigate } from "@/libraries/utilities";
import { MusicImFeelingLuckyRoute } from "@/libraries/api";

import { Button, Icon } from "@/components/core";

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
				class="flex items-center gap-2 relative"
				onClick={getFeelingLuckyPost}
				disabled={submitting()}
			>
				<div class="w-5">
					<Show
						when={submitting()}
						fallback={<Icon name="dice-three" class="text-xl text-blue-500"/>}
					>
						<Icon name="circle-notch" class="text-blue-500 animate-spin fade-in text-xl"/>
					</Show>
				</div>
				<span class="font-heading">I'm feeling lucky</span>
			</Button>
		</div>
	);
};
