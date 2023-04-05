import "reflect-metadata";
import { DataSource } from "typeorm";
import { logger } from "./server";
import config from "../config/config";
import { User } from "./entity/User";


export const AppDataSource = new DataSource({
  type: "mysql",
  host: config.database.host,
  port: Number(config.database.port),
  username: config.database.username,
  password: config.database.password,
  database: config.database.database,
  synchronize: false,
  logging: false,
  entities: [
    User,
  ],
  migrations: [],
  subscribers: [],
});

// to initialize initial connection with the database, register all entities
// and "synchronize" database schema, call "initialize()" method of a newly created database
// once in your application bootstrap
AppDataSource.initialize()
  .then(async () => {
    logger.debug(`AppDataSource from data-source.ts initialized`);
  })
  .catch((error) => logger.error(error));
