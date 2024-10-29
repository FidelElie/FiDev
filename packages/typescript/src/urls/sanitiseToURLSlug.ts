const INVALID_CHARS_EXCLUSION_REGEXP = /[^A-Za-z0-9\-]+/gi;

export function sanitiseToURLSlug(fileName: string) {
	return fileName.split(" ").map(
		segment => segment.replace(INVALID_CHARS_EXCLUSION_REGEXP, '').toLowerCase() || ""
	).join("-");
}
