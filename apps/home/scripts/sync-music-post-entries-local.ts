import fs from "node:fs";

import { getPostsPathsFromRootDir, matter } from "@fi.dev/content";

const syncMusicPostEntriesLocal = () => {
	const paths = getPostsPathsFromRootDir("./src/content/music").filter((path) =>
		path.includes(".md"),
	);

	for (const path of paths) {
		const output = matter.read(path);

		const extractedDate = path.split("/").at(-2);

		if (!extractedDate) {
			console.log(`Failed to extract date for path ${path} - skipping`);
			continue;
		}

		const parsedDate = new Date(extractedDate);

		const updatedFrontmatter = {
			...output.data,
			date: parsedDate.toISOString(),
		};

		const fileOutput = matter.stringify(output.content, updatedFrontmatter);

		console.log(`Writing date to path ${path}`);

		fs.writeFileSync(path, fileOutput);
	}
};

syncMusicPostEntriesLocal();
