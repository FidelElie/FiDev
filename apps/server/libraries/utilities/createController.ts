import { Hono } from "hono";
import { HonoOptions } from "hono/hono-base";
import { BlankEnv, BlankSchema } from "hono/types";

const Controller = <BaseEnv extends BlankEnv>(
	basePath: string = "",
	options?: HonoOptions<BaseEnv> | undefined,
) => {
	const controllerRouter = new Hono<BaseEnv>(options);

	return Object.assign(
		controllerRouter,
		{
			path: basePath,
			register: () => {
				return [basePath, controllerRouter] as const;
			},
			addChild: (controller: Pick<RouterExtends<any>, "register">) => {
				controllerRouter.route(...controller.register());
			},
			extend: <ChildEnv extends BlankEnv>() => {
				return Controller<BaseEnv & ChildEnv>(basePath);
			},
		},
	);
};

export const createController = <BaseEnv extends BlankEnv>() => {
	return Controller<BaseEnv>;
};

type RouterExtends<BaseEnv extends BlankEnv> = {
	path: string;
	register: () => readonly [string, Hono<BaseEnv, BlankSchema, "/">];
	addChild: (controller: Controller<any>) => void;
	extend: <ChildEnv extends BlankEnv>() => Controller<BlankEnv & ChildEnv>;
};

type Controller<BaseEnv extends BlankEnv> =
	& Hono<BaseEnv, BlankSchema, "/">
	& RouterExtends<BlankEnv>;
