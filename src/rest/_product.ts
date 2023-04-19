import Router from "koa-router";
import productService from "../service/product";
import Koa, { Next } from "koa";
import { logger } from "../server";

/*
 * Install users routes in the given router.
 * @param {Router} app - The parent router.
 */

export default function installProductRoutes(app: any) {
  const router = new Router({
    prefix: "/products",
  });

  const checkProductEndpoint = async (ctx: Koa.Context) => {
    ctx.body = await productService.checkProductEndpoint();
  };

  const getAllProductsByBedrijfId = async (ctx: Koa.Context) => {
    ctx.body = await productService.getAllProductsByBedrijfId(ctx);
  };

  /**
   * PUBLIC ROUTES
   */
  // Test van product endpoint
  // example http://localhost:9000/api/products/test
  router.get("/test", checkProductEndpoint);

  // GET all products by 'bedrijfId'
  // example http://localhost:9000/api/products/bedrijfId?bedrijfId=2
  router.get("/bedrijfId", getAllProductsByBedrijfId);

  app.use(router.routes()).use(router.allowedMethods());
  logger.debug(`Installation of Product Routes (_product.ts) completed`);
}
