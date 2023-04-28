import Koa from "koa";
import { logger } from "../server";
import { AppDataSource } from "../data-source";
import { Bestelling } from "../entity/Bestelling";
import { BestellingStatus } from "../enums/BestellingStatusEnum";


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
          transportdienst: false,
          notification: false,
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

// GET bestelling by ID
const getById = async (ctx: Koa.Context) => {
  const bestellingId = ctx.params.id;
  debugLog("ophalen bestellingen met Id " + bestellingId);
  try {
    if (bestellingId) {
      const bestelling: Bestelling = await bestellingRepository.findOne({
        relations: {
          leverancierBedrijf: true,
          klantBedrijf: false,
          aankoper: true,
          transportdienst: false,
          notification: false,
        },
        select: {leverancierBedrijf : {naam: true}, aankoper : {firstname: true, lastname : true, email : true}},
        where: {bestellingId: bestellingId}})

        if (!bestelling) {
          debugLog("geen bestelling gevonden met Id: " + bestellingId);
          return (ctx.status = 204);
        }

        return {...bestelling, status: BestellingStatus[bestelling.status]};
    }
    else {
      return(ctx.status = 404),(ctx.body = {error : "er ging iets mis bij het laden van de bestelling"});
    }

  } catch (error: any) {
    return (ctx.status = 400), (ctx.body = { error: error.message });
  }
  
};

// GET track and trace by ID
const getTrackAndTraceById = async (ctx: Koa.Context) => {
  const bestellingId = ctx.params.id;
  debugLog("ophalen track and trace met Id " + bestellingId);
  try{
    if(bestellingId){
      const bestelling: Bestelling = await bestellingRepository.findOne({
        relations: {
          leverancierBedrijf: false,
          klantBedrijf: false,
          aankoper: false,
          transportdienst: {
            trackAndTraceFormat: true,
          },
          notification: false,
        },
        select: {transportdienst : {naam: true, trackAndTraceFormat : {verificatiecodestring: true}}},
        where: {bestellingId: bestellingId}})

        if (!bestelling) {
          debugLog("geen bestelling gevonden met Id: " + bestellingId);
          return (ctx.status = 204);
        }

        return {...bestelling, status: BestellingStatus[bestelling.status]};
    }
    else{
      return(ctx.status = 404),(ctx.body = {error : "er ging iets mis bij het laden van de bestelling"});
    }
  } catch (error: any) {
    return (ctx.status = 400), (ctx.body = { error: error.message });
  }
  
};

export default {
  checkBestellingEndpoint,
  getBestellingenVanBedrijf,
  getById,
  getTrackAndTraceById
};
