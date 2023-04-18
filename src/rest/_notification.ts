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
const getAllNotificationsForUser = async (ctx: Koa.Context) => {
  ctx.body = await notificationService.getAllNotificationsForUser(ctx);
};

// GET check if user has unread notifications
const checkIfUserHasUnreadNotifications = async (ctx: Koa.Context) => {
  ctx.body = await notificationService.checkForUnreadNotificationsOfUser(ctx);
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
    getAllNotificationsForUser
  );

  // GET check if user has unread notifications
  router.get(
    "/new",
    authService.requireAuthentication,
    authService.checkRolePermission(Functions.AANKOPER),
    checkIfUserHasUnreadNotifications
  );

  app.use(router.routes()).use(router.allowedMethods());
  logger.debug(
    `Installation of Notification Routes (_notification.ts) completed`
  );
}
