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

const AddProduct = async (ctx: Koa.Context) => {
  const { userId } = ctx.state.session;
  const productId = ctx.params.product_id;
  const aantal = ctx.params.aantal;
  const winkelmand = await winkelmandRepo.findOne({where: {user : {userId : userId}}, relations : {winkelmandProducten : true}});
  const product = await productRepo.findOne({where: {productId : productId}});

  if(!winkelmand){
    return ctx.status = 500, ctx.body = {error: "De gebruiker heeft geen beschikbare winkelmand, contacteer de site administrator"}
  }
  if (product) {
    if(winkelmand.winkelmandProducten.filter(wmp => wmp.product_id === product.productId).length){
      return ctx.status = 400, ctx.body = {error : "Dit product zit al reeds in je bestelling"}
    }
    if (product.voorraad < aantal) {
      return ctx.status = 400, ctx.body = {error : "De voorraad van dit product is lager dan het gewenste aantal"}
    }
    const wmp = new WinkelmandProducten();
    wmp.product = product;
    wmp.winkelmand = winkelmand;
    wmp.aantal = aantal;
    await winkelmandProductenRepo.save(wmp);
    ctx.status = 200;
    return;
  }
  else{
    return ctx.status = 404, ctx.body = {error : "Dit product bestaat niet"};
  }  

}

export default {
  getWinkelmand,
  seedWinkelmandOpAankopers,
  AddProduct
};
