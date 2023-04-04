import { logger } from "../server";
import bcrypt from "bcrypt";
import usersService from "./users";
import { User } from "../entity/User";
import jwtService from "../core/jwt";
import { Roles } from "../enums/Roles";
// import { UserRoles } from '../entity/UserRoles';

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return String(error.message);
  return String(error);
}

const makeExposedUser = (user: User) => ({
  id: user.id,
  username: user.username,
  roles: user.roles,
});

const makeLoginData = async (user: User) => {
  const token = await jwtService.generateJWT(user);
  return {
    user: makeExposedUser(user),
    token,
  };
};

const debugLog = (message: any, meta = {}) => {
  logger.debug(message);
};

const loginValidation = async (ctx: any) => {
  debugLog(
    "Checking authorisation of user with username: " + ctx.query.userName
  );
  try {
    const foundUser = await usersService.getUserByUsernameIncludingHashedPW(
      ctx
    );

    const passwordToCheck: string = ctx.query.password;
    const isMatch = bcrypt.compareSync(
      passwordToCheck,
      foundUser.password_hashed
    );

    if (isMatch) {
      return makeLoginData(foundUser);
    } else {
      throw new Error("The given username and password do not match");
    }
  } catch (error) {
    debugLog(
      "Authorisation of user with username '" + ctx.query.userName + "' failed"
    );
    return (ctx.status = 401);
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
    const [username, id, roles, ...rest] = values;

    return {
      username,
      id,
      roles,
      authToken,
    };
  } catch (error) {
    debugLog("Authentication failed: " + error);
    throw new Error(getErrorMessage(error));
  }
};

// method to check if the user has the required role
// the method receives the required role and the ctx object
// the ctx object contains the user id, and the user should be retrieved from the database
// the user should have a list of roles, and the method should check if the user has the required role
const checkUserPermission = async (requiredRole: Roles, ctx: any) => {
  try {
    const { authorization } = ctx.headers;
    const id = ctx.state.session.id;
    const user = await usersService.getUserById(id);
    // check if the user is of Type User
    if (!(user instanceof User)) {
      throw new Error("User not found");
    }
    const userRoles = user.roles;
    // check if the user has the required role or is an admin
    const hasPermission = userRoles.includes(Roles.ADMIN) || userRoles.includes(requiredRole);
    if (!hasPermission) {
      throw new Error(
        "You are not allowed to view this part of the application"
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
  } catch (error) {
    return (ctx.status = 401); // 401 = Unauthorized
  }
  return next();
};

export default {
  loginValidation,
  makeLoginData,
  checkAndParseSession,
  requireAuthentication,
  checkUserPermission,
};
