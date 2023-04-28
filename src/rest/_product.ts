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

  const getProductById = async (ctx: Koa.Context) => {
    ctx.body = await productService.getProductById(ctx);
  };

  const getAllProductByBedrijfIdAndProductId = async (ctx: Koa.Context) => {
    ctx.body = await productService.getAllProductByBedrijfIdAndProductId(ctx);
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

  //GET product by 'productId'
  // example http://localhost:9000/api/products/productId?productId=2
  router.get("/productId", getProductById);

  //GET product by 'productId' and 'bedrijfId'
  // example http://localhost:9000/api/products/productIdBedrijfId?productId=2&bedrijfId=2
  router.get("/productIdBedrijfId", getAllProductByBedrijfIdAndProductId);

  app.use(router.routes()).use(router.allowedMethods());
  logger.debug(`Installation of Product Routes (_product.ts) completed`);
}
