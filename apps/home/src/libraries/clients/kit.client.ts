import { createRequestClient } from "./request.client";

const KIT_BASE_URL = "https://api.kit.com/v4";

export const createKitClient = (config: KitClientConfig) => {
	const { apiKey } = config;

	if (!apiKey) {
		throw new Error("apiKey is required to initialise Kit client");
	}

	const defaultHeaders: HeadersInit = {
		"Content-Type": "application/json",
		"Accept": "application/json",
		"X-Kit-Api-Key": apiKey
	}

	const client = createRequestClient({ baseUrl: KIT_BASE_URL, headers: defaultHeaders });

	return {
		createSubscriber: async (config: { forename: string; email: string }) => {
			const response = await client({
				url: "/subscribers",
				method: "POST",
				body: JSON.stringify({
					first_name: config.forename,
					email_address: config.email,
					state: "active",
				})
			});

			return response;
		}
	}
}

export type KitClientConfig = {
	apiKey: string;
}
