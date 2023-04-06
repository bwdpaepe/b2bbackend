import Router from "koa-router";
import authService from '../service/auth';
import Koa from "koa";
import { logger } from "../server";

// POST vanaf loginscherm
const loginValidation = async (ctx: Koa.Context) => {
  // console.log(ctx);
  ctx.body = await authService.loginValidation(ctx);
};


/**
 * Install authorisation routes in the given router.
 *
 * @param {Router} app - The parent router.
 */
export default function installAuthRoutes(app: any) {
  const router = new Router({
    prefix: "/auth",
  });

  /**
   * PUBLIC ROUTES
   */
  router.post("/login", loginValidation);

  app.use(router.routes()).use(router.allowedMethods());
  logger.debug(`Installation of Auth Routes (_auth.ts) completed`);
}
