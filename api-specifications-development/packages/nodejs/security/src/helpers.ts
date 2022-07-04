import * as Jwt from 'jsonwebtoken';
import { Base64 } from 'js-base64';
import { IJwtVerifyOptions, ITokenDecoded, RoleTypes, TokenTypes } from './interfaces';
import { PERMS_APP_PREFIX, PERMS_SERVICE_PREFIX, PERMS_USER_PREFIX } from './constants';

/**
 * Verifies a JWToken
 *
 * @param {IJwtVerifyOptions} jwtOptions
 */
export const verifyJWToken = (jwtOptions: IJwtVerifyOptions): Promise<ITokenDecoded> => {
  return new Promise((resolve, reject) => {
    try {
      const { token, pubKey } = jwtOptions;

      Jwt.verify(
        token,
        Base64.decode(pubKey),
        {
          algorithms: ['RS256'],
        },
        (err: Error, decoded: ITokenDecoded) => {
          if (err) {
            return reject({
              statusCode: 403,
              data: err,
            });
          }

          resolve(decoded);
        },
      );
    } catch (err) {
      reject(err);
    }
  });
};

/**
 * Do roles assignment
 *
 * @param {TokenTypes} tokenType
 */
export const assignRole = (tokenType: TokenTypes): RoleTypes => {
  switch (tokenType) {
    case TokenTypes.APP:
      return RoleTypes.ROLE_APP;
    case TokenTypes.SERVICE:
      return RoleTypes.ROLE_SERVICE;
    case TokenTypes.USER:
      return RoleTypes.ROLE_USER;
    default:
      return RoleTypes.ROLE_GUEST;
  }
};

/**
 * Inspects permissions by roles (e.g. ROLE_USER can only have permissions users.)
 *
 * @param {RoleTypes} role
 * @param {string[]} permissions
 */
export const filterPermsByRole = (role: RoleTypes, permissions: string[]): string[] => {
  return permissions.filter(permission => {
    switch (role) {
      case RoleTypes.ROLE_APP:
        return permission.indexOf(PERMS_APP_PREFIX) === 0;
      case RoleTypes.ROLE_USER:
        return permission.indexOf(PERMS_USER_PREFIX) === 0;
      case RoleTypes.ROLE_SERVICE:
        return permission.indexOf(PERMS_SERVICE_PREFIX) === 0;
      default:
        return false;
    }
  });
};

export const checkPermissions = (requiredPermissions: string[], decodedPermissions: string[], requiresAll = true): boolean => {
  if (!decodedPermissions) {
    return false;
  }

  return requiresAll ? requiredPermissions.every(perm => decodedPermissions.includes(perm)) : requiredPermissions.some(perm => decodedPermissions.includes(perm))
};
