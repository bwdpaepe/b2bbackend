import config from "../config/config";
import { User } from "./entity/User";
import { Bedrijf } from "./entity/Bedrijf";
import { Bestelling } from "./entity/Bestelling";
import { Notification } from "./entity/Notification";
import { Session } from "./entity/Session";
import { AddSessions1681898251992 } from "./migrations/1681898251992-AddSessions";
import { DataSource } from "typeorm";


export default new DataSource(
{
    type: "mysql",
    host: config.database.host,
    port: Number(config.database.port),
    username: config.database.username,
    password: config.database.password,
    database: config.database.database,
    synchronize: false,
    logging: false,
    entities: [Bedrijf, User, Bestelling, Notification, Session],
    migrations: [AddSessions1681898251992],
});