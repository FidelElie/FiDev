/**
 * Type assert an object to its literal key values
 * @description Helpful for passing object as const to z.enum
 * @param object
 * @returns array of typed literal strings
 */
export function getConstValues<T extends Record<string, unknown>>(object: T) {
	return Object.values(object) as [(typeof object)[keyof T]];
}

/**
 * Type assert an object to its literal object keys
 * @description Helpful for passing object as const to z.enum
 * @param object
 * @returns array of typed literal strings
 */
export function getConstKeys<T extends Record<string, unknown>>(object: T) {
	return Object.keys(object) as [keyof T];
}
