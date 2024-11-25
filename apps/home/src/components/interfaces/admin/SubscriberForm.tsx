import { createSignal, onCleanup, Show, type JSX } from "solid-js";
import { createMutation } from "@tanstack/solid-query";
import { Image } from "@unpic/solid";

import { TheHavanaStreetsJPG } from "@/assets";

import { request } from "@/libraries/clients";
import type { InferDTOS } from "@/libraries/types";
import { SubscribeToWebsiteRoute } from "@/libraries/api";

import { withQueryProvider } from "@/components/providers";
import { twMerge } from "tailwind-merge";
import { Button, Icon } from "@/components/core";

const INITIAL_FIELDS = { forename: "", email: "" };

export const SubscriberForm = withQueryProvider(
	(props: SubscriberFormProps) => {
		let honeypotField: HTMLInputElement | null;
		let successTimer: NodeJS.Timeout | null;

		const [fields, setFields] = createSignal(INITIAL_FIELDS);
		const [successfulSubmission, setSuccessfulSubmission] = createSignal(false);

		const editFields = (data: Partial<typeof INITIAL_FIELDS>) => {
			setFields((currentFields) => ({ ...currentFields, ...data }));
		};

		const createSubscriberMutation = createMutation(() => ({
			mutationFn: async (
				context: InferDTOS<typeof SubscribeToWebsiteRoute.dtos>,
			) => {
				await request({
					url: SubscribeToWebsiteRoute.url,
					method: SubscribeToWebsiteRoute.method,
					body: JSON.stringify(context.body),
				});
			},
			onSuccess: () => {
				setSuccessfulSubmission(true);
				successTimer = setTimeout(() => setSuccessfulSubmission(false), 1500);
			},
		}));

		const handleSubmission: JSX.EventHandler<HTMLFormElement, SubmitEvent> = (
			event,
		) => {
			event.preventDefault();

			const currentFields = fields();

			if (!!honeypotField?.value) {
				return;
			}

			if (!currentFields.email || !currentFields.forename) {
				return;
			}

			createSubscriberMutation.mutate({ body: currentFields });
		};

		onCleanup(() => {
			if (successTimer) {
				clearTimeout(successTimer);
			}
		});

		return (
			<form
				class={twMerge(
					"border border-slate-200 rounded-lg flex flex-col gap-2 overflow-hidden sm:flex-row",
					props.class,
				)}
				onSubmit={handleSubmission}
			>
				<div class="w-full h-28 sm:h-auto sm:w-1/4">
					<Image
						src={TheHavanaStreetsJPG.src}
						class="w-full h-full object-cover"
						layout="fullWidth"
					/>
				</div>
				<div class="p-5 flex-grow">
					<div>
						<h2 class="font-heading text-xl sm:text-3xl">
							Keep up to date with goings on
						</h2>
						<h3 class="text-blue-500 sm:text-lg">
							Subscribe to the mailing list
						</h3>
					</div>
					<div class="space-y-2 my-3">
						<div class="border border-slate-200 rounded-lg flex items-center">
							<label for="forename" class="sr-only">
								First name
							</label>
							<input
								id="forename"
								name="forename"
								type="text"
								class="border-none flex-grow rounded-lg"
								placeholder="Your first name"
								value={fields().forename}
								onInput={(event) =>
									editFields({ forename: event.currentTarget.value })
								}
								required
							/>
						</div>
						<div class="border border-slate-200 rounded-lg flex items-center">
							<label for="email-address" class="sr-only">
								Email address
							</label>
							<input
								id="email-address"
								name="email-address"
								type="email"
								class="border-none flex-grow rounded-lg"
								placeholder="Your email address"
								value={fields().email}
								onInput={(event) =>
									editFields({ email: event.currentTarget.value })
								}
								required
							/>
						</div>
						<input
							ref={honeypotField!}
							type="text"
							id="info"
							name="info"
							class="hidden"
							autocomplete="off"
						/>
					</div>
					<div class="flex items-center gap-3">
						<Button
							type="submit"
							class="flex items-center gap-1.5 disabled:opacity-50"
							disabled={createSubscriberMutation.isPending || true}
						>
							Coming Soon
							{/* Subscribe */}
							<Show
								when={!createSubscriberMutation.isPending}
								fallback={
									<Icon
										name="circle-notch"
										class="text-blue-500 text-xl animate-spin"
									/>
								}
							>
								<Icon name="paper-plane" class="text-blue-500 text-xl" />
							</Show>
						</Button>
						<Show when={successfulSubmission()}>
							<p class="font-heading font-light animate-in fade-in">
								Thank you for subscribing!
							</p>
						</Show>
					</div>
				</div>
			</form>
		);
	},
);

export type SubscriberFormProps = {
	class?: string;
};
