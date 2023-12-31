import Router from "koa-router";
import productService from "../service/product";
import Koa from "koa";
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

  const getProductByProductId = async (ctx: Koa.Context) => {
    ctx.body = await productService.getProductByProductId(ctx);
  };

  /**
   * PUBLIC ROUTES
   */
  // Test van product endpoint
  // example http://localhost:9000/api/products/test
  router.get("/test", checkProductEndpoint);

  // GET all products by 'bedrijfId'
  // example http://localhost:9000/api/products/bedrijven/1
  router.get("/bedrijven/:bedrijfId", getAllProductsByBedrijfId);

  //http://localhost:9000/api/products/12
  router.get("/:productId", getProductByProductId);

  app.use(router.routes()).use(router.allowedMethods());
  logger.debug(`Installation of Product Routes (_product.ts) completed`);
}
