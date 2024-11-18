import { decode, encode } from "qss";

export const queryParams = {
	getWindowQuery: <T extends object>() => {
		return decode<T>(window.location.search.substring(1));
	},
	decodeFromUrl: (url: string | URL) => {
		const value = url instanceof URL ? url : new URL("", url);

		return decode(value.search.substring(1));
	},
	encodeToUrl: <T extends object>(input: T) => {
		const encodedQuery =  encode(input as any);

		return encodedQuery.length ? `?${encodedQuery}` : "";
	}
}
