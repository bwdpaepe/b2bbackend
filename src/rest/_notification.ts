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

// GET the number of unread notifications for a specific user
const getUnreadNotificationsCount = async (ctx: Koa.Context) => {
  ctx.body = await notificationService.getUnreadNotificationsCount(ctx);
};

// GET check the number of new notifications for a specific user since last check
const getNewNotificationsCount = async (ctx: Koa.Context) => {
  ctx.body = await notificationService.getNewNotificationsCountSinceLastCheck(ctx);
};

const getNotificationByID = async (ctx: Koa.Context) => {
  ctx.body = await notificationService.getNotificationByID(ctx);
};

export default function installNotificationRoutes(app: any) {
  const router = new Router({
    prefix: "/notifications",
  });

  /**
   * PUBLIC ROUTES
   */
  // Test van notification endpoint
  // example: http://localhost:9000/api/notification/test
  router.get("/test", checkNotificationEndpoint);

  // // GET all notifications
  // router.get("/all", getAllNotifications);

  /**
   * PROTECTED ROUTES
   */
  // GET all notifications for a specific user
  // this route has an OPTIONAL query parameter "limit" to limit the number of notifications
  // example: http://localhost:9000/api/notifications  (returns all notifications)
  // example: http://localhost:9000/api/notifications?limit=5  (returns the last 5 notifications)
  router.get(
    "/",
    authService.requireAuthentication,
    getNotificationsForUser
  );

  // GET check if user has unread notifications
  // example: http://localhost:9000/api/notifications/unread
  router.get(
    "/unread",
    authService.requireAuthentication,
    getUnreadNotificationsCount
  );

  // GET check the number of new notifications for a specific user since last check
  // example: http://localhost:9000/api/notifications/new
  router.get(
    "/new",
    authService.requireAuthentication,
    getNewNotificationsCount
  );

  router.get(
    "/:id",
    authService.requireAuthentication,
    getNewNotificationsCount
  );

  app.use(router.routes()).use(router.allowedMethods());
  logger.debug(
    `Installation of Notification Routes (_notification.ts) completed`
  );
}
