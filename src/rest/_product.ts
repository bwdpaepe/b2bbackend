import Router from "koa-router";
import productService from "../service/product";
import Koa, { Next } from "koa";
import { logger } from "../server";

const checkProductEndpoint = async (ctx: Koa.Context) => {
  ctx.body = await productService.checkProductEndpoint();
};

/*
 * Install users routes in the given router.
 * @param {Router} app - The parent router.
 */

export default function installProductRoutes(app: any) {
  const router = new Router({
    prefix: "/product",
  });

  /**
   * PUBLIC ROUTES
   */
  // Test van product endpoint
  router.get("/test", checkProductEndpoint);

  app.use(router.routes()).use(router.allowedMethods());
  logger.debug(`Installation of Product Routes (_product.ts) completed`);
}
