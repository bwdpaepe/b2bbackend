import { logger } from "../server";
import { AppDataSource } from "../data-source";
import { Winkelmand } from "../entity/Winkelmand";
import { WinkelmandProducten } from "../entity/WinkelmandProducten";
import Koa from "koa";
import userservice from "../service/users";
import { Product } from "../entity/Product";

const debugLog = (message: any, meta = {}) => {
  logger.debug(message);
};

const winkelmandRepo = AppDataSource.getRepository(Winkelmand);
const winkelmandProductenRepo = AppDataSource.getRepository(WinkelmandProducten);
const productRepo = AppDataSource.getRepository(Product);


/**
 * Get the 'winkelmand' of the logged in user.
 */
const getWinkelmand = async (ctx: Koa.Context) => {
  const { userId } = ctx.state.session;

  const winkelmand = await winkelmandRepo.findOne({
    relations: {
      user: true,
      winkelmandProducten: { product: { bedrijf: true } },
    },
    select: {
      user: { userId: true, firstname: true },
      winkelmandProducten: {
        id: true,
        winkelmand_id: false,
        aantal: true,
        product: {
          productId: true,
          naam: true,
          eenheidsprijs: true,
          bedrijf: 
            { bedrijfId: true,
              naam: true, },
          voorraad: true,
          pictureFilename: true,
          omschrijving: true,
          levertermijn: true,
        },
      },
    },
    where: { user: { userId: userId } },
  });

  if (!winkelmand) {
    return (
      (ctx.status = 500),
      (ctx.body = {
        error:
          "De gebruiker heeft geen beschikbare winkelmand, contacteer de site administrator",
      })
    );
  }
  
  // Calculate the subtotal for each winkelmandProduct (aantal * eenheidsprijs)
  if (winkelmand && winkelmand.winkelmandProducten) {
    winkelmand.winkelmandProducten.forEach((winkelmandProduct) => {
      winkelmandProduct.subtotal = winkelmandProduct.aantal * winkelmandProduct.product.eenheidsprijs;
    });
  }

  // Calculate the total price for each bedrijfId and store it in an array 'totalPrice'
  winkelmand.totalPrice = winkelmand.winkelmandProducten.reduce((accumulator, winkelmandProduct) => {
    const bedrijfId = winkelmandProduct.product.bedrijf.bedrijfId;
    const currentTotal = accumulator.find((total) => total.bedrijfId === bedrijfId);

    if (currentTotal) {
      currentTotal.value += winkelmandProduct.subtotal;
      currentTotal.levertermijn = Math.max(currentTotal.levertermijn, winkelmandProduct.product.levertermijn);
    } else {
      accumulator.push(
        { bedrijfId, 
          value: winkelmandProduct.subtotal,
          levertermijn: winkelmandProduct.product.levertermijn,
         });
    }
    return accumulator;
  }, []); // Start with an empty array


  return winkelmand;
};



const seedWinkelmandOpAankopers = async () => {
  const users = await userservice.getAllUsers();
  for (const user of users) {
    if (user.function === "Aankoper") {
      let wm = await winkelmandRepo.findOne({
        where: { user: { userId: user.userId } },
      });
      if (!wm) {
        wm = new Winkelmand();
        wm.user = user;
        await winkelmandRepo.save(wm);
      }
    }
  }
};

const AddProduct = async (ctx: Koa.Context) => {
  const { userId } = ctx.state.session;
  const productId = ctx.params.product_id;
  const aantal = ctx.params.aantal;
  const winkelmand = await winkelmandRepo.findOne({
    where: { user: { userId: userId } },
    relations: { winkelmandProducten: true },
  });
  const product = await productRepo.findOne({
    where: { productId: productId },
  });

  // debuglog with info from the lines above
  debugLog("User: " + userId + " Product: " + productId + " Aantal: " + aantal + " Winkelmand_ID: " + winkelmand.id + " Product_ID: " + product.productId );

  if (!winkelmand) {
    debugLog("Winkelmand not found");
    return (
      (ctx.status = 500),
      (ctx.body = {
        error:
          "De gebruiker heeft geen beschikbare winkelmand, contacteer de site administrator",
      })
    );
  }
  if (product) {
    const existingWMP = winkelmand.winkelmandProducten.find(
      (wmp) => wmp.product_id === product.productId
    );

    if (existingWMP) { // If the product already exists in the winkelmand, update the amount
      const newAantal = existingWMP.aantal + aantal;
      if (product.voorraad < newAantal) {
        debugLog("Product stock too low");
        return (
          (ctx.status = 400),
          (ctx.body = {
            error: "De voorraad van dit product is lager dan het gewenste aantal (controleer je winkelmand)",
          })
        );
      }
      existingWMP.aantal = newAantal;
      await winkelmandProductenRepo.save(existingWMP);
      debugLog("Product amount updated in winkelmand");
      ctx.status = 200;
      return;
    } else { // If the product doesn't exist in the winkelmand, create a new winkelmandProduct
      if (product.voorraad < aantal) {
        debugLog("Product stock too low");
        return (
          (ctx.status = 400),
          (ctx.body = {
            error: "De voorraad van dit product is lager dan het gewenste aantal (controleer je winkelmand)",
          })
        );
      }
      const wmp = new WinkelmandProducten();
      wmp.product = product;
      wmp.winkelmand = winkelmand;
      wmp.aantal = aantal;
      await winkelmandProductenRepo.save(wmp);
      debugLog("Product added to winkelmand");
      ctx.status = 200;
      return;
    }
  } else {
    debugLog("Product not found");
    return (
      (ctx.status = 404), (ctx.body = { error: "Dit product bestaat niet" })
    );
  }
};

export default {
  getWinkelmand,
  seedWinkelmandOpAankopers,
  AddProduct,
};
