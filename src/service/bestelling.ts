import Koa from "koa";
import { logger } from "../server";
import { AppDataSource } from "../data-source";
import { Bestelling } from "../entity/Bestelling";
import { Bedrijf } from "../entity/Bedrijf";
import { User } from "../entity/User";
import { BestellingStatus } from "../enums/BestellingStatusEnum";

interface BestellingListEntry {
  bestellingId: number;
  leverancierBedrijf: Bedrijf;
  klantBedrijf: Bedrijf;
  aankoper: User;
  status: BestellingStatus;
  datumGeplaatst: Date;
  orderId: string;
  trackAndTraceCode: string;
}

const debugLog = (message: any, meta = {}) => {
  logger.debug(message);
};

// Ophalen repository
// https://typeorm.io/#using-repositories
const bestellingRepository = AppDataSource.getRepository(Bestelling);
const bedrijfRepository = AppDataSource.getRepository(Bedrijf);
const userRepository = AppDataSource.getRepository(User);

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

async function getNaamAankoper(userId: number) {
  const naamAankoper = await userRepository.findOne({
    select: {
        email: true,
    },
    where: {
      userId: userId,
    }
  });
  debugLog("naam aankoper: " + naamAankoper.email);
  return naamAankoper.email;
}

/**
 * Helper function to process the results of a query to the notification table.
 */
async function processBestellingen(results: BestellingListEntry[]) {
  if (!results || results.length === 0) {
    return null;
  }

  const bestellingen = results.map(async (result) => {
    const naamAankoper = await getNaamAankoper(result.aankoper.userId);
    debugLog("naam aankoper: " + naamAankoper);
    return {
      bestellingId: result.bestellingId,
      leverancierBedrijf: result.leverancierBedrijf,
      klantBedrijf: result.klantBedrijf,
      aankoper: naamAankoper,
      status: BestellingStatus[result.status],
      datumGeplaatst: result.datumGeplaatst,
      orderId: result.orderId,
      trackAndTraceCode: result.trackAndTraceCode,

    };
  });
  
  return await Promise.all(bestellingen);

}

/**
 * Get all orders from company
 */
const getBestellingenVanBedrijf = async (ctx: Koa.Context) => {
  debugLog("GET bedrijf with bedrijfId " + ctx.params.bedrijfId);
  try {
    const bedrijf = await bedrijfRepository.findOne({
      where: {bedrijfId: Number(ctx.params.bedrijfId)},
    });
    
    if (!bedrijf) {
      throw new Error(
        "Bedrijf with id " + ctx.params.bedrijfId + " not found"
      );
    }

    const query = bestellingRepository
    .createQueryBuilder("bestelling")
    .select([
      "bestelling.ID as bestellingId",
      "bestelling.Leverancier as leverancierBedrijf",
      "bestelling.Klant as klantBedrijf",
      "bestelling.Medewerker as aankoper",
      "bestelling.STATUS as status",
      "bestelling.DATUMGEPLAATST as datumGeplaatst",
      "bestelling.ORDERID as orderId",
      "bestelling.TRACKANDTRACECODE as trackAndTraceCode",
    ])
    .innerJoin("bestelling.klantBedrijf", "k")
    .where("k.ID = :bedrijfId", { bedrijfId: ctx.params.bedrijfId })
    .orderBy("bestelling.DATUMGEPLAATST", "DESC");

    const results = await query.getRawMany<BestellingListEntry>();

    return await processBestellingen(results);

  } catch (error: any) {
    return (ctx.status = 400), (ctx.body = { error: error.message });
  }
};

export default {
  checkBestellingEndpoint,
  getAllBestelling,
  getBestellingenVanBedrijf,
};
