import { type PromiseOrNot, mergeObjects } from "@fi.dev/typescript";
/**
 *
 * @param context
 * @returns
 */
export const request = async <T>(context: RequestContext<T>) => {
	const { interceptors } = context;

	const { url, ...fetchConfig } = await interceptors?.onRequest(context) || context;

	const request = await fetch(url, fetchConfig);

	if (!request.ok) {
		const value = request.body ? await request.json() : null;
		const message = `Request failed with status ${request.status}`;
		throw !value ? new Error(message) : new Error(
			JSON.stringify({ ...value, status: request.status, message }, null, 2)
		);
	}

	const response = request.status !== 204 ? await request.json() : null;

	await interceptors?.onResponse({ ...{ url, ...fetchConfig }, response });

	return response as T;
}

/**
 *
 * @param config
 * @returns
 */
export const createRequestClient = (config: RequestClient) => {
	const { baseUrl, interceptors, ...baseFetchConfig } = config;

	const handler = async <T>(context: RequestContext<T>) => {
		const mergedContext = mergeObjects(context, baseFetchConfig);

		const { url, ...fetchConfig } = await interceptors?.onRequest(mergedContext) || mergedContext;

		const joinedURL = new URL(context.url, baseUrl || "");

		const response = request<T>({ url: joinedURL, ...fetchConfig });

		await interceptors?.onResponse({ ...{ url: joinedURL, ...fetchConfig }, response });

		return response;
	}

	handler.baseUrl = baseUrl;

	return handler;
}

type URLPath = string | URL;

type RequestInterceptors<T> = {
	onRequest: (context: RequestInit & { url: URLPath }) => PromiseOrNot<RequestInit & {
		url: URLPath
	}>;
	onResponse: (context: RequestInit & { url: URLPath; response: T }) => PromiseOrNot<void>;
};

type RequestClient<T = unknown> = RequestInit & {
	baseUrl: URLPath;
	interceptors?: RequestInterceptors<T>;
}

type RequestContext<T> = RequestInit & {
	url: URLPath;
	interceptors?: RequestInterceptors<T>;
}
