export const DatabaseHelpers = {
	getFirst: <T>(entries: T[]) => {
		const [firstEntry] = entries;

		return firstEntry || null;
	},
	getFirstOrThrow: <T>(entries: T[], config?: { error?: Error }) => {
		const { error } = config || {};

		const [firstEntry] = entries;

		if (!firstEntry) {
			throw error || new Error("Entry not found");
		}

		return firstEntry;
	},
	exists: <T extends unknown>(entries: T[]) => {
		const [firstEntry] = entries;

		return !!firstEntry;
	},
};
