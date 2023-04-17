import Router from "koa-router";
import notificationService from "../service/notification";
import Koa, { Next } from "koa";
import { logger } from "../server";

// GET rest route
const checkNotificationEndpoint = async (ctx: Koa.Context) => {
  ctx.body = await notificationService.checkNotificationEndpoint();
};

// GET all notifications
const getAllNotifications = async (ctx: Koa.Context) => {
  ctx.body = await notificationService.getAllNotifications();
};

export default function installNotificationRoutes(app: any) {
  const router = new Router({
    prefix: "/notification",
  });

  /**
   * PUBLIC ROUTES
   */
  // Test van notification endpoint
  router.get("/test", checkNotificationEndpoint);

  // GET all notifications
  router.get("/all", getAllNotifications);

  app.use(router.routes()).use(router.allowedMethods());
  logger.debug(`Installation of Notification Routes (_notification.ts) completed`);
}