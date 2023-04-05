import { logger } from "../server";
import Koa from "koa";
import Router from "koa-router";
import installHealthRoutes from "./_health";
import installAuthRoutes from "./_auth";
import installUserRoutes from "./_users";

/**
 * Install all routes in the given Koa application.
 */
export default (app: Koa) => {
  logger.debug(`Installation of REST routes started`);
  const router = new Router({
    prefix: "/api",
  });

  installHealthRoutes(router);
  installAuthRoutes(router);
  installUserRoutes(router);

  app.use(router.routes()).use(router.allowedMethods());
  logger.info(`Installation of all REST routes completed`);
};
