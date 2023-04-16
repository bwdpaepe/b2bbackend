import Koa from "koa";
import { logger } from "../server";
import { AppDataSource } from "../data-source";
import { Bedrijf } from "../entity/Bedrijf";

const debugLog = (message: any, meta = {}) => {
  logger.debug(message);
};

// Ophalen repository
// https://typeorm.io/#using-repositories
const bedrijfRepository = AppDataSource.getRepository(Bedrijf);

/**
 * Check if the endpoint /api/bedrijf/ is available.
 */
const checkBedrijfEndpoint = async () => {
  debugLog("GET bedrijf endpoint called");
  return "Bedrijf endpoint is available";
};

/**
 * Get list of all companies.
 */
const getAllBedrijf = async () => {
  debugLog("GET list of all users");
  return await bedrijfRepository.find();
};

/**
 * Get bedrijf via bedrijfId
 */
const getBedrijfById = async (ctx: Koa.Context) => {
  debugLog("GET bedrijf with bedrijfId " + ctx.query.bedrijfId);
  try {
    const bedrijf = await bedrijfRepository.findOne({
      where: { bedrijfId: Number(ctx.query.bedrijfId) },
    });

    if (!bedrijf) {
      throw new Error("Bedrijf with id " + ctx.query.bedrijfId + " not found");
    }
    return bedrijf;
  } catch (error: any) {
    return (ctx.status = 400), (ctx.body = { error: error.message });
  }
};

export default {
  checkBedrijfEndpoint,
  getAllBedrijf,
  getBedrijfById,
};
