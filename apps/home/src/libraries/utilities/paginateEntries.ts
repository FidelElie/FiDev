const DEFAULT_PAGINATION_CONTEXT = {
	page: 1,
	size: 10
}

export const paginateEntries = <T>(entries: T[], context: PaginationContext) => {
	const { page, size, url, defaultSize } = context;

	const parsedUrl = url ? new URL("", url) : null;

	const generatePaginatedURL = (url: URL, page: number) => {
		if (page === 1) {
			url.searchParams.delete("page");
		} else {
			url.searchParams.set("page", String(page));
		}

		return url.toString()
	}

	const parsedPage = page ? parseInt(String(page), 10) : DEFAULT_PAGINATION_CONTEXT.page;
	const parsedSize = size ? parseInt(String(size), 10) : defaultSize || DEFAULT_PAGINATION_CONTEXT.size;

	const pages = Math.ceil(entries.length / parsedSize);

	const normalisedPage = Math.max(parsedPage - 1, 0);

	const start = normalisedPage * parsedSize;
	const end = start + parsedSize;
	const total = entries.length;

	return {
		items: entries.slice(start, end),
		pagination: {
			page: parsedPage,
			entries: parsedSize,
			total,
			pages,
			...(parsedUrl ? {
				...(start !== 0 ? {
					first: generatePaginatedURL(parsedUrl, 1),
					previous: generatePaginatedURL(parsedUrl, parsedPage - 1)
				} : {}),
				...(end < entries.length ? {
					next: generatePaginatedURL(parsedUrl, parsedPage + 1),
					last: generatePaginatedURL(parsedUrl, pages)
				} : {})
			} : {})
		}
	}
}

type PaginationContext = {
	page?: unknown;
	size?: unknown;
	defaultSize?: number;
	/**
	 * This will allow the function to generate next and previous urls
	 */
	url?: string;
}
