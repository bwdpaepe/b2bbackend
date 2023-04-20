import Router from "koa-router";
import bedrijfService from "../service/bedrijf";
import authService from "../service/auth"
import Koa from "koa";
import { logger } from "../server";





// GET bedrijf by 'bedrijfId'
export const getProfiel = async (ctx: Koa.Context) => {
    ctx.body = await bedrijfService.getBedrijfProfiel(ctx);
  };











export default function installProfielRoutes(app: any) {
    const router = new Router({
      prefix: "/profiel",
    });

    /**
     * PROTECTED ROUTES
     */

    router.get(
        "/",
        authService.requireAuthentication,
        getProfiel
      );


  
    app.use(router.routes()).use(router.allowedMethods());
    logger.debug(`Installation of profiel Route (_profiel.ts) completed`);
  }