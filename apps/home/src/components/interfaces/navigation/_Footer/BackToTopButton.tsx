export const BackToTopButton = () => {
	const goToTop = () => {
		window.scrollTo({ top: 0, behavior: "smooth" })
	}

	return (
		<button id="back-to-top" class="font-heading" onClick={goToTop}>
			Back to top <span class="text-blue-500">^</span>
		</button>
	)
}
