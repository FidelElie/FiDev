import { Icon } from "@/components/core";

export const BackToTopButton = () => {
	const goToTop = () => {
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	return (
		<button
			id="back-to-top"
			class="font-heading flex items-center gap-1 hover:text-blue-500 transition duration-500"
			onClick={goToTop}
		>
			Back to top <Icon name="caret-up" class="text-blue-500 text-lg" aria-label="Up"/>
		</button>
	);
};
