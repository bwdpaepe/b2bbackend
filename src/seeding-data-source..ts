import config from "../config/config";
import { User } from "./entity/User";
import { Bedrijf } from "./entity/Bedrijf";
import { Bestelling } from "./entity/Bestelling";
import { Notification } from "./entity/Notification";
import { Session } from "./entity/Session";
import { DataSource } from "typeorm";
import { Product } from "./entity/Product";

export default new DataSource({
  type: "mysql",
  host: config.database.host,
  port: Number(config.database.port),
  username: config.database.username,
  password: config.database.password,
  database: config.database.database,
  synchronize: false,
  logging: false,
  entities: [Bedrijf, User, Bestelling, Product, Notification, Session],
  migrations: [],
});
