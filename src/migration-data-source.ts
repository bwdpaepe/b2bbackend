import config from "../config/config";
import { User } from "./entity/User";
import { Bedrijf } from "./entity/Bedrijf";
import { Bestelling } from "./entity/Bestelling";
import { Notification } from "./entity/Notification";
import { Session } from "./entity/Session";
import { Product } from "./entity/Product";
import { AddSessions1681898251992 } from "./migrations/1681898251992-AddSessions";
import { AlterProducts1682016268609 } from "./migrations/1682016268609-AlterProducts";
import { DataSource } from "typeorm";
import { addWinkelmand1682691011492 } from "./migrations/1682691011492-addWinkelmand";
import { addWinkelmandProducten1682848647253 } from "./migrations/1682848647253-addWinkelmandProducten";
import { AddProductLevertermijn1683121543029 } from "./migrations/1683121543029-AddProductLevertermijn";
import { Winkelmand } from "./entity/Winkelmand";
import { WinkelmandProducten } from "./entity/WinkelmandProducten";
import { foreignkeysWinkelmandproducten1682931009287 } from "./migrations/1682931009287-foreignkeysWinkelmandproducten";

export default new DataSource({
  type: "mysql",
  host: config.database.host,
  port: Number(config.database.port),
  username: config.database.username,
  password: config.database.password,
  database: config.database.database,
  synchronize: false,
  logging: false,
  entities: [
    Bedrijf,
    User,
    Bestelling,
    Notification,
    Session,
    Product,
    Winkelmand,
    WinkelmandProducten,
  ],
  migrations: [
    AddSessions1681898251992,
    AlterProducts1682016268609,
    addWinkelmand1682691011492,
    addWinkelmandProducten1682848647253,
    foreignkeysWinkelmandproducten1682931009287,
    AddProductLevertermijn1683121543029,
  ],
});
