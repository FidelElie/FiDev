import { drizzle as NeonHTTPDrizzle } from "drizzle-orm/neon-http";
import { drizzle as PostgresDrizzle } from "drizzle-orm/node-postgres";

export const initialiseDatabase = (databaseUrl: string) => {
	const databaseHandle = (() => {
		if (databaseUrl.includes(".neon.")) {
			return NeonHTTPDrizzle(databaseUrl);
		}

		return PostgresDrizzle(databaseUrl);
	})();

	return databaseHandle;
};

export type Database = ReturnType<typeof initialiseDatabase>;
