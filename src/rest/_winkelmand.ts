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

export const seedWinkelmandOpAankopers = async(ctx: Koa.Context) => {
  await winkelmandService.seedWinkelmandOpAankopers();
 
  
  ctx.body = "succeeded"
}

export const testAddProduct = async(ctx: Koa.Context) => {
  await winkelmandService.testAddProduct(ctx);

  ctx.body = "succeeded"

}



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

      router.put(
        "/seed",
        //authService.requireAuthentication,
        seedWinkelmandOpAankopers
      );

      router.put(
        "/addProduct",
        //authService.requireAuthentication,
        testAddProduct
      );



  
    app.use(router.routes()).use(router.allowedMethods());
    logger.debug(`Installation of winkelmand Route (_winkelmand.ts) completed`);
  }