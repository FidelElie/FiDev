import type { SessionModel, UserModel } from "@fi/database";
import type { Database } from "@fi/database/server";

import { createController, createMiddleware } from "@/libraries/utilities";

export type EnvironmentContext = {
	Bindings: {
		AUTH_SECRET: string;
		DATABASE_URL: string;
		WORKER_ENV?: "production" | "development";
	};
	Variables: {
		Database: Database;
		User: typeof UserModel["$inferSelect"] | null;
		Session: typeof SessionModel["$inferSelect"] | null;
		SessionID?: string;
	};
};

export const Controller = createController<EnvironmentContext>();

export const Middleware = createMiddleware<EnvironmentContext>();
