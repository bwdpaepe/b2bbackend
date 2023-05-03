import { TrackAndTraceSchema } from "../schema/track-and-trace.shema";
import { ZodError} from "zod";

import { logger } from "../server";
import authService from "./auth";
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
    if(await bestellingService.checkBestellingExists(bestellingId)) {
      const checkBedrijfId = await bestellingService.getBedrijf(bestellingId);
      console.log(checkBedrijfId);
      if(checkBedrijfId.klantBedrijf.bedrijfId !== bedrijfId) {
        throw new Error('bestelling kan niet opgehaald worden');
      }
    }
    else {
      return (ctx.status = 404), (ctx.body = {error: "bestelling niet gevonden"});
    }
    
  }catch (error: any) {
    debugLog("Error in userCanAccessBestelling: " + error);
    return (ctx.status = 400), (ctx.body = {error: error.message});
  }
  return next();
};

const validateTrackAndTrace = (ctx: any, next: any) => {
  try{
    const{ttc, verify} = ctx.query;
    const querySchema = {ttc: ttc, verify: verify};
    const result = TrackAndTraceSchema.parse(querySchema);
    console.log(result);
  }
  catch (error: any) {
    if (error instanceof ZodError) {
      return (ctx.status = 403), (ctx.body = { error: ([error.issues.map((issue) => (issue.message))]).join(',') }); // 403 = Invalid format
    }
    return (ctx.status = 400), (ctx.body = { error: error.message }); // 400 = Bad request
  }
  return next();
}

export default{
  userCanAccessBestelling,
  validateTrackAndTrace,
};