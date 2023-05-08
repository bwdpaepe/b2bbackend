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
          return (ctx.status = 204),(ctx.body = {error : "Deze bestelling kan niet weergegeven worden"});
        }

        return {...bestelling, status: BestellingStatus[bestelling.status]};
    }
    else {
      return(ctx.status = 404),(ctx.body = {error : "Deze bestelling kan niet weergegeven worden"});
    }

  } catch (error: any) {
    return (ctx.status = 400), (ctx.body = { error: error.message });
  }
  
};

// GET bestelling by track and trace
const getByTrackAndTrace = async (ctx: any) => {
  const { ttc, verify } = ctx.query;
  if (!ttc || !verify) {
    return (ctx.status = 400), (ctx.body = { error: "Invalid query values" });
  }

  debugLog("ophalen bestelling met TTC " + ttc);
  try{
    
      const bestelling: Bestelling = await bestellingRepository.findOne({
        relations: {
          leverancierBedrijf: false,
          klantBedrijf: false,
          aankoper: false,
          transportdienst: {
            trackAndTraceFormat: true,
          },
          notification: true,
        },
        select: {transportdienst : {naam: true, trackAndTraceFormat : {verificatiecodestring: true}}, notification : {creationDate: true}},
        where: {trackAndTraceCode: ttc}});
        if (!bestelling) {
          debugLog("geen bestelling gevonden met TTC: " + ttc);
          return (ctx.status = 204),(ctx.body = {error : "Deze bestelling kan niet weergegeven worden"});
        }

        // verify the input
        switch (bestelling.transportdienst.trackAndTraceFormat.verificatiecodestring) {
          case 'POSTCODE':
            if(verify !== bestelling.leveradresPostcode) {
              return(ctx.status = 400),(ctx.body = {error : "Deze bestelling kan niet weergegeven worden"});
            }
            break;
          case 'ORDERID':
            if(verify !== bestelling.orderId) {
              return(ctx.status = 400),(ctx.body = {error : "Deze bestelling kan niet weergegeven worden"});
            }
            break;
          default: return(ctx.status = 400),(ctx.body = {error : "Deze bestelling kan niet weergegeven worden"});
        }

        return {...bestelling, status: BestellingStatus[bestelling.status]};
    
    
  } catch (error: any) {
    return (ctx.status = 400), (ctx.body = { error: error.message });
  }
  
};

// GET verificatie by track and trace
const getVerificatieByTrackAndTrace = async (ctx: any) => {
  const { ttc } = ctx.query;
  if (!ttc) {
    return "Verificatie";
  }

  debugLog("ophalen verificatie bestelling met TTC " + ttc);
  try{
    
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
        where: {trackAndTraceCode: ttc}});
        if (!bestelling) {
          debugLog("geen bestelling gevonden met TTC: " + ttc);
          return "Verificatie";
        }
        return bestelling.transportdienst.trackAndTraceFormat.verificatiecodestring;
    
    
  } catch (error: any) {
    return "Verificatie";
  }
  
};

const checkBestellingExists = async (bestellingId: number) => {
  const bestelling = await bestellingRepository.findOne({
    where: {
      bestellingId: bestellingId
    }
  });
  if (bestelling == null) {
    return false;
  } else {
    
      return true;
  }
};

const getBedrijfIdFromBestelling = async (bestellingId: number) => {
  return await bestellingRepository.findOne({
    relations: {
      leverancierBedrijf: false,
      klantBedrijf: true,
      aankoper: false,
      transportdienst: false,
      notification: false,
    },
    select: {klantBedrijf : {bedrijfId: true}},
    where: {bestellingId: bestellingId}
  });
};

export default {
  checkBestellingEndpoint,
  getBestellingenVanBedrijf,
  getById,
  getByTrackAndTrace,
  getVerificatieByTrackAndTrace,
  checkBestellingExists,
  getBedrijfIdFromBestelling
};
