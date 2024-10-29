export const BackToTopButton = () => {
	const goToTop = () => {
		window.scrollTo({ top: 0, behavior: "smooth" })
	}

	return (
		<button id="back-to-top" onClick={goToTop}>
			Back to top
		</button>
	)
}
