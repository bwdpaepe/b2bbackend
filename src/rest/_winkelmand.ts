import Router from "koa-router";
import bedrijfService from "../service/bedrijf";
import authService from "../service/auth"
import Koa from "koa";
import { logger } from "../server";
import winkelmandService from "../service/winkelmand"





// GET bedrijf by 'bedrijfId'
export const getWinkelmand = async (ctx: Koa.Context) => {
    ctx.body = await  winkelmandService.getWinkelmand();
  };



export default function installWinkelmandRoutes(app: any) {
    const router = new Router({
      prefix: "/winkelmand",
    });
    

    /**
     * PROTECTED ROUTES
     */

    router.get(
        "/",
        //authService.requireAuthentication,
        getWinkelmand
      );


  
    app.use(router.routes()).use(router.allowedMethods());
    logger.debug(`Installation of winkelmand Route (_winkelmand.ts) completed`);
  }