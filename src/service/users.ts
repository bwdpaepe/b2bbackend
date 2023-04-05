import Koa from "koa";
import { logger } from "../server";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
//import bcrypt from "bcrypt";
import authService from "./auth";
import config from "../../config/config";
import { Functions } from "../enums/Functions";

const debugLog = (message: any, meta = {}) => {
  logger.debug(message);
};

// Ophalen repository
// https://typeorm.io/#using-repositories
const usersRepository = AppDataSource.getRepository(User);

/**
 * Check if the endpoint /api/users/ is available.
 */
const checkUserEndpoint = async () => {
  debugLog("GET user endpoint called");
  return "User endpoint is available";
};

/**
 * Get list of all users.
 */
const getAllUsers = async () => {
  debugLog("GET list of all users");
  return await usersRepository.find();
};

/**
 * Get user via userId => nodig in service\auth.ts
 */
const getUserById = async (userId: any) => {
  debugLog("GET user with userId " + userId);
  try {
    const user = await usersRepository.findOneBy({ userId: Number(userId) });
    return user;
  } catch (error) {
    debugLog("User with userId " + userId + " doesn't exist");
  }
};

/**
 * Get user via JWT token.
 */
const getUserViaJwtToken = async (ctx: Koa.Context) => {
  const JWTUserInfo = await authService.checkAndParseSession(
    ctx.headers.authorization
  );
  const JWTuserId = JWTUserInfo.userId;
  debugLog("GET user via JWT token: useId = " + JWTuserId);
  const user = await usersRepository.findOneBy({ userId: JWTuserId });
  // return 204-status (no content) als geen user met de opgegeven userId
  if (!user) {
    debugLog("User with userId: " + JWTuserId + " doesn't exist");
    return (ctx.status = 204);
  }
  // return de gevonden user
  debugLog("User with userId: " + JWTuserId + " found via JWT token");
  return user;
};

/**
 * Get user by email.
 * BELANGRIJK: email heeft UNIQUE constraint in database, dus kan altijd maar 1 user returnen
 */
const getUserByEmail = async (ctx: any) => {
  debugLog("GET user by username: " + ctx.query.userName);
  const userToCheck: string = ctx.query.userName;
  const user = await usersRepository.findOneBy({
    email: userToCheck,
  });
  // return 204-status (no content) als geen user met de opgegeven Username
  if (!user) {
    debugLog("User with email: " + ctx.query.email + " doesn't exist");
    throw new Error("User with email: " + ctx.query.email + " doesn't exist");
  }
  // return de gevonden user
  debugLog("User with email: " + ctx.query.email + " found");
  return user;
};

/**
 * Get user by Email, INCLUDING HASHED PASSWORD FROM THE DATABASE.
 * BELANGRIJK: Email heeft UNIQUE constraint in database, dus kan altijd maar 1 user returnen
 */
const getUserByEmailIncludingHashedPW = async (ctx: any) => {
  debugLog("GET user by email including hashed PW: " + ctx.query.email);
  const userToCheck: string = ctx.query.email;
  const user = await usersRepository
    .createQueryBuilder("user")
    .where("user.email = :email", { email: userToCheck })
    .addSelect("user.passwordHashed") // Nodig om de gehide column passwordHashed ook op te halen !
    .getOne(); // Altijd max 1, want userName heeft Unique constraint in database

  // return 204-status (no content) als geen user met de opgegeven Username
  if (!user) {
    debugLog("User with email: " + ctx.query.email + " doesn't exist");
    throw new Error("User with email " + ctx.query.email + " doesn't exist");
  }
  // return de gevonden user
  debugLog("User with email " + ctx.query.email + " found");
  return user;
};

/**
 * Check if a user is logged in and login is still valid .
 */
const checkIfUserIsLoggedin = async (ctx: Koa.Context) => {
  try {
    const JWTUserInfo = await authService.checkAndParseSession(
      ctx.headers.authorization
    );
    console.log("JWTUserInfo: " + JWTUserInfo);
    const JWTuserId = JWTUserInfo.userId;
    debugLog("Check if logged in user" + JWTuserId + " is still valid");
    debugLog(JWTUserInfo !== null);
    return JWTUserInfo !== null; // true = logged in
  } catch (error) {
    return (ctx.status = 401); // Unauthorized
  }
};

export default {
  checkUserEndpoint,
  getAllUsers,
  getUserById,
  getUserViaJwtToken,
  getUserByEmail,
  getUserByEmailIncludingHashedPW,
  checkIfUserIsLoggedin,
};
