import Koa from "koa";
import { logger } from "../server";
import { AppDataSource } from "../data-source";
import { Bestelling } from "../entity/Bestelling";

const debugLog = (message: any, meta = {}) => {
  logger.debug(message);
};

// Ophalen repository
// https://typeorm.io/#using-repositories
const bestellingRepository = AppDataSource.getRepository(Bestelling);

/**
 * Check if the endpoint /api/bedrijf/ is available.
 */
const checkBestellingEndpoint = async () => {
  debugLog("GET bestelling endpoint called");
  return "Bestelling endpoint is available";
};

/**
 * Get list of all orders.
 */
const getAllBestelling = async () => {
  debugLog("GET list of all bestellingen");
  return await bestellingRepository.find();
};

/**
 * Get all orders from company
 */
/*const getBestellingByCompany = async (ctx: Koa.Context) => {
  debugLog("GET bedrijf with bedrijfId " + ctx.query.bedrijfId);
  try {
    const bedrijf = await bedrijfRepository.findOne({
      where: {bedrijfId: Number(ctx.query.bedrijfId)},
    });

    if (!bedrijf) {
      throw new Error(
        "Bedrijf with id " + ctx.query.bedrijfId + " not found"
      );
    }
    return bedrijf;
  } catch (error: any) {
    return (ctx.status = 400), (ctx.body = { error: error.message });
  }
};
*/
export default {
  checkBestellingEndpoint,
  getAllBestelling,
  //getBedrijfById,
};
