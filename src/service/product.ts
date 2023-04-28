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
    const bedrijfId = Number(ctx.query.bedrijfId);

    if (!bedrijfId) {
      throw new Error("No correct bedrijfId was provided");
    }

    const products = await productRepository.find({
      where: { bedrijf: { bedrijfId: bedrijfId } },
    });

    if (!products || !products.length) {
      return (
        (ctx.status = 204),
        (ctx.body = { error: "No products found for bedrijfId " + bedrijfId })
      );
    }

    return products;
  } catch (error: any) {
    return (ctx.status = 400), (ctx.body = { error: error.message });
  }
};

const getProductById = async (ctx: Koa.Context) => {
  try {
    debugLog("GET product with productId " + ctx.query.productId);
    const productId = Number(ctx.query.productId);

    if (!productId) {
      throw new Error("No correct productId was provided");
    }

    const product = await productRepository.findOne({
      where: { productId: productId },
    });

    if (!product) {
      return (
        (ctx.status = 204),
        (ctx.body = { error: "No product found for productId " + productId })
      );
    }

    return product;
  } catch (error: any) {
    return (ctx.status = 400), (ctx.body = { error: error.message });
  }
};

const getAllProductByBedrijfIdAndProductId = async (ctx: Koa.Context) => {
  try {
    debugLog(
      "GET product with productId " +
        ctx.query.productId +
        " with bedrijfId " +
        ctx.query.bedrijfId
    );
    const bedrijfId = Number(ctx.query.bedrijfId);
    const productId = Number(ctx.query.productId);

    if (!bedrijfId) {
      throw new Error("No correct bedrijfId was provided");
    }

    if (!productId) {
      throw new Error("No correct productId was provided");
    }

    const product = await productRepository.findOne({
      where: { bedrijf: { bedrijfId: bedrijfId }, productId: productId },
    });

    if (!product) {
      return (
        (ctx.status = 204),
        (ctx.body = { error: "No product found for bedrijfId " + bedrijfId })
      );
    }

    return product;
  } catch (error: any) {
    return (ctx.status = 400), (ctx.body = { error: error.message });
  }
};

export default {
  checkProductEndpoint,
  getAllProductsByBedrijfId,
  getProductById,
  getAllProductByBedrijfIdAndProductId,
};
