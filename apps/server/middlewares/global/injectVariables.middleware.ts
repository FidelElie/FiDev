import { Middleware } from "@/configs";
import { initialiseDatabase } from "@fi/database/server";

export const injectVariablesMiddleware = Middleware(
	async (context, next) => {
		const { DATABASE_URL } = context.env;

		const Database = initialiseDatabase(DATABASE_URL);

		context.set("Database", Database);

		await next();
	},
);
