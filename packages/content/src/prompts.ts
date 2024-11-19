import { input } from "@inquirer/prompts";

import { sanitiseToURLSlug } from "@fi.dev/typescript";

export const onCreatePromptWithFallback = async (name: string) => {
	const sanitizedUrl = sanitiseToURLSlug(name);

	if (!!sanitizedUrl) {
		return sanitizedUrl;
	}

	console.log(`Couldn't create a valid slug from ${name}`);

	const chosenSlug = await input({ message: `Manual slug` });

	return chosenSlug;
};

export const onCreatePrompt = async () => {
	const postSlug = await input({ message: "Enter new post slug: " });

	const cleanedSlug = await onCreatePromptWithFallback(postSlug);

	return {
		slug: cleanedSlug,
		metadata: {},
		content: [],
	};
};

export const datePrompt = async () => {
	const date = await (async () => {
		while (true) {
			const dateValue = await input({ message: "Backdate: DD-MM-YYYY" });

			const [day, month, year] = dateValue.split("-");

			try {
				if (!day || !month || !year) {
					throw new Error();
				}

				const parsedDay = parseInt(day);
				const parsedMonth = parseInt(month);
				const parsedYear = parseInt(year);

				const customDate = new Date();

				customDate.setFullYear(parsedYear, parsedMonth - 1, parsedDay);

				return customDate;
			} catch (error) {
				console.log("Sorry the date entered was invalid");
			}
		}
	})();

	return date;
};
