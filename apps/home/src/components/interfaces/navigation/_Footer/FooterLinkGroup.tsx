import type { JSX } from "solid-js";

const BaseFooterLinkGroup = (props: FooterLinkGroupProps) => {
	return (
		<div>
			<p class="font-heading text-lg mb-2">{props.heading}</p>
			<ul class="space-y-1">
				{props.children}
			</ul>
		</div>
	)
}

export const FooterLink = (props: FooterLinkProps) => {
	return (
		<li>
			<a href={props.href} class="underline decoration-blue-500 underline-offset-2">
				{props.children}
			</a>
		</li>
	)
}


export const FooterLinkGroup = Object.assign(
	BaseFooterLinkGroup,
	{
		Link: FooterLink
	}
);

type FooterLinkProps = {
	href: string;
	children: JSX.Element;
}

export type FooterLinkGroupProps = {
	heading: string;
	children: JSX.Element;
}
