import Koa from "koa";
import { logger } from "../server";
import { AppDataSource } from "../data-source";
import { Product } from "../entity/Product";

const debugLog = (message: any) => {
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

const getAllProductsByBedrijfId = async (ctx: Koa.Context) => {
  try {
    debugLog("GET producten with bedrijfId " + ctx.query.bedrijfId);
    //const bedrijfId = Number(ctx.query.bedrijfId);
    const bedrijfId = Number(ctx.params.bedrijfId);

    if (!bedrijfId) {
      throw new Error("No correct bedrijfId was provided");
    }

    const products = await productRepository.find({
      where: { bedrijf: { bedrijfId: bedrijfId } },
    });

    if (!products) {
      return (
        (ctx.status = 404),
        (ctx.body = {
          error:
            "There went something wrong when loading products from company with Id:  " +
            bedrijfId,
        })
      );
    }

    if (products.length === 0) {
      debugLog("No products found for company with Id:  " + bedrijfId);
      return (ctx.status = 204);
    }

    return products;
  } catch (error: any) {
    return (ctx.status = 400), (ctx.body = { error: error.message });
  }
};

const getProductByProductId = async (ctx: Koa.Context) => {
  try {
    debugLog("GET product with productId " + ctx.query.productId);
    const productId = Number(ctx.params.productId);


    if (!productId) {
      throw new Error("No correct productId was provided");
    }

    const product = await productRepository.findOne({
      where: { productId: productId },
    });

    if (!product) {
      debugLog("No product found with Id: " + productId);
      return (ctx.status = 204);
    }

    return product;
  } catch (error: any) {
    return (ctx.status = 400), (ctx.body = { error: error.message });
  }
};

export default {
  checkProductEndpoint,
  getAllProductsByBedrijfId,
  getProductByProductId,
};
