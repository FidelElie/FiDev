/**
 *
 * @param value
 * @returns
 */
export const parseValueToString = (value: unknown) => {
	if (Array.isArray(value)) {
		return value.map(entry => entry.toString()).join(",");
	} else if (value instanceof Date) {
		return value.toISOString();
	} else if (
		value &&
		typeof value === "object" && "toString" in value &&
		typeof value.toString === "function"
	) {
		return value.toString();
	} else if (value && typeof value === "number") {
		return value.toString();
	} else if (value && typeof value === "boolean") {
		return value ? "true" : "false";
	} else {
		return String(value);
	}
}
