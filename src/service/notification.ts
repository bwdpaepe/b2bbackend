import Koa from "koa";
import { logger } from "../server";
import { AppDataSource } from "../data-source";
import { Notification } from "../entity/Notification";

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
const getAllNotifications = async () => {
  debugLog("GET list of all notifications");
  const notifications = await notificationRepository.find({
    relations: [
      "aankoper", 
      "aankoper.bedrijf",
      "bestelling", 
      "bestelling.leverancierBedrijf", 
      "bestelling.klantBedrijf"
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


export default {
  checkNotificationEndpoint,
  getAllNotifications,
};
