import Koa from "koa";
import { logger } from "../server";
import { AppDataSource } from "../data-source";
import { Notification } from "../entity/Notification";
import authService from "./auth";
import { User } from "../entity/User";
import { Functions } from "../enums/Functions";
import { BestellingStatus } from "../enums/BestellingStatusEnum";

interface NotificationListEntry {
  notificationID: number;
  isRead: boolean;
  bestellingId: number;
  orderId: string;
  bestellingStatus: BestellingStatus;
}

const debugLog = (message: any, meta = {}) => {
  logger.debug(message);
};

// Ophalen repository
const notificationRepository = AppDataSource.getRepository(Notification);

/**
 * Check if the endpoint /api/notification/ is available.
 */
const checkNotificationEndpoint = async () => {
  debugLog("GET notification endpoint called");
  return "Notification endpoint is available";
};

/**
 * Get list of all notifications.
 * TESTROUTE -> TODO: VERWIJDEREN
 */
// const getAllNotifications = async () => {
//   debugLog("GET list of all notifications");
//   const notifications = await notificationRepository.find({
//     relations: [
//       "aankoper",
//       "aankoper.bedrijf",
//       "bestelling",
//       "bestelling.leverancierBedrijf",
//       "bestelling.klantBedrijf",
//     ],
//   });

//   const response = notifications.map((notification) => ({
//     ...notification,
//     bestelling: {
//       ...notification.bestelling,
//       status: notification.bestelling.getStatusDescription(),
//     },
//   }));

//   return response;
// };

/**
 * GET list of all notifications for a specific user.
 */
const getAllNotificationsForUser = async (ctx: Koa.Context) => {
  try {
    const JWTUserInfo = await authService.checkAndParseSession(
      ctx.headers.authorization
    );
    const JWTuserId = JWTUserInfo.userId;
    debugLog(
      "GET list of all notifications for a specific user with id: " + JWTuserId
    );

    const results = await notificationRepository
      .createQueryBuilder("n")
      .select([
        "n.ID as notificationID",
        "n.ISBEKENEN as isRead",
        "b.ID as bestellingId",
        "b.ORDERID as orderId",
        "b.STATUS as bestellingStatus",
      ])
      .innerJoin("n.bestelling", "b")
      .where("b.Medewerker = :userId", { userId: JWTuserId })
      .getRawMany<NotificationListEntry>();

    if (!results || results.length === 0) {
      debugLog("No notifications found for user with userId " + JWTuserId);
      return (ctx.status = 204), (ctx.body = {error: "No notifications found for user with userId " + JWTuserId});
    }

    const notifications = results.map((result) => ({
      ...result,
      isRead: !!result.isRead, // Map 0/1 to boolean
      bestellingStatus: BestellingStatus[result.bestellingStatus], // Map the int to its corresponding enum string
    }));

    return notifications;
  } catch (error: any) {
    debugLog("Error in getAllNotificationsForUser: " + error);
    return (ctx.status = 400), (ctx.body = {error: error.message});
  }
};

// check if there are any notifications for a user with isRead = false. 
const checkForUnreadNotificationsOfUser = async (ctx: Koa.Context) => {
  try {
    const JWTUserInfo = await authService.checkAndParseSession(
      ctx.headers.authorization
    );

    const userId : number = JWTUserInfo.userId;

    const unreadCount : number = await notificationRepository
    .createQueryBuilder("n")
    .where("n.AANKOPER_ID = :userId", { userId })
    .andWhere("n.ISBEKENEN = :isRead", { isRead: false })
    .getCount();

    return (ctx.body = {unreadNotifications: unreadCount > 0});

  } catch (error: any) {
    debugLog("Error in checkForUnreadNotifications: " + error);
    return (ctx.status = 400), (ctx.body = {error: error.message});
  }
};

export default {
  checkNotificationEndpoint,
  // getAllNotifications,
  getAllNotificationsForUser,
  checkForUnreadNotificationsOfUser,
};
