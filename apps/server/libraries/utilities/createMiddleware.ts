import { createMiddleware as HonoCreateMiddleware } from "hono/factory";
import { Env, MiddlewareHandler } from "hono/types";

export const createMiddleware = <BaseEnv extends Env>() => {
	return Object.assign(
		HonoCreateMiddleware<BaseEnv>,
		{
			extend: <ChildEnv extends Env>(
				middleware: MiddlewareHandler<BaseEnv & ChildEnv, string, {}>,
			) => {
				return createMiddleware<BaseEnv & ChildEnv>()(middleware);
			},
		},
	);
};
