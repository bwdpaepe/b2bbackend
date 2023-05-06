import Router from "koa-router";
import doosService from "../service/doos";
import Koa from "koa";
import { logger } from "../server";
import authService from "../service/auth";

/*
 * Install users routes in the given router.
 * @param {Router} app - The parent router.
 */

export default function installProductRoutes(app: any) {
  const router = new Router({
    prefix: "/dozen",
  });

  const checkDoosEndpoint = async (ctx: Koa.Context) => {
    ctx.body = await doosService.checkDoosEndpoint();
  };

  const getAllDoosFromBedrijf = async (ctx: Koa.Context) => {
    ctx.body = await doosService.getAllDoosFromBedrijf(ctx);
  };

  /**
   * PUBLIC ROUTES
   */
  // Test van product endpoint
  // example http://localhost:9000/api/products/test
  router.get("/test", checkDoosEndpoint);

  /**
   * PUBLIC ROUTES
   */
  // GET all dozen by 'bedrijfId' via token
  // example http://localhost:9000/api/dozen
  router.get(
    "/bedrijf/:bedrijfId",
    authService.requireAuthentication,
    getAllDoosFromBedrijf
  );

  app.use(router.routes()).use(router.allowedMethods());
  logger.debug(`Installation of Product Routes (_product.ts) completed`);
}
