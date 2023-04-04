import config from "../../config/config";
import jwt from "jsonwebtoken";
import { logger } from "../server";

const JWT_AUDIENCE = config.auth.jwt.audience;
const JWT_SECRET = config.auth.jwt.secret;
const JWT_ISSUER = config.auth.jwt.issuer;
const JWT_EXPIRATION_INTERVAL = config.auth.jwt.expirationInterval;


const generateJWT = (user: { username: any; id: any; roles: any }) => {
  const tokenData = {
    userName: user.username,
    userId: user.id,
    roles: user.roles,
  };

  const signOptions = {
    expiresIn: Math.floor(Number(JWT_EXPIRATION_INTERVAL) / 1000), //omzetten van millisec naar seconden
    audience: JWT_AUDIENCE,
    issuer: JWT_ISSUER,
    subject: "auth",
  };

  return new Promise((resolve, reject) => {
    // sign-functie neemt de payload, het secret en de sign opties als argument
    jwt.sign(tokenData, JWT_SECRET, signOptions, (err, token) => {
      if (err) {
        logger.debug("Error while signing new token:", err.message);
        // in deze callback resolven of rejecten we de Promise indien nodig
        return reject(err);
      }
      return resolve(token);
    });
  });
};

const verifyJWT = (authToken: string) => {
  const verifyOptions = {
    audience: JWT_AUDIENCE,
    issuer: JWT_ISSUER,
    subject: "auth",
  };

  // omdat jwt.verify ook met een callback werkt, moeten we deze wrappen in een Promise
  return new Promise((resolve, reject) => {
    // jwt.verify verwacht de JWT, het secret en de opties als argumenten
    jwt.verify(authToken, JWT_SECRET, verifyOptions, (err, decodedToken) => {
      // als laatste volgt een callback die opgeroepen zal worden als de token gecontroleerd is
      if (err || !decodedToken) {
        logger.error("Error while verifying token:", err.message);
        return reject(err || new Error("Token could not be parsed"));
      }
      return resolve(decodedToken);
    });
  });
};

export default {
  generateJWT,
  verifyJWT,
};
