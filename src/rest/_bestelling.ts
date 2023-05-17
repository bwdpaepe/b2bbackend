import Router from "koa-router";
import bestellingService from "../service/bestelling";
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

// GET track and trace
export const getBestellingByTrackAndTrace = async (ctx: Koa.Context) => {
  ctx.body = await bestellingService.getByTrackAndTrace(ctx);
};

// GET track and trace
export const getVerificatieByTrackAndTrace = async (ctx: Koa.Context) => {
  ctx.body = await bestellingService.getVerificatieByTrackAndTrace(ctx);
};
// POST bestelling
export const postBestelling = async (ctx: Koa.Context) => {
  ctx.body = await bestellingService.postBestelling(ctx);
};
// PUT bestelling
export const updateBestelling = async (ctx: Koa.Context) => {
  ctx.body = await bestellingService.updateBestelling(ctx);
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
  router.get(
    "/track-and-trace",
    validateService.validateTrackAndTrace,
    getBestellingByTrackAndTrace
  );

  // get bestelling verificatie by track & trace code
  // example http://localhost:9000/api/bestellingen/track-and-trace?ttc=123456789
  router.get("/verificatie", getVerificatieByTrackAndTrace);

  /**
   * PROTECTED ROUTES
   */
  // get all bestellingen van bedrijf van aangemelde aankoper
  router.get("/", authService.requireAuthentication, getBestellingen);

  // get bestelling by id
  // example http://localhost:9000/api/bestellingen/2
  router.get(
    "/:id",
    authService.requireAuthentication,
    validateService.userCanAccessBestelling,
    getBestellingById
  );

  // post bestelling
  // example: http://localhost:9000/api/bestellingen?leverancierbedrijfId=3&doosId=8&leveradresStraat=test_straat&leveradresNummer=test_nummer&leveradresPostcode=test_postcode&leveradresStad=test_stad&leveradresLand=test_land
  router.post("/", authService.requireAuthentication, postBestelling);

  // update geplaatste bestelling: wijzig leveradres en verpakking
  // todo validate status (from id), leveradres, verpakking
  router.put(
    "/update/:id",
    authService.requireAuthentication,
    //validateService.validateBestellingUpdate,
    updateBestelling
  );

  app.use(router.routes()).use(router.allowedMethods());
  logger.debug(`Installation of bestellingen Route (_bestelling.ts) completed`);
}
