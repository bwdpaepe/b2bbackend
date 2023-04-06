import Router from "koa-router";
import healthService from "../service/health";
import Koa from "koa";
import { logger } from "../server";

const ping = async (ctx: Koa.Context) => {
  ctx.body = await healthService.ping();
};

const getVersion = async (ctx: Koa.Context) => {
  ctx.body = await healthService.getVersion();
};

/**
 * Install health routes in the given router.
 *
 * @param {Router} app - The parent router.
 */

export default function installHealthRoutes(app: any) {
  const router = new Router({
    prefix: "/health",
  });

    /**
   * PUBLIC ROUTES
   */
  router.get("/ping", ping);
  router.get("/version", getVersion);

  app.use(router.routes()).use(router.allowedMethods());
  logger.debug(`Installation of Health Routes (_health.ts) completed`);
}
