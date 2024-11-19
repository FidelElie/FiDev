import type { JSX } from "solid-js";

import { Link } from "@/components/core";

const BaseFooterLinkGroup = (props: FooterLinkGroupProps) => {
	return (
		<div>
			<p class="font-heading text-lg mb-2">{props.heading}</p>
			<ul class="space-y-1">{props.children}</ul>
		</div>
	);
};

export const FooterLink = (props: FooterLinkProps) => {
	return (
		<li>
			<Link href={props.href}>{props.children}</Link>
		</li>
	);
};

export const FooterLinkGroup = Object.assign(BaseFooterLinkGroup, {
	Link: FooterLink,
});

type FooterLinkProps = {
	href: string;
	children: JSX.Element;
};

export type FooterLinkGroupProps = {
	heading: string;
	children: JSX.Element;
};
