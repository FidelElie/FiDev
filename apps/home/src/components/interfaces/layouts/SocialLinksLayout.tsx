import { twMerge } from "tailwind-merge";

import { AppManifest } from "@/configs";

import { Link, Icon } from "@/components/core";

export const SocialLinksLayout = (props: SocialLinksLayoutProps) => {
	return (
		<ul class={twMerge("flex flex-wrap gap-2.5", props.class)}>
			<li>
				<Link
					href={AppManifest.links.socials.GITHUB}
					aria-label="My Github"
					target="_blank"
				>
					<Icon
						name="github"
						class={twMerge("text-2xl text-slate-600", props.iconClass)}
					/>
				</Link>
			</li>
			<li>
				<Link
					href={AppManifest.links.socials.INSTAGRAM}
					aria-label="My Instagram"
					target="_blank"
				>
					<Icon
						name="instagram"
						class={twMerge("text-2xl text-slate-600", props.iconClass)}
					/>
				</Link>
			</li>
			<li>
				<Link
					href={AppManifest.links.socials.LINKEDIN}
					aria-label="My Linkedin"
					target="_blank"
				>
					<Icon
						name="linkedin"
						class={twMerge("text-2xl text-slate-600", props.iconClass)}
					/>
				</Link>
			</li>
			<li>
				<Link
					href={AppManifest.links.socials.SPOTIFY}
					aria-label="My Spotify"
				>
					<Icon
						name="spotify"
						class={twMerge("text-2xl text-slate-600", props.iconClass)}
					/>
				</Link>
			</li>
			<li>
				<Link
					href={`mailto:${AppManifest.links.socials.EMAIL}`}
					aria-label="Email me"
				>
					<Icon
						name="email"
						class={twMerge("text-2xl text-slate-600", props.iconClass)}
					/>
				</Link>
			</li>
		</ul>
	);
};

export type SocialLinksLayoutProps = {
	class?: string;
	iconClass?: string;
};
