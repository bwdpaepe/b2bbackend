import Router from "koa-router";
import usersService from "../service/users";
import Koa, { Next } from "koa";
import { logger } from "../server";
import authService from "../service/auth";
import { Functions } from "../enums/Functions";

// GET rest route
const checkUserEndpoint = async (ctx: Koa.Context) => {
  ctx.body = await usersService.checkUserEndpoint();
};

// GET all users
const getAllUsers = async (ctx: Koa.Context) => {
  ctx.body = await usersService.getAllUsers();
};

// GET user via JWT token
export const getUserViaJwtToken = async (ctx: Koa.Context) => {
  ctx.body = await usersService.getUserViaJwtToken(ctx);
};

// GET user by email
export const getUserByEmail = async (ctx: Koa.Context) => {
  ctx.body = await usersService.getUserByEmail(ctx);
};

// GET check if logged in user is admin (admin = 1)
const checkIfUserIsLoggedin = async (ctx: Koa.Context) => {
  ctx.body = await usersService.checkIfUserIsLoggedin(ctx);
};


/**
 * Install users routes in the given router.
 * @param {Router} app - The parent router.
 */

export default function installUsersRoutes(app: any) {
  const router = new Router({
    prefix: "/user",
  });

  /**
   * PUBLIC ROUTES
   */
  // Test van de users endpoint
  router.get("/test", checkUserEndpoint);

  /**
   * PROTECTED ROUTES
   */
  
  // GET all users - Only allowed for Role.USERADMIN
  router.get(
    "/all",
    // authService.requireAuthentication,
    // authService.checkRolePermission(Roles.USERADMIN),
    getAllUsers
  );

  // GET user via JWT token
    router.get(
      "/currentuser",
      authService.requireAuthentication,
      getUserViaJwtToken
    );
    
  // GET find user by username
  router.get(
    "/find",
    // authService.requireAuthentication,
    // authService.checkRolePermission(Roles.USERADMIN),
    getUserByEmail
  );

  // GET check if user is logged in
  router.get(
    "/checklogin",
    authService.requireAuthentication,
    checkIfUserIsLoggedin
  );

  app.use(router.routes()).use(router.allowedMethods());
  logger.debug(`Installation of User Routes (_users.ts) completed`);
}
