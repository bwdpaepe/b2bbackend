import { logger } from '../server';
import { AppDataSource } from "../data-source";
import { Winkelmand } from '../entity/Winkelmand';
import { WinkelmandProducten } from '../entity/WinkelmandProducten';


const debugLog = (message: any, meta = { }) => {
  logger.debug(message);
};

const winkelmandRepo = AppDataSource.getRepository(Winkelmand);
/**
 * Check if the server is healthy. 
 */
const getWinkelmand = async () => {
  const winkelmand = await winkelmandRepo.find({relations:{winkelmandProducten: {product: {bedrijf : true}}}, select: {winkelmandProducten : {product_id : false, winkelmand_id : true, aantal: true,  product:{productId : true, naam: true, eenheidsprijs: true ,bedrijf:{bedrijfId : true}}}}})

  

  return winkelmand;
};

export default {
  getWinkelmand,
};
