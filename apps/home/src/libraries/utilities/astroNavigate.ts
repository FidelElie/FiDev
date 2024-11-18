export const astroNavigate = (context: { element: HTMLElement; href: string }) => {
	const { element, href } = context;

	const anchor = document.createElement("a");

	anchor.href = href;
	anchor.className = "sr-only";

	element.append(anchor);

	anchor.click();
}
