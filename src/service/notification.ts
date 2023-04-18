import Koa from "koa";
import { logger } from "../server";
import { AppDataSource } from "../data-source";
import { Notification } from "../entity/Notification";
import authService from "./auth";
import { User } from "../entity/User";
import { Functions } from "../enums/Functions";
import { BestellingStatus } from "../enums/BestellingStatusEnum";

interface NotificationWithBestelling {
  notificationID: number;
  creationDate: Date;
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
const usersRepository = AppDataSource.getRepository(User);

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
const getAllNotifications = async () => {
  debugLog("GET list of all notifications");
  const notifications = await notificationRepository.find({
    relations: [
      "aankoper",
      "aankoper.bedrijf",
      "bestelling",
      "bestelling.leverancierBedrijf",
      "bestelling.klantBedrijf",
    ],
  });

  const response = notifications.map((notification) => ({
    ...notification,
    bestelling: {
      ...notification.bestelling,
      status: notification.bestelling.getStatusDescription(),
    },
  }));

  return response;
};

/**
 * GET list of all notifications for a specific user.
 */
const getAllNotificationsForUser = async (ctx: Koa.Context) => {
  const JWTUserInfo = await authService.checkAndParseSession(
    ctx.headers.authorization
  );
  const JWTuserId = JWTUserInfo.userId;
  debugLog(
    "GET list of all notifications for a specific user with id: " + JWTuserId
  );
  const user = await usersRepository.findOne({
    where: { userId: JWTuserId },
  });

  if (!user) {
    debugLog("User with userId " + JWTuserId + " doesn't exist");
    return (ctx.status = 404), (ctx.body = "User doesn't exist" + JWTuserId);
  }
  debugLog(
    "User with userId " +
      JWTuserId +
      " exists, name: " +
      user.firstname +
      " " +
      user.lastname
  );

  if (user.function.toLowerCase() !== Functions.AANKOPER.toLowerCase()) {
    debugLog(
      "User with userId " + JWTuserId + " is not an " + Functions.AANKOPER
    );
    return (
      (ctx.status = 404), (ctx.body = "User is not an " + Functions.AANKOPER)
    );
  }
  debugLog("User with userId " + JWTuserId + " is an " + Functions.AANKOPER);

  const notifications = await notificationRepository
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
    .getRawMany();

  return notifications;
};

export default {
  checkNotificationEndpoint,
  getAllNotifications,
  getAllNotificationsForUser,
};
