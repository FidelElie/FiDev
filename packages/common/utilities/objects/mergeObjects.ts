/**
 * Merge object B in to object A keeping any keys that may exist between both
 * @param objectA
 * @param objectB
 * @returns mergedObject of A and B
 */
export const mergeObjects = <ObjectA extends object, ObjectB extends object>(
	objectA: ObjectA,
	objectB: ObjectB,
): ObjectA & ObjectB => {
	return Object.fromEntries(
		Array.from(
			new Set([...Object.keys(objectA), ...Object.keys(objectB)]),
			(key) => {
				const valueA = objectA[key as keyof ObjectA];
				const valueB = objectB[key as keyof ObjectB];

				if (
					valueA &&
					typeof valueA === "object" &&
					!Array.isArray(valueA) &&
					valueB &&
					typeof valueB === "object" &&
					!Array.isArray(valueB)
				) {
					return [key, mergeObjects(valueA, valueB)];
				}

				if (valueA && !valueB) {
					return [key, valueA];
				}

				return [key, valueB];
			},
		),
	) as ObjectA & ObjectB;
};
