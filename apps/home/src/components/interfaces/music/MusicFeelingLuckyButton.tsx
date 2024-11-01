import { createSignal } from "solid-js";
import { BsMusicNote } from 'solid-icons/bs';
import { AiOutlineLoading } from 'solid-icons/ai';

import { astroNavigate } from "@/libraries/utilities";
import { request } from "@/libraries/clients";
import { MusicImFeelingLuckyRoute } from "@/libraries/api";

export const MusicFeelingLuckyButton = () => {
	let buttonRef: HTMLDivElement | undefined;

	const [submitting, setSubmitting] = createSignal(false);

	const getFeelingLuckyPost = async () => {
		if (!buttonRef) { return; }

		setSubmitting(true);
		try {
			const { url, method, responses } = MusicImFeelingLuckyRoute;

			const response = await request({ url, method });

			const validatedResponse = responses[200].parse(response);

			const pathname = `/music/${validatedResponse.post.slug}`;

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
			<button
				class="bg-blue-500 rounded px-3 py-2 flex items-center gap-1 disabled:opacity-50"
				onClick={getFeelingLuckyPost}
				disabled={submitting()}
			>
				<div class="w-5 flex items-center">
					{
						!submitting() ? (
							<BsMusicNote class="text-white" />
						) : (
							<AiOutlineLoading class="text-white animate-spin"/>
						)
					}
				</div>
				<span class="font-heading font-light text-white">I'm feeling lucky</span>
			</button>
		</div>
	)
}
