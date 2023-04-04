import dotenv from "dotenv";
import path from "path";

// Lees .env file in
dotenv.config({path: path.resolve(__dirname, "../.env")});

// Interface to load env variables
// Note these variables can possibly be undefined
// as someone could skip these varibales or not setup a .env file at all

interface ENV {
  NODE_ENV: string | undefined;
  PORT: number | undefined;
  DATABASE_USERNAME: string | undefined;
  DATABASE_PASSWORD: string | undefined;
  DATABASE_HOST: string | undefined;
  DATABASE_PORT: number | undefined;
  DATABASE_NAME: string | undefined;
  JWT_SECRET: string | undefined;
  BCRYPTHASHING_SALT_ROUNDS: string | undefined;
  CORS_ORIGIN: string | undefined;
}

interface Config {
  NODE_ENV: string;
  PORT: number;
  DATABASE_USERNAME: string;
  DATABASE_PASSWORD: string;
  DATABASE_HOST: string;
  DATABASE_PORT: number;
  DATABASE_NAME: string;
  JWT_SECRET: string;
  BCRYPTHASHING_SALT_ROUNDS: string;
  CORS_ORIGIN: string;
}

// Loading process.env as ENV interface
const getConfig = (): ENV => {
  return {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT ? Number(process.env.PORT) : 9000,
    DATABASE_USERNAME: process.env.DATABASE_USERNAME,
    DATABASE_PASSWORD: process.env.DATABASE_PASSWORD,
    DATABASE_HOST: process.env.DATABASE_HOST,
    DATABASE_PORT: Number(process.env.DATABASE_PORT),
    DATABASE_NAME: process.env.DATABASE_NAME,
    JWT_SECRET: process.env.JWT_SECRET,
    BCRYPTHASHING_SALT_ROUNDS: process.env.BCRYPTHASHING_SALT_ROUNDS,
    CORS_ORIGIN: process.env.CORS_ORIGIN,
  };
};

// Throwing an Error if any field was undefined we don't 
// want our app to run if it can't connect to DB and ensure 
// that these fields are accessible. If all is good return
// it as Config which just removes the undefined from our type 
// definition.
const getSanitzedConfig = (config: ENV): Config => {
  for (const [key, value] of Object.entries(config)) {
    if (value === undefined) {
      throw new Error(`Missing key ${key} in config.env`);
    }
  }
  return config as Config;
};

const config = getConfig();

const sanitizedConfig = getSanitzedConfig(config);

export default sanitizedConfig;