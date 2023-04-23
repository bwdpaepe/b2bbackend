import Router from "koa-router";
import bestellingService from "../service/bestelling"
import authService from "../service/auth";
import Koa, { Next } from "koa";
import { logger } from "../server";

// GET bedrijf by 'bedrijfId'
export const getBestellingen = async (ctx: Koa.Context) => {
  ctx.body = await bestellingService.getBestellingenVanBedrijf(ctx);
};
export default function installBestellingRoutes(app: any) {
  const router = new Router({
    prefix: "/bestellingen",
  });

  /**
   * PROTECTED ROUTES
   */

  router.get("/", authService.requireAuthentication, getBestellingen);

  app.use(router.routes()).use(router.allowedMethods());
  logger.debug(`Installation of bestellingen Route (_bestelling.ts) completed`);
}