import { ContentConfig } from "../types";

export const syncContentCommand = (context: {
	config: ContentConfig;
	filter?: string;
}) => {
	const { config, filter } = context;

	const chosenPostFilter = (() => {
		if (filter) {
			return filter;
		}

		if (config.entries.length === 1) {
			return config.entries[0].id;
		}

		return null;
	})();

	const ids = chosenPostFilter
		? [chosenPostFilter]
		: config.entries.map((entryPath) => entryPath.id);
};
