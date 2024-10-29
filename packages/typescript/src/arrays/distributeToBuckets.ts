export const distributeToBuckets = <T>(array: T[], numberPerBucket: number) => {
	if (!array.length) {
		return [];
	}

	return new Array(Math.ceil(array.length / numberPerBucket)).fill(null).map((_, bucketIndex) => {
		const start = bucketIndex * numberPerBucket;

		return array.slice(start, start + numberPerBucket);
	});
};

