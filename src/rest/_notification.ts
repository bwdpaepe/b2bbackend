import Router from "koa-router";
import notificationService from "../service/notification";
import Koa, { Next } from "koa";
import { logger } from "../server";
import { Functions } from "../enums/Functions";
import authService from "../service/auth";

// GET rest route
const checkNotificationEndpoint = async (ctx: Koa.Context) => {
  ctx.body = await notificationService.checkNotificationEndpoint();
};

// // GET all notifications
// const getAllNotifications = async (ctx: Koa.Context) => {
//   ctx.body = await notificationService.getAllNotifications();
// };

// GET all notifications for a specific user
const getNotificationsForUser = async (ctx: Koa.Context) => {
  ctx.body = await notificationService.getNotificationsForUser(ctx);
};

// GET check if user has unread notifications
const getUnreadNotificationsCount = async (ctx: Koa.Context) => {
  ctx.body = await notificationService.getUnreadNotificationsCount(ctx);
};

export default function installNotificationRoutes(app: any) {
  const router = new Router({
    prefix: "/notifications",
  });

  /**
   * PUBLIC ROUTES
   */
  // Test van notification endpoint
  router.get("/test", checkNotificationEndpoint);

  // // GET all notifications
  // router.get("/all", getAllNotifications);

  /**
   * PROTECTED ROUTES
   */
  // GET all notifications for a specific user
  router.get(
    "/",
    authService.requireAuthentication,
    authService.checkRolePermission(Functions.AANKOPER),
    getNotificationsForUser
  );

  // GET check if user has unread notifications
  router.get(
    "/unread",
    authService.requireAuthentication,
    authService.checkRolePermission(Functions.AANKOPER),
    getUnreadNotificationsCount
  );

  app.use(router.routes()).use(router.allowedMethods());
  logger.debug(
    `Installation of Notification Routes (_notification.ts) completed`
  );
}
