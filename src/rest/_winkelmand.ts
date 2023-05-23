import Router from "koa-router";
import authService from "../service/auth";
import Koa from "koa";
import { logger } from "../server";
import winkelmandService from "../service/winkelmand";

// GET winkelmand van ingelogde gebruiker
export const getWinkelmand = async (ctx: Koa.Context) => {
  ctx.body = await winkelmandService.getWinkelmand(ctx);
};

export const seedWinkelmandOpAankopers = async (ctx: Koa.Context) => {
  await winkelmandService.seedWinkelmandOpAankopers();
};

export const addEditProduct = async (ctx: Koa.Context) => {
  await winkelmandService.addEditProduct(ctx);
};

export const deleteProduct = async (ctx: Koa.Context) => {
  await winkelmandService.deleteProduct(ctx);
};

export default function installWinkelmandRoutes(app: any) {
  const router = new Router({
    prefix: "/winkelmand",
  });

  /**
   * PROTECTED ROUTES
   */

  router.get("/", authService.requireAuthentication, getWinkelmand);

  router.put(
    "/seed",
    //authService.requireAuthentication,
    seedWinkelmandOpAankopers
  );

  router.put(
    "/addProduct/:product_id/:aantal",
    authService.requireAuthentication,
    addEditProduct
  );

  router.delete(
    "/deleteProduct/:product_id",
    authService.requireAuthentication,
    deleteProduct
  );

  app.use(router.routes()).use(router.allowedMethods());
  logger.debug(`Installation of winkelmand Route (_winkelmand.ts) completed`);
}
