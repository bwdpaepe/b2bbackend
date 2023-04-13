import { logger } from "../server";
import bcrypt from "bcrypt";
import usersService from "./users";
import { User } from "../entity/User";
import jwtService from "../core/jwt";
import { Functions } from "../enums/Functions";
import { Next } from "koa";

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return String(error.message);
  return String(error);
}

const makeLoginData = async (user: User) => {
  const token = await jwtService.generateJWT(user);
  const { passwordHashed, isActive, ...userWithoutPrivateFields } = user; // make user-obj without the private fields
  return {
    user: userWithoutPrivateFields,
    token,
  };
};

const debugLog = (message: any, meta = {}) => {
  logger.debug(message);
};

const loginValidation = async (ctx: any) => {
  debugLog("Checking authorisation of user with email: " + ctx.query.email);
  try {
    const foundUser = await usersService.getUserByEmailIncludingHashedPW(ctx);

    const passwordToCheck: string = ctx.query.password;
    const isMatch = bcrypt.compareSync(
      passwordToCheck,
      foundUser.passwordHashed
    );

    if (isMatch) {
      // if user is not active, throw error
      if (!foundUser.isActive) {
        debugLog("User is not active");
        throw new Error("User is not active");
      }
      // if user is not an admin or aankoper, throw error
      if (
        //foundUser.function.toLowerCase() !== Functions.ADMIN.toLowerCase() &&  // uncomment this line if you want to allow admins to login
        foundUser.function.toLowerCase() !== Functions.AANKOPER.toLowerCase()
      ) {
        debugLog("User function has no access rights");
        throw new Error("User function has no access rights");
      }
      return makeLoginData(foundUser);
    } else {
      throw new Error("The given email and password do not match");
    }
  } catch (error) {
    debugLog("Authorisation of user with email '" + ctx.query.email + "' failed");
    return (
      (ctx.status = 401), // 401 = Unauthorized
      (ctx.body = {error: "Authorisation of user with email '" + ctx.query.email + "' failed", 
      })
    );
  }
};

const checkAndParseSession = async (authHeader: any) => {
  try {
    if (!authHeader) {
      throw new Error("You need to be signed in");
    }

    // indien de header niet start met "Bearer " gooien we ook een fout, dit moet zo per definitie
    if (!authHeader.startsWith("Bearer ")) {
      throw new Error("Invalid authentication token");
    }

    const authToken = authHeader.substr(7); // "Bearer" weghalen van de autoHeader

    const decodedToken: object = (await jwtService.verifyJWT(
      authToken
    )) as object;

    const values = Object.values(decodedToken);
    const [email, userId, _function, ...rest] = values; //_function want function is een reserved keyword

    return {
      email: email as string,
      userId: userId as number,
      function: _function as string,
      authToken,
    };
  } catch (error) {
    debugLog("Authentication failed: " + error);
    throw new Error(getErrorMessage(error));
  }
};

// helper method, called within checkRolePermission, to check if the user has the required role
// the method receives the required role and the ctx object
// the ctx object contains the user id, and the user should be retrieved from the database
// the user should have a list of roles, and the method should check if the user has the required role
const checkUserPermission = async (requiredFunction: Functions, ctx: any) => {
  try {
    const { authorization } = ctx.headers;
    const { ...session } = await checkAndParseSession(authorization);
    const userId = session.userId;
    const user = await usersService.getUserById(userId);
    // check if the user is of Type User
    if (!(user instanceof User)) {
      throw new Error("User not found");
    }
    // if user is not active, throw error
    if (!user.isActive) {
      debugLog("User is not active");
      throw new Error("User is not active");
    }
    const userFunction = user.function;
    // check if the user has the required function 
    const hasPermission =
      userFunction.toLowerCase() === requiredFunction.toLowerCase() 
      // || userFunction.toLowerCase() === Functions.ADMIN.toLowerCase(); // admin has access to everything
    debugLog("User function: " + userFunction.toLowerCase() + ", Required function: " + requiredFunction.toLowerCase() + ", Has permission: " + hasPermission );
    if (!hasPermission) {
      throw new Error(
        "You are not allowed to view this part of the application. User function: " +
          userFunction +
          ", required function: " +
          requiredFunction
      );
    }
  } catch (error) {
    debugLog("Authorization failed: " + error);
    throw new Error(getErrorMessage(error));
  }
};

const requireAuthentication = async (ctx: any, next: any) => {
  try {
    const { authorization } = ctx.headers;
    const { authToken, ...session } = await checkAndParseSession(authorization);

    ctx.state.session = session;
    ctx.state.authToken = authToken;
  } catch (error: any) {
    return (ctx.status = 401), (ctx.body = { error: error.message }); // 401 = Unauthorized
  }
  return next();
};

const checkRolePermission = (requiredFunction: Functions) => {
  return async (ctx: any, next: Next) => {
    try {
      await checkUserPermission(requiredFunction, ctx);
      await next();
    } catch (error) {
      debugLog("Authorization failed: " + error);
      return (
        (ctx.status = 403), // 403 = Forbidden
        (ctx.body = { error: "You do not have permission to access this resource"})
      );
    }
  };
};

export default {
  loginValidation,
  makeLoginData,
  checkAndParseSession,
  requireAuthentication,
  checkRolePermission,
};
