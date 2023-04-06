import { confDev } from "./development";
import { confProd } from "./production";
import { confTest } from "./testconfig";
import configVariables from "./environmentalvariables";

let configFile;
if (configVariables.NODE_ENV == "development") {
  configFile = confDev;
} else if (configVariables.NODE_ENV == "production") {
  configFile = confProd;
} else if (configVariables.NODE_ENV == "test") {
  configFile = confTest;
} else {
  throw new Error("NODE_ENV is not valid, check .env file");
}

const config = {
  PORT: configVariables.PORT || "9000", //Waarde uitgelezen uit geïmporteerde conf-files, en fallback op poort 9000
  // Waardes via 'process.env' worden uitgelezen uit .env file
  NODE_ENV: configVariables.NODE_ENV,
  database: {
    username: configVariables.DATABASE_USERNAME,
    password: configVariables.DATABASE_PASSWORD,
    host: configVariables.DATABASE_HOST,
    port: configVariables.DATABASE_PORT,
    type: "mysql",
    database: configVariables.DATABASE_NAME,
  },
  logger: {
    level: configFile.loglevel,
  },
  bcryptHashing: {
    saltRounds: Number(configVariables.BCRYPTHASHING_SALT_ROUNDS),
  },
  auth: {
    jwt: {
      secret: configVariables.JWT_SECRET,
      expirationInterval: configFile.auth.jwt.expirationInterval,
      issuer: configFile.auth.jwt.issuer,
      audience: configFile.auth.jwt.audience,
    },
  },
  cors: {
    origin: configVariables.CORS_ORIGIN,
  },
};

export default config;
