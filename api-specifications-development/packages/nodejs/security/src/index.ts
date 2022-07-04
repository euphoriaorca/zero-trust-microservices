import { NextFunction, RequestHandler, Response } from 'express';
import { IConfigOptions, IExpressRequest, ITokenDecoded, RoleTypes, TokenTypes } from './interfaces';
import { HEADER_TOKEN_NAME } from './constants';
import { assignRole, checkPermissions, filterPermsByRole, verifyJWToken } from './helpers';

/**
 * Do security checks and assign roles
 *
 * @param {IAuthValidatorOptions} validatorOptions
 */
class DistinctSecurity {
  private configOptions: IConfigOptions;

  constructor(configOptions: IConfigOptions) {
    this.configOptions = configOptions;
  }

  static config(configOptions: IConfigOptions): DistinctSecurity {
    return new DistinctSecurity(configOptions);
  }

  /**
   * Decode token and filter request by required role(s) and permission(s)
   *
   * @param roles
   * @param permissions
   */
  requiresRolePermissions(role: RoleTypes, permissions: string[], requiresAllPermissions = true): RequestHandler {
    return (req: IExpressRequest, res: Response, next: NextFunction): Response | void => {
      const { pubKey, handleJsonResponse } = this.configOptions;

      // Auth token from headers
      const token = <string>req.headers[HEADER_TOKEN_NAME];

      // No API token provided
      if (!token) {
        return res.status(403).json(handleJsonResponse!(403, 'No API token provided'));
      }

      verifyJWToken({ token, pubKey })
        .then((decoded: ITokenDecoded): Response | void => {
          const tokenType = decoded.tokenType;
          const roleType = assignRole(tokenType);

          req.auth = {
            token,
            // Assign a role (app, guest, service, user)
            role: roleType,
            // Decoded permissions
            permissions: filterPermsByRole(roleType, decoded.permissions),
            managedAccount: decoded.data?.managedAccount,
          };

          // Check that role is defined and tokenType matches role
          if (!(role && role === req.auth.role)) {
            return res.status(403).json(handleJsonResponse!(403, 'Access without required permissions is forbidden'));
          }

          const hasPermissions = checkPermissions(permissions, req.auth.permissions, requiresAllPermissions);

          if (!hasPermissions) {
            return res.status(403).json(handleJsonResponse!(403, 'Access without required permissions is forbidden'));
          }

          if (tokenType === TokenTypes.USER) {
            req.userId = decoded.userId;
          } else if (tokenType === TokenTypes.SERVICE) {
            /**
             * Assign role type for services
             */
            req.serviceId = decoded.serviceId;
          } else if (tokenType === TokenTypes.APP) {
            req.appId = decoded.appId;
          } else {
            res.status(403).json(handleJsonResponse!(403, 'Unrecognized token type'));
          }

          if (req.auth.managedAccount) {
            const { managedAccount } = req.auth;

            req.userId = managedAccount.id;
            req.managerUserId = decoded.userId;
          }

          next();
        })
        .catch(err => {
          const code = err.statusCode;

          if (code) {
            res.status(code).json(handleJsonResponse!(code, err));
          } else {
            res.status(500).json(handleJsonResponse!(500, err));
          }
        });
    };
  }
}

export default DistinctSecurity;
