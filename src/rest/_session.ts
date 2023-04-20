import Router from "koa-router";
import sessionService from "../service/session";
import Koa from "koa";
import { Functions } from "../enums/Functions";
import authService from "../service/auth";

// GET test route
const checkSessionEndpoint = async (ctx: Koa.Context) => {
  ctx.body = await sessionService.checkSessionEndpoint();
};

// POST user sessionEnd
const sessionEnd = async (ctx: Koa.Context) => {
  ctx.body = await sessionService.saveSessionEnd(ctx);
}

export default function installSessionRoutes(app: any) {
  const router = new Router({
    prefix: "/session",
  });

  /**
   * PUBLIC ROUTES
   */
  // Test van notification endpoint
  router.get("/test", checkSessionEndpoint);

  /**
   * PROTECTED ROUTES
   */
   // POST user sessionEnd
  router.post("/end", 
  authService.requireAuthentication, 
  authService.checkRolePermission(Functions.AANKOPER), 
  sessionEnd);

  app.use(router.routes());
  app.use(router.allowedMethods());
}