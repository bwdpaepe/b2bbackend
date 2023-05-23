import Koa from "koa";
import { logger } from "../server";
import { AppDataSource } from "../data-source";
import { Notification } from "../entity/Notification";
import authService from "./auth";
import { BestellingStatus } from "../enums/BestellingStatusEnum";
import sessionService from "./session";
import { NotificationStatus } from "../enums/NotificationStatus";

interface NotificationListEntry {
  notificationID: number;
  isRead: boolean;
  creationDate: Date;
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
 * Helper function to fetch the notifications for a user.
 * The limit parameter is optional and can be used to limit the number of notifications returned.

 */
async function fetchNotifications(userId: number, limit?: number) {
  const query = notificationRepository
    .createQueryBuilder("n")
    .select([
      "n.ID as notificationID",
      "n.ISBEKENEN as isRead",
      "n.CREATIONDATE as creationDate",
      "b.ID as bestellingId",
      "b.ORDERID as orderId",
      "b.STATUS as bestellingStatus",
    ])
    .innerJoin("n.bestelling", "b")
    .where("b.Medewerker = :userId", { userId: userId })
    .orderBy("n.CREATIONDATE", "DESC");

  if (limit) {
    query.limit(limit);
  }

  const results = await query.getRawMany<NotificationListEntry>();
  return results;
}
async function getNotificationByID(ctx : Koa.Context){
  const {userId} = ctx.state.session;
  try {
    const notification = await notificationRepository.findOne({where : {notificationId : ctx.params.id}, relations : {aankoper : true, bestelling: true}});
    if (notification && notification.aankoper.userId === userId) {
      notification.isBekeken = true;
      await notificationRepository.save(notification);
      return ctx.body = {
      notificationID: notification.notificationId,
      creationDate: notification.creationDate,
      bestellingId: notification.bestelling.bestellingId,    
      bestellingStatus: BestellingStatus[notification.bestelling.status], // Map the int to its corresponding enum string
      trackAndTraceCode: notification.bestelling.trackAndTraceCode
    }
  }
        
  } catch (error) {
    return ctx.body = {error: "deze notificatie kon niet opgehaald worden"}, ctx.status = 404;
  }


}

/**
 * Helper function to process the results of a query to the notification table.
 */
 async function processNotifications(results: NotificationListEntry[], ctx: Koa.Context) {
  if (!results || results.length === 0) {
    return null;
  }

  // Get the session info of the user in the session table
  const sessionInfo = await sessionService.getSessionOfUser(ctx);

  const notifications = results.map((result) => {
    let status: NotificationStatus;
    if (result.isRead) {
      status = NotificationStatus.READ;
    } else if (sessionInfo.sessionEnd < new Date(result.creationDate)) {
      status = NotificationStatus.NEW;
    } else if (sessionInfo.sessionEnd >= new Date(result.creationDate)) {
      status = NotificationStatus.UNREAD;
    } else {
      throw new Error("Unexpected notification state for notification with ID " + result.notificationID); // Should never happen
    }

    return {
      notificationID: result.notificationID,
      creationDate: result.creationDate,
      bestellingId: result.bestellingId,
      orderId: result.orderId,
      bestellingStatus: BestellingStatus[result.bestellingStatus], // Map the int to its corresponding enum string
      status: NotificationStatus[status], // Add the status property as a string
    };
  });

  return notifications;
}

/**
 * GET list of all notifications for a specific user.
 */
const getNotificationsForUser = async (ctx: Koa.Context) => {
  try {
    const JWTUserInfo = await authService.checkAndParseSession(
      ctx.headers.authorization
    );
    const JWTuserId = JWTUserInfo.userId;
    debugLog(
      "GET list of all notifications for a specific user with id: " + JWTuserId
    );

    let limit: number | undefined;
    if (ctx.query.limit) {
      limit = parseInt(ctx.query.limit[0]);
      if (isNaN(limit) || limit <= 0) {
        return (ctx.status = 400), (ctx.body = { error: "Invalid limit value" });
      }
    }

    const results = await fetchNotifications(JWTuserId, limit);

    const notifications = await processNotifications(results, ctx);

    if (!notifications) {
      debugLog("No notifications found for user with userId " + JWTuserId);
      return (ctx.status = 204), (ctx.body = {error: "Geen notificaties voor gebruiker met id: " + JWTuserId});
    }
    return notifications;

  } catch (error: any) {
    debugLog("Error in getAllNotificationsForUser: " + error);
    return (ctx.status = 400), (ctx.body = {error: error.message});
  }
};

// check the number of notifications for a user with isRead = false. 
const getUnreadNotificationsCount = async (ctx: Koa.Context) => {
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

    return (ctx.body = {unreadNotificationsCount: unreadCount});

  } catch (error: any) {
    debugLog("Error in checkForUnreadNotifications: " + error);
    return (ctx.status = 400), (ctx.body = {error: error.message});
  }
};

// check if there are any new notification for a user with isRead = false.
// a notification that is counted as new is a notification that is not read and is created after the session.lastNotificationCheck of the user.
const getNewNotificationsCountSinceLastCheck = async (ctx: Koa.Context) => {
  try {
    const JWTUserInfo = await authService.checkAndParseSession(
      ctx.headers.authorization
    );
      
    const userId : number = JWTUserInfo.userId;

    const sessionInfo = await sessionService.getSessionOfUser(ctx);
    
    const newNotificationsCount : number = await notificationRepository
    .createQueryBuilder("n")
    .where("n.AANKOPER_ID = :userId", { userId: userId })
    .andWhere("n.ISBEKENEN = :isRead", { isRead: false })
    //.andWhere("n.CREATIONDATE > :lastNotificationCheck", {lastNotificationCheck: sessionInfo.lastNotificationCheck})
    .andWhere(
      sessionInfo.lastNotificationCheck
        ? "n.CREATIONDATE > :lastNotificationCheck"
        : "n.CREATIONDATE IS NOT NULL",
      {
        lastNotificationCheck: sessionInfo.lastNotificationCheck ?? null,
      }
    )
    .getCount();

    sessionInfo.lastNotificationCheck = new Date();
    await sessionService.updateSession(sessionInfo);

  ctx.body = { newNotificationsCountSinceLastCheck: newNotificationsCount };

  return ctx.body;

  } catch (error: any) {
    debugLog("Error in checkForUnreadNotifications: " + error);
    return (ctx.status = 400), (ctx.body = {error: error.message});
  }
};

export default {
  checkNotificationEndpoint,
  getNotificationsForUser,
  getUnreadNotificationsCount,
  getNewNotificationsCountSinceLastCheck,
  getNotificationByID
};
