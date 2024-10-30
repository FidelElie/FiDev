const DEFAULT_PAGINATION_CONTEXT = {
	page: 1,
	size: 10
}

export const paginateEntries = <T>(entries: T[], context: PaginationContext) => {
	const { page, size, defaultSize } = context;

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
			previous: start !== 0,
			next: end < entries.length
		}
	}
}

type PaginationContext = {
	page?: unknown;
	size?: unknown;
	defaultSize?: number;
}
