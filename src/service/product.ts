import Koa from "koa";
import { logger } from "../server";
import { AppDataSource } from "../data-source";
import { Product } from "../entity/Product";
import { Bedrijf } from "../entity/Bedrijf";
import { getBedrijfById } from "../rest/_bedrijf";

const debugLog = (message: any, meta = {}) => {
  logger.debug(message);
};

// Ophalen repository
// https://typeorm.io/#using-repositories
const productRepository = AppDataSource.getRepository(Product);

/**
 * Check if the endpoint /api/product/ is available.
 */
const checkProductEndpoint = async () => {
  debugLog("GET product endpoint called");
  return "Product endpoint is available";
};

const getAllProduct = async () => {
  debugLog("GET list of all products");
  return await productRepository.find();
};

//WIP
const getAllProductsByBedrijfId = async (ctx: Koa.Context) => {
  try {
    const bedrijfId = Number(ctx.query.bedrijfId);
    const products = await productRepository.find({
      where: { bedrijf: { bedrijfId: bedrijfId } },
    });
    ctx.body = products;
  } catch (error: any) {
    ctx.status = 400;
    ctx.body = { error: error.message };
  }
};

export default {
  checkProductEndpoint,
  getAllProduct,
  getAllProductsByBedrijfId,
};
