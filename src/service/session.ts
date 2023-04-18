import { Session } from "../entity/Session";
import { User } from "../entity/User";
import { logger } from "../server";
import { AppDataSource } from "../data-source";
import { Equal } from "typeorm";
import Koa from 'koa';
import authService from "./auth";

const debugLog = (message: any, meta = {}) => {
  logger.debug(message);
};

const sessionRepository = AppDataSource.getRepository(Session);

const checkSessionEndpoint = async () => {
  debugLog("GET session endpoint called");
  return "Session endpoint is available";
};

const saveSessionStart = async (foundUser: User) => {
  try {
    debugLog(`saveSessionStart called`);
    let session: Session;

    const existingSession = await sessionRepository.findOne({ where: { user: Equal(foundUser.userId) } });

    if (existingSession) {
      session = existingSession;
    } else {
      session = new Session();
      session.user = foundUser;
    }

    session.sessionStart = new Date();
    const savedSession = await sessionRepository.save(session);
    debugLog(`saveSession saved session: ${savedSession.sessionId} for user: ${foundUser.userId } with sessionStart: ${savedSession.sessionStart}`);
    return savedSession;
  } catch (error: any) {
    debugLog(`saveSessionStart error: ${error.message}`);
    throw error;
  }
};

const saveSessionEnd = async (ctx: Koa.Context) => {
  try {
    debugLog(`saveSessionEnd called`);
    const JWTUserInfo = await authService.checkAndParseSession(
      ctx.headers.authorization
    );
    const existingSession = await sessionRepository.findOne({ where: { user: Equal(JWTUserInfo.userId) } });
    existingSession.sessionEnd = new Date();
    const savedSession = await sessionRepository.save(existingSession);
    debugLog(`saveSessionEnd saved session: ${savedSession.sessionId} for user: ${JWTUserInfo.userId } with sessionEnd: ${savedSession.sessionEnd}`);
    return savedSession;
  } catch (error: any) {
    debugLog(`saveSessionEnd error: ${error.message}`);
    return (ctx.status  = 400, ctx.body = {error: "saveSessionEnd error: " + error.message})
  }
};

export default {
  checkSessionEndpoint,
  saveSessionStart,
  saveSessionEnd,
};
