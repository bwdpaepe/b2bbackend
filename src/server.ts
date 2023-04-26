import Koa from "koa";
import bodyParser from "koa-bodyparser";
import config from "../config/config";
import cors from "koa2-cors";
import installRest from "./rest";
import { AppDataSource } from "./data-source";
import { initializeLogger, getLogger } from "./core/logging";

/**
 * Logger initialiseren en ophalen
 */
initializeLogger({
  level: config.logger.level, //"debug",
  disabled: false,
  defaultMeta: {},
});
// geïnitialiseerde logger wordt ook geëxporteerd, voor gebruik in de rest van de applicatie
export const logger = getLogger();
logger.info(`Log level is: ${config.logger.level}`);

const app: Koa = new Koa();

//pipeline
app.use(bodyParser());
logger.debug(`Installation of bodyparser completed`);

app.use(
  cors({
    origin: config.cors.origin, // aanpassen via .env file
    allowHeaders: ["Content-Type", "Authorization", "Accept"], //, "Access-Control-Allow-Origin", "Access-Control-Allow-Headers"
    allowMethods: ["GET", "POST", "DELETE", "PUT"],
    maxAge: 3600, // 1 uur
  })
);
logger.debug(`Installation of CORS policies completed`);

installRest(app);
logger.debug(`Installation of REST routes completed`);

AppDataSource.initialize(); // Om de connectie met mySQL database via TypeORM te initialiseren

app
  .listen(config.PORT, async () => {
    logger.info(
      `${config.NODE_ENV} - Server listening on port: ${config.PORT}`
    );
  })
  .on("error", (err) => {
    logger.error(`${config.NODE_ENV} - ${err}`);
  });
