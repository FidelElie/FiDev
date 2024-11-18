import { createSignal } from "solid-js";
import { BsMusicNote } from 'solid-icons/bs';
import { AiOutlineLoading } from 'solid-icons/ai';

import { AppManifest } from "@/configs";

import { astroNavigate } from "@/libraries/utilities";
import { request } from "@/libraries/clients";
import { MusicImFeelingLuckyRoute } from "@/libraries/api";

import { Button } from "@/components/core";

export const MusicFeelingLuckyButton = () => {
	let buttonRef: HTMLDivElement | undefined;

	const [submitting, setSubmitting] = createSignal(false);

	const getFeelingLuckyPost = async () => {
		if (!buttonRef || submitting()) { return; }

		setSubmitting(true);
		try {
			const { url, method, responses } = MusicImFeelingLuckyRoute;

			const response = await request({ url, method });

			const validatedResponse = responses[200].parse(response);

			const pathname = AppManifest.links.pages["/music/:slug"](validatedResponse.post.slug || "");

			setTimeout(() => {
				setSubmitting(false);
				astroNavigate({ element: buttonRef, href: pathname });
			}, 1000);
		} catch (error) {
			console.error(error);
			setSubmitting(false);
		}
	}

	return (
		<div ref={buttonRef!}>
			<Button
				class="flex items-center gap-1"
				onClick={getFeelingLuckyPost}
				disabled={submitting()}
			>
				<div class="w-5 flex items-center">
					{
						!submitting() ? (
							<BsMusicNote class="text-blue-500" />
						) : (
							<AiOutlineLoading class="animate-spin text-blue-500"/>
						)
					}
				</div>
				<span class="font-heading">I'm feeling lucky</span>
			</Button>
		</div>
	)
}
