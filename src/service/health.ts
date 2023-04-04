// const packageJson = require("../../package.json");  //Niet meer nodig, resolveJsonModule in tsconfig aangezet
import packageJson from "../../package.json";
import { logger } from '../server';


const debugLog = (message: any, meta = { }) => {
  logger.debug(message);
};

/**
 * Check if the server is healthy. 
 */
const ping = async () => {
  debugLog("GET health ping");
  return Promise.resolve({ pong: true });
};

/**
 * Get the running server's information.
 */
const getVersion = async () => {
  debugLog("GET health service");
  return Promise.resolve({
    env: process.env.NODE_ENV,
    version: packageJson.version,
    name: packageJson.name,
  });
};

export default {
  ping,
  getVersion,
};
