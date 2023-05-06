import Koa from "koa";
import { logger } from "../server";
import { AppDataSource } from "../data-source";
import { Doos } from "../entity/Doos";

const debugLog = (message: any) => {
  logger.debug(message);
};

// Ophalen repository
// https://typeorm.io/#using-repositories
const doosRepository = AppDataSource.getRepository(Doos);

/**
 * Check if the endpoint /api/dozen/ is available.
 */
const checkDoosEndpoint = async () => {
  debugLog("GET Doos endpoint called");
  return "Doos endpoint is available";
};

const getAllDoosFromBedrijf = async (ctx: Koa.Context) => {
  try {
    debugLog("GET dozen from bedrijfId " + ctx.params.bedrijfId);
    const bedrijfId = Number(ctx.params.bedrijfId);
    
    const dozen = await doosRepository.find({
      where: { bedrijf: { bedrijfId: bedrijfId }, isActief: true },
    });

    if (!dozen || dozen.length === 0) {
      debugLog("No dozen found for company with Id:  " + bedrijfId);
      return (ctx.status = 204);
    }

    return ctx.body = dozen;

  } catch (error: any) {
    return (ctx.status = 400), (ctx.body = { error: error.message });
  }
};



export default {
  checkDoosEndpoint,
  getAllDoosFromBedrijf,
};
