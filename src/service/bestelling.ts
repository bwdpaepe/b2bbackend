import Koa from "koa";
import { logger } from "../server";
import { AppDataSource } from "../data-source";
import { Bestelling } from "../entity/Bestelling";
import { BestellingStatus } from "../enums/BestellingStatusEnum";
import { User } from "../entity/User";
import { Bedrijf } from "../entity/Bedrijf";
import { Doos } from "../entity/Doos";
import userService from "./users";
import { Winkelmand } from "../entity/Winkelmand";
import { BesteldProduct } from "../entity/BesteldProduct";
import { debuglog } from 'util';
import { WinkelmandProducten } from '../entity/WinkelmandProducten';

const debugLog = (message: any, meta = {}) => {
  logger.debug(message);
};

const bestellingRepository = AppDataSource.getRepository(Bestelling);
const bedrijfRepository = AppDataSource.getRepository(Bedrijf);
const doosRepository = AppDataSource.getRepository(Doos);
const winkelmandRepository = AppDataSource.getRepository(Winkelmand);
const winkelmandProductRepository = AppDataSource.getRepository(WinkelmandProducten);

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
  debugLog("ophalen bestellingen voor bedrijf " + bedrijfId);
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
        select: {
          leverancierBedrijf: { naam: true },
          aankoper: { firstname: true, lastname: true, email: true },
        },
        where: { klantBedrijf: { bedrijfId: bedrijfId } },
      });
      const bestellingInfo = bestellingen.map((bestelling: Bestelling) => ({
        ...bestelling,
        status: BestellingStatus[bestelling.status],
      }));
      return bestellingInfo;
    } else {
      return (
        (ctx.status = 404),
        (ctx.body = {
          error: "er ging iets mis bij het laden van het bijhorend bedrijf",
        })
      );
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
        select: {
          leverancierBedrijf: { naam: true },
          aankoper: { firstname: true, lastname: true, email: true },
        },
        where: { bestellingId: bestellingId },
      });

      if (!bestelling) {
        debugLog("geen bestelling gevonden met Id: " + bestellingId);
        return (
          (ctx.status = 204),
          (ctx.body = { error: "Deze bestelling kan niet weergegeven worden" })
        );
      }

      return { ...bestelling, status: BestellingStatus[bestelling.status] };
    } else {
      return (
        (ctx.status = 404),
        (ctx.body = { error: "Deze bestelling kan niet weergegeven worden" })
      );
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
  try {
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
      select: {
        transportdienst: {
          naam: true,
          trackAndTraceFormat: { verificatiecodestring: true },
        },
        notification: { creationDate: true },
      },
      where: { trackAndTraceCode: ttc },
    });
    if (!bestelling) {
      debugLog("geen bestelling gevonden met TTC: " + ttc);
      return (
        (ctx.status = 204),
        (ctx.body = { error: "Deze bestelling kan niet weergegeven worden" })
      );
    }

    // verify the input
    switch (
      bestelling.transportdienst.trackAndTraceFormat.verificatiecodestring
    ) {
      case "POSTCODE":
        if (verify !== bestelling.leveradresPostcode) {
          return (
            (ctx.status = 400),
            (ctx.body = {
              error: "Deze bestelling kan niet weergegeven worden",
            })
          );
        }
        break;
      case "ORDERID":
        if (verify !== bestelling.orderId) {
          return (
            (ctx.status = 400),
            (ctx.body = {
              error: "Deze bestelling kan niet weergegeven worden",
            })
          );
        }
        break;
      default:
        return (
          (ctx.status = 400),
          (ctx.body = { error: "Deze bestelling kan niet weergegeven worden" })
        );
    }

    return { ...bestelling, status: BestellingStatus[bestelling.status] };
  } catch (error: any) {
    return (ctx.status = 400), (ctx.body = { error: error.message });
  }
};

const checkBestellingExists = async (bestellingId: number) => {
  const bestelling = await bestellingRepository.findOne({
    where: {
      bestellingId: bestellingId,
    },
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
    select: { klantBedrijf: { bedrijfId: true } },
    where: { bestellingId: bestellingId },
  });
};

const postBestelling = async (ctx: Koa.Context) => {
  const { bedrijfId } = ctx.state.session;
  const { userId } = ctx.state.session;
  const leverancierbedrijfId = Number(ctx.query.leverancierbedrijfId);
  const doosId = Number(ctx.query.doosId);
  const leveradresStraat = String(ctx.query.leveradresStraat);
  const leveradresNummer = String(ctx.query.leveradresNummer);
  const leveradresPostcode = String(ctx.query.leveradresPostcode);
  const leveradresStad = String(ctx.query.leveradresStad);
  const leveradresLand = String(ctx.query.leveradresLand);

  const aankoper: User = await userService.getUserById(userId);
  const aankoperBedrijf = await bedrijfRepository.findOne({
    where: { bedrijfId: bedrijfId },
  });

  // debuglog the values of all parameters in one string
  debugLog(
    "postBestelling: " +
      "leverancierbedrijfId: " +
      leverancierbedrijfId +
      ", doosId: " +
      doosId +
      ", leveradresStraat: " +
      leveradresStraat +
      ", leveradresNummer: " +
      leveradresNummer +
      ", leveradresPostcode: " +
      leveradresPostcode +
      ", leveradresStad: " +
      leveradresStad +
      ", leveradresLand: " +
      leveradresLand
  );

  // if not all parameters are given, return error
  if (
    !leverancierbedrijfId ||
    !doosId ||
    !leveradresStraat ||
    !leveradresNummer ||
    !leveradresPostcode ||
    !leveradresStad ||
    !leveradresLand
  ) {
    debugLog("postBestelling: not all parameters are given");
    return (ctx.status = 400), (ctx.body = { error: "Ongeldige gegevens" });
  }

  // if bedrijfId is the same as leverancierbedrijfId, return error
  if (bedrijfId === leverancierbedrijfId) {
    debugLog(
      "postBestelling: klantBedrijfId is the same as leverancierbedrijfId"
    );
    return (
      (ctx.status = 400),
      (ctx.body = {
        error: "Je kan geen bestelling plaatsen bij je eigen bedrijf",
      })
    );
  }

  // fetch leverancierbedrijf from database
  const leverancierBedrijf = await bedrijfRepository.findOne({
    where: {
      bedrijfId: leverancierbedrijfId,
    },
  });
  // if leverancierbedrijf does not exist, return error
  if (!leverancierBedrijf) {
    debugLog("postBestelling: leverancierbedrijf does not exist");
    return (
      (ctx.status = 400),
      (ctx.body = { error: "Leverancierbedrijf bestaat niet" })
    );
  }
  debugLog("leverancierBedrijf: " + leverancierBedrijf.naam);

  // fetch doos from database
  const doos = await doosRepository.findOne({
    where: {
      doosId: doosId,
    },
  });
  // if doos does not exist, return error
  if (!doos) {
    debugLog("postBestelling: doos does not exist");
    return (ctx.status = 400), (ctx.body = { error: "Doos bestaat niet" });
  }

  const lastOrder = await bestellingRepository.find({
    order: { bestellingId: "DESC" },
    take: 1,
  });
  const newOrderId = lastOrder ? lastOrder[0].bestellingId + 1 : 1;
  debugLog("newOrderId: " + newOrderId);

  const winkelmand = await winkelmandRepository.findOne({
    where: { user: { userId: aankoper.userId } },
    relations: [
      "user",
      "winkelmandProducten",
      "winkelmandProducten.product",
      "winkelmandProducten.product.bedrijf",
    ],
  });

  // if winkelmand is empty for this leverancierBedrijf, return error (this should not happen)
  if (
  !winkelmand ||
  !winkelmand.winkelmandProducten.some(
    (wp) => wp.product.bedrijf.bedrijfId === leverancierBedrijf.bedrijfId
  )
) {
  debugLog("postBestelling: winkelmand is empty");
  return (
    (ctx.status = 400),
    (ctx.body = {
      error: "Winkelmand is leeg bij leverancier " + leverancierBedrijf.naam,
    })
  );
}

  // create bestelling
  const bestelling = new Bestelling();
  bestelling.klantBedrijf = aankoperBedrijf;
  bestelling.leverancierBedrijf = leverancierBedrijf;
  bestelling.aankoper = aankoper;
  bestelling.doos = doos;
  bestelling.leveradresStraat = leveradresStraat;
  bestelling.leveradresNummer = leveradresNummer;
  bestelling.leveradresPostcode = leveradresPostcode;
  bestelling.leveradresStad = leveradresStad;
  bestelling.leveradresLand = leveradresLand;
  bestelling.status = BestellingStatus.GEPLAATST;
  bestelling.orderId = "Order" + newOrderId;
  bestelling.datumGeplaatst = new Date();
  bestelling.klantnaam = aankoperBedrijf.naam;
  bestelling.besteldeProducten = [];

  // debugLog("winkelmand: " + JSON.stringify(winkelmand));
  // debugLog("winkelmand.winkelmandProducten: " + JSON.stringify(winkelmand.winkelmandProducten));

  for (const winkelmandProduct of winkelmand.winkelmandProducten) {
    //console.log("winkelmandProduct.bedrijf: " + winkelmandProduct.product.bedrijf.naam)
    if (winkelmandProduct.product.bedrijf.bedrijfId === leverancierBedrijf.bedrijfId) {
      const besteldProduct = new BesteldProduct();
      besteldProduct.bestelling = bestelling;
      besteldProduct.product = winkelmandProduct.product;
      besteldProduct.aantal = winkelmandProduct.aantal;
      besteldProduct.eenheidsprijs = winkelmandProduct.product.eenheidsprijs;
      besteldProduct.naam = winkelmandProduct.product.naam;
      // console.log("besteldProduct: " + besteldProduct);
      bestelling.besteldeProducten.push(besteldProduct);
    }
  }

  // save bestelling to database
  try {
    const savedBestelling = await bestellingRepository.save(bestelling);
    debugLog(
      "postBestelling: savedBestelling with id: " + savedBestelling.bestellingId
    );

    // remove all products (that belong to leverancierBedrijf) from winkelmand of this aankoper
    for (const winkelmandProduct of winkelmand.winkelmandProducten) {
      if (winkelmandProduct.product.bedrijf.bedrijfId === leverancierBedrijf.bedrijfId) {
        await winkelmandProductRepository.remove(winkelmandProduct);
        // debugLog("postBestelling: removed winkelmandProduct with id: " + winkelmandProduct.product.productId)
      }
    }

    return (ctx.status = 201);
  } catch (error: any) {
    return (ctx.status = 400), (ctx.body = { error: error.message });
  }
};

export default {
  checkBestellingEndpoint,
  getBestellingenVanBedrijf,
  getById,
  getByTrackAndTrace,
  checkBestellingExists,
  getBedrijfIdFromBestelling,
  postBestelling,
};
