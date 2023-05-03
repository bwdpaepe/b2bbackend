import Router from "koa-router";
import bestellingService from "../service/bestelling"
import authService from "../service/auth";
import validateService from "../service/validate";
import { Functions } from "../enums/Functions";
import Koa, { Next } from "koa";
import { logger } from "../server";

// GET bedrijf by 'bedrijfId'
export const getBestellingen = async (ctx: Koa.Context) => {
  ctx.body = await bestellingService.getBestellingenVanBedrijf(ctx);
};

// GET bestelling by ID
export const getBestellingById = async (ctx: Koa.Context) => {
  ctx.body = await bestellingService.getById(ctx);
};

// POST track and trace
export const getBestellingByTrackAndTrace = async (ctx: Koa.Context) => {
  ctx.body = await bestellingService.getByTrackAndTrace(ctx);
};

export default function installBestellingRoutes(app: any) {
  const router = new Router({
    prefix: "/bestellingen",
  });

  /**
   * PUBLIC ROUTES
   */
  // get bestelling by track & trace code
  // example http://localhost:9000/api/bestellingen/track-and-trace?ttc=123456789&verify=9000
  router.get("/track-and-trace", validateService.validateTrackAndTrace, getBestellingByTrackAndTrace);

  /**
   * PROTECTED ROUTES
   */
  // get all bestellingen van bedrijf van aangemelde aankoper
  router.get("/", authService.requireAuthentication, authService.checkRolePermission(Functions.AANKOPER), getBestellingen);

  // get bestelling by id
  // example http://localhost:9000/api/bestellingen/2
  router.get("/:id", authService.requireAuthentication, authService.checkRolePermission(Functions.AANKOPER), validateService.userCanAccessBestelling, getBestellingById);

  app.use(router.routes()).use(router.allowedMethods());
  logger.debug(`Installation of bestellingen Route (_bestelling.ts) completed`);
}