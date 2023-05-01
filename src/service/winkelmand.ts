import { logger } from "../server";
import { AppDataSource } from "../data-source";
import { Winkelmand } from "../entity/Winkelmand";
import { WinkelmandProducten } from "../entity/WinkelmandProducten";
import bedrijf from "./bedrijf";
import Koa from "koa";
import userservice from "../service/users";
import productservice from '../service/product'
import {Product} from "../entity/Product";

const debugLog = (message: any, meta = {}) => {
  logger.debug(message);
};

const winkelmandRepo = AppDataSource.getRepository(Winkelmand);
const winkelmandProductenRepo = AppDataSource.getRepository(WinkelmandProducten);
/**
 * Check if the server is healthy.
 */
const getWinkelmand = async () => {
  const winkelmand = await winkelmandRepo.find({
    relations: {
      user: true,
      winkelmandProducten: { product: { bedrijf: true } },
    },
    select: {
      user: { userId: true, firstname: true },
      winkelmandProducten: {
        id: false,
        winkelmand_id: false,
        aantal: true,
        product: {
          productId: true,
          bedrijf: { bedrijfId: true },
          voorraad: true,
        },
      },
    },
  });

  return winkelmand;
};

const seedWinkelmandOpAankopers = async () => {
  const users = await userservice.getAllUsers();
  for (let user of users) {
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

const testAddProduct = async (ctx: Koa.Context) => {
  const winkelmand = await winkelmandRepo.findOne({where: {id : 1}});
  const wmp = new WinkelmandProducten();
  const product = await productservice.getProductByProductId(ctx);
  console.log(JSON.stringify(product))

  if (product instanceof Product) {
    wmp.product = product;
    await winkelmandProductenRepo.save(wmp);
    winkelmand.winkelmandProducten.push(wmp);
    await winkelmandRepo.save(winkelmand);
    console.log("lol");
  }

  




 
}

export default {
  getWinkelmand,
  seedWinkelmandOpAankopers,
  testAddProduct
};
