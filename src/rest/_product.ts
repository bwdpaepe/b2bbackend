import Router from "koa-router";
import productService from "../service/product";
import Koa, { Next } from "koa";
import { logger } from "../server";

const checkProductEndpoint = async (ctx: Koa.Context) => {
  ctx.body = await productService.checkProductEndpoint();
};

const getAllProducts = async (ctx: Koa.Context) => {
  ctx.body = await productService.getAllProduct();
};

const getAllProductsByBedrijfId = async (ctx: Koa.Context) => {
  ctx.body = await productService.getAllProductsByBedrijfId(ctx);
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

  // GET all product
  router.get("/all", getAllProducts);

  // GET all products by 'bedrijfId'
  router.get("/find", getAllProductsByBedrijfId);

  app.use(router.routes()).use(router.allowedMethods());
  logger.debug(`Installation of Product Routes (_product.ts) completed`);
}
