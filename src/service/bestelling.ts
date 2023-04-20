import Koa from "koa";
import { logger } from "../server";
import userService from "../service/users";
import { AppDataSource } from "../data-source";
import { Bestelling } from "../entity/Bestelling";
import { Bedrijf } from "../entity/Bedrijf";
import { User } from "../entity/User";
import { BestellingStatus } from "../enums/BestellingStatusEnum";
import bedrijf from "./bedrijf";

const debugLog = (message: any, meta = {}) => {
  logger.debug(message);
};

const bestellingRepository = AppDataSource.getRepository(Bestelling);

/**
 * Check if the endpoint /api/bedrijf/ is available.
 */
const checkBestellingEndpoint = async () => {
  debugLog("GET bestelling endpoint called");
  return "Bestelling endpoint is available";
};

/**
 * Get all orders from company
 */
const getBestellingenVanBedrijf = async (ctx: Koa.Context) => {
  const { bedrijfId } = ctx.state.session;
  debugLog("ophalen bestellingen voor bedrijf " + bedrijfId)
  try {
    if (bedrijfId) {
      const bestellingen: Bestelling[] = await bestellingRepository.find({
        relations: {
          leverancierBedrijf: true,
          klantBedrijf: false,
          aankoper: true,
        },
        select: {leverancierBedrijf : {naam: true}, aankoper : {firstname: true, lastname : true, email : true}},
        where: { klantBedrijf: {bedrijfId : bedrijfId} }, 
      });
      const bestellingInfo = bestellingen.map((bestelling: Bestelling) => ({
        ...bestelling,
        status: BestellingStatus[bestelling.status],
      }));
      return bestellingInfo;
    }
    else{
      return(ctx.status = 404),(ctx.body = {error : "er ging iets mis bij het laden van het bijhorend bedrijf"});
    }
  } catch (error: any) {
    return (ctx.status = 400), (ctx.body = { error: error.message });
  }
};

export default {
  checkBestellingEndpoint,
  getBestellingenVanBedrijf,
};
