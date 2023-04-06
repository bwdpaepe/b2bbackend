import Router from "koa-router";
import bedrijfService from "../service/bedrijf";
import Koa, { Next } from "koa";
import { logger } from "../server";

// GET rest route
const checkBedrijfEndpoint = async (ctx: Koa.Context) => {
  ctx.body = await bedrijfService.checkBedrijfEndpoint();
};

// GET all users
const getAllBedrijf = async (ctx: Koa.Context) => {
  ctx.body = await bedrijfService.getAllBedrijf();
};

// GET bedrijf by 'bedrijfId'
export const getBedrijfById = async (ctx: Koa.Context) => {
  ctx.body = await bedrijfService.getBedrijfById(ctx);
};


/**
 * Install users routes in the given router.
 * @param {Router} app - The parent router.
 */

export default function installBedrijfRoutes(app: any) {
  const router = new Router({
    prefix: "/bedrijf",
  });

  /**
   * PUBLIC ROUTES
   */
  // Test van bedrijf endpoint
  router.get("/test", checkBedrijfEndpoint);

  /**
   * PROTECTED ROUTES
   */
  
  // GET all bedrijf 
  router.get(
    "/all",
    // authService.requireAuthentication,
    getAllBedrijf
  );

  
  // GET bedrijf by 'bedrijfId'
  router.get(
    "/find",
    // authService.requireAuthentication,
    // authService.checkRolePermission(Roles.USERADMIN),
    getBedrijfById
  );

  app.use(router.routes()).use(router.allowedMethods());
  logger.debug(`Installation of Bedrijf Routes (_bedrijf.ts) completed`);
}
