import Koa from "koa";
import { logger } from "../server";
import { AppDataSource } from "../data-source";
import { Bedrijf } from "../entity/Bedrijf";
import usersService from "./users";
import { User } from "../entity/User";

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
 * get company profile
 */

const getBedrijfProfiel = async (ctx: any) => {
  try {
    const {bedrijfId} = ctx.state.session ;
    debugLog("getting company profile " + bedrijfId);
    const bedrijf: Bedrijf = await bedrijfRepository.findOne({
      relations: { users: true },
      where: { bedrijfId: bedrijfId, users: { function: "AANKOPER" } },
    });
    if (bedrijf) {
      const {
        naam,
        straat,
        huisnummer,
        postcode,
        stad,
        land,
        telefoonnummer,
        logoFilename,
        users,
      } = bedrijf;

      const userInfo = users.map(user => {user.firstname, user.lastname, user.personeelsNr, user.email, user.phone})
      const bedrijfInfo = {
        naam,
        straat,
        huisnummer,
        postcode,
        stad,
        land,
        telefoonnummer,
        logoFilename,
        userInfo,
      };
      return bedrijfInfo;
    } else {
      return (
        (ctx.status = 404), (ctx.body = { error: "Dit bedrijf bestaat niet" })
      );
    }
  } catch (error) {
    return (
      (ctx.status = 400),
      (ctx.body = { error: "Er ging iets mis bij het laden van het profiel" })
    );
  }
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
  getBedrijfProfiel,
};
