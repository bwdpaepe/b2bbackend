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
  console.log(ctx);
  ctx.body = await bestellingService.getById(ctx);
};
// GET track and trace
export const getTrackAndTrace = async (ctx: Koa.Context) => {
  ctx.body = await bestellingService.getTrackAndTraceById(ctx);
};

// POST track and trace
export const postTrackAndTrace = async (ctx: Koa.Context) => {
  ctx.body = await bestellingService.postTrackAndTraceById(ctx);
};

export default function installBestellingRoutes(app: any) {
  const router = new Router({
    prefix: "/bestellingen",
  });

  /**
   * PROTECTED ROUTES
   */
  // get all bestellingen van bedrijf van aangemelde aankoper
  router.get("/", authService.requireAuthentication, authService.checkRolePermission(Functions.AANKOPER), getBestellingen);

  // get bestelling by id
  // example http://localhost:9000/api/bestellingen/2
  //router.get("/bestellingId", authService.requireAuthentication, getBestellingById);
  router.get("/:id", authService.requireAuthentication, authService.checkRolePermission(Functions.AANKOPER), getBestellingById);

  // get track & trace code
  // example http://localhost:9000/api/bestellingen/2/track-and-trace
  //router.get("/track-and-trace", authService.requireAuthentication, getBestellingById);
  router.get("/:id/track-and-trace", authService.requireAuthentication, authService.checkRolePermission(Functions.AANKOPER), getTrackAndTrace);

  // post track & trace code
  // example http://localhost:9000/api/bestellingen/2/track-and-trace
  //router.get("/track-and-trace", authService.requireAuthentication, getBestellingById);
  router.post("/:id/track-and-trace", authService.requireAuthentication, authService.checkRolePermission(Functions.AANKOPER), validateService.validateTrackAndTrace, postTrackAndTrace);

  app.use(router.routes()).use(router.allowedMethods());
  logger.debug(`Installation of bestellingen Route (_bestelling.ts) completed`);
}