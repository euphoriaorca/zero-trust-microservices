import { Response, NextFunction } from 'express';
import { Base64 } from 'js-base64';

import { AdminUserService, AppsService } from '../services';
import { IExpressRequest } from '../interfaces';
import { ErrorCode } from '../constants';
import { handleErrorResponse } from '../handlers';
import { ServicesService } from '../services/ServicesService';

export const Authentication = {
  /**
   * Handle service JWToken validation
   *  also checks allowed token permissions
   * @param permissions Allowed permissions
   */
  validateJWToken(permissions: string[]) {
    return async (req: IExpressRequest, res: Response, next: NextFunction): Promise<Response | void> => {
      // Auth token from headers
      const token: any = req.headers['x-auth-token'];

      // No API token provided
      if (!token) {
        return res.status(403).json({
          code: ErrorCode.FORBIDDEN,
          message: 'No token provided.',
        });
      }

      try {
        const decoded = await ServicesService.decodeToken(token);

        await ServicesService.findServiceById(decoded.serviceId);

        const hasRequiredPerms: boolean = 'permissions' in decoded && permissions.every((perm) => decoded.permissions.includes(perm));

        if (!hasRequiredPerms) {
          return res.status(403).json({
            code: ErrorCode.FORBIDDEN,
            message: 'Access without required permissions is forbidden',
          });
        }

        next();
      } catch (err) {
        return handleErrorResponse(err, res);
      }
    };
  },

  /**
   * Handles basic admin user authentication
   *  expecting username, password(token)
   *
   * @param {permissions}
   */
  validateAdminUser(permissions: string[]) {
    return async (req: IExpressRequest, res: Response, next: NextFunction): Promise<Response | void> => {
      if (!req.headers.authorization) {
        return res.status(400).json({
          code: ErrorCode.BAD_REQUEST,
          message: 'Authorization header is required.',
        });
      }

      // Extracts serviceId and password from headers and parse
      const [userId, password]: string[] = Base64.decode(req.headers.authorization.split(' ').filter(Boolean)[1]).split(':');

      try {
        const user = await AdminUserService.authenticateUser(userId, password);

        // Check that user has necessary permission(s)
        if (permissions.length === 0 || !permissions.every((perm) => user.permissions.includes(perm))) {
          return res.status(403).json({
            code: ErrorCode.FORBIDDEN,
            message: 'User does not have required permission(s)',
          });
        }

        req.userId = user.userId;

        next();
      } catch (err) {
        return handleErrorResponse(err, res);
      }
    };
  },

  /**
   * Validate application auth
   */
  validateAppAuth() {
    return async (req: IExpressRequest, res: Response, next: NextFunction): Promise<Response | void> => {
      if (!req.headers.authorization) {
        return res.status(400).json({
          code: ErrorCode.BAD_REQUEST,
          message: 'Authorization header is required.',
        });
      }

      // Extracts serviceId and password from headers and parse
      const [appId, password]: string[] = Base64.decode(req.headers.authorization.split(' ').filter(Boolean)[1]).split(':');

      try {
        const app = await AppsService.authenticateApp(appId, password);

        req.appId = appId;
        req.permissions = app.permissions;

        next();
      } catch (err) {
        handleErrorResponse(err, res);
      }
    };
  },

  /**
   * Handles basic service authentication
   *  expecting username, password(token)
   */
  validateServiceAuth() {
    return async (req: IExpressRequest, res: Response, next: NextFunction): Promise<Response | void> => {
      if (!req.headers.authorization) {
        return res.status(400).json({
          code: ErrorCode.BAD_REQUEST,
          message: 'Authorization header is required.',
        });
      }

      // Extracts serviceId and password from headers and parse
      const [serviceId, password]: string[] = Base64.decode(req.headers.authorization.split(' ').filter(Boolean)[1]).split(':');

      try {
        const service = await ServicesService.authenticateService(serviceId, password);

        req.serviceId = serviceId;
        req.permissions = service.permissions;

        next();
      } catch (err) {
        handleErrorResponse(err, res);
      }
    };
  },
};
