import { logger } from "hono/logger";

import { Controller } from "@/configs";

import { injectVariablesMiddleware, resolveAuthMiddleware } from "@/middlewares/global";

const IndexController = Controller();

IndexController.use(logger());

IndexController.use(injectVariablesMiddleware);

IndexController.use(resolveAuthMiddleware);

export default IndexController;
