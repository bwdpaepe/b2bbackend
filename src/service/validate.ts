import { TrackAndTraceSchema } from "../schema/track-and-trace.shema";
import { ZodError} from "zod";

import { logger } from "../server";
import authService from "./auth";
import { Bestelling } from "../entity/Bestelling";
import bestellingService from "../service/bestelling"

const debugLog = (message: any, meta = {}) => {
  logger.debug(message);
};

const userCanAccessBestelling = async (ctx: any, next: any) => {
  try {
    const JWTUserInfo = await authService.checkAndParseSession(
      ctx.headers.authorization
    );
    console.log(JWTUserInfo);
    const JWTuserId = JWTUserInfo.userId;
    const bedrijfId = JWTUserInfo.bedrijfId;
    const bestellingId = ctx.params.id;
    debugLog(
      "GET bedrijf for a specific bestelling with id: " + bestellingId
    );
    if(bestellingService.checkBestellingExists(bestellingId)) {
      const checkBedrijfId = await bestellingService.getBedrijf(bestellingId);
      console.log(checkBedrijfId);
      if(checkBedrijfId.klantBedrijf.bedrijfId !== bedrijfId) {
        throw new Error('bestelling kan niet opgehaald worden');
      }
    }
    
  }catch (error: any) {
    debugLog("Error in userCanAccessBestelling: " + error);
    return (ctx.status = 400), (ctx.body = {error: error.message});
  }
  return next();
};

const validateTrackAndTrace = (ctx: any, next: any) => {
  try{
    const result = TrackAndTraceSchema.parse(ctx.request.body);
    console.log(result);
  }
  catch (error: any) {
    if (error instanceof ZodError) {
      return (ctx.status = 403), (ctx.body = { error: JSON.stringify(error.issues.map((issue) => ({ message: issue.message }))) }); // 403 = Invalid format
    }
    return (ctx.status = 400), (ctx.body = { error: error.message }); // 400 = Bad request
  }
  return next();
}

export default{
  userCanAccessBestelling,
  validateTrackAndTrace,
};