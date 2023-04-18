import Koa from "koa";
import { logger } from "../server";
import { AppDataSource } from "../data-source";
import { Bedrijf } from "../entity/Bedrijf";
import authService from "./auth";
import { User } from "../entity/User";

interface BedrijfEntry {
  bedrijfID: number;
  huisnummer: string;
  land: string;
  logo_filename: string;
  naam: string;
  postcode: string;
  stad: string;
  straat: string;
  telefoonnummer: string;
}

const debugLog = (message: any, meta = {}) => {
  logger.debug(message);
};

// Ophalen repository
// https://typeorm.io/#using-repositories
const bedrijfRepository = AppDataSource.getRepository(Bedrijf);
const userRepository = AppDataSource.getRepository(User);

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

/**
 * Get bedrijf via aankoperId
 */
const getBedrijfByAankoper = async (ctx: Koa.Context) => {
  try {
    const JWTUserInfo = await authService.checkAndParseSession(
      ctx.headers.authorization
    );
    const JWTuserId = JWTUserInfo.userId;
    debugLog(
      "GET bedrijf for a specific user with id: " + JWTuserId
    );


    const result = await userRepository
      .createQueryBuilder("u")
      .select([
        "b.ID as bedrijfID",
        "b.HUISNUMMER as huisnummer",
        "b.LAND as land",
        "b.LOGO_FILENAME as logo_filename",
        "b.NAAM as naam",
        "b.POSTCODE as postcode",
        "b.STAD as stad",
        "b.STRAAT as straat",
        "b.TELEFOONNUMMER as telefoonnummer",
      ])
      .innerJoin("u.bedrijf", "b")
      .where("u.userId = :userId", { userId: JWTuserId })
      .getRawOne<BedrijfEntry>();

    if (!result) {
      debugLog("No bedrijf found for user with userId " + JWTuserId);
      return (ctx.status = 204), (ctx.body = {error: "No bedrijf found for user with userId " + JWTuserId});
    }

    
    return result;
  } catch (error: any) {
    debugLog("Error in getBedrijfByAankoper: " + error);
    return (ctx.status = 400), (ctx.body = {error: error.message});
  }

};

export default {
  checkBedrijfEndpoint,
  getAllBedrijf,
  getBedrijfById,
  getBedrijfByAankoper,
};
