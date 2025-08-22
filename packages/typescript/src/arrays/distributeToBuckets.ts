export const distributeToBuckets = <T>(array: T[], numberPerBucket: number) => {
	if (!array.length) {
		return [];
	}

	return Array.from(
		{ length: Math.ceil(array.length / numberPerBucket) },
		(_, bucketIndex) => {
			const start = bucketIndex * numberPerBucket;

			return array.slice(start, start + numberPerBucket);
		},
	);
};
