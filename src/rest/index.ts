import { logger } from "../server";
import Koa from "koa";
import Router from "koa-router";
import installHealthRoutes from "./_health";
import installAuthRoutes from "./_auth";
import installUserRoutes from "./_users";
import installBedrijfRoutes from "./_bedrijf";
import installProfielRoutes from "./_profile";
import installNotificationRoutes from "./_notification";
import installSessionRoutes from "./_session";
import installProductRoutes from "./_product";
import installBestellingRoutes from "./_bestelling";

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
  installBedrijfRoutes(router);
  installProfielRoutes(router);
  installNotificationRoutes(router);
  installSessionRoutes(router);
  installProductRoutes(router);
  installBestellingRoutes(router);

  app.use(router.routes()).use(router.allowedMethods());
  logger.info(`Installation of all REST routes completed`);
};
