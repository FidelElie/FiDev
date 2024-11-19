export const distributeInRandomOrder = <T>(array: T[], number?: number) => {
	const distributionLength = !number ? array.length : number;

	const copiedSnapshot = Array.from(array);

	const distributedArray = new Array(distributionLength)
		.fill(null)
		.map(() => {
			const normalisedSeed =
				Math.ceil(Math.random() * copiedSnapshot.length) - 1;

			const chosenEntry = copiedSnapshot.at(normalisedSeed);

			copiedSnapshot.splice(normalisedSeed, 1);

			if (!chosenEntry) {
				return [];
			}

			return chosenEntry;
		})
		.flat();

	return distributedArray;
};
