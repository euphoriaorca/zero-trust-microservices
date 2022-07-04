import uuid from 'uuid';
import cryptoRandomString from 'crypto-random-string';
import bcrypt from 'bcryptjs';
import Jwt from 'jsonwebtoken';

import { lookupDomainIp, Logger, permsToString, permsToArray } from '../helpers';
import { AppTypes, IAppDto, IAppTokenGenerated } from '../interfaces';
import { ErrorCode, JWT_TOKEN_TYPE, JWT_ISSUER } from '../constants';
import { Applications } from '../models';
import { AppsMap } from '../mappers';

export const AppsService = {
  /**
   * Finds an app by it's Id
   *
   * @param appId
   */
  async findAppById(appId: string): Promise<Applications> {
    const app = await Applications.findApplication({
      where: { appId },
    });

    if (!app) {
      throw {
        code: ErrorCode.RESOURCE_NOT_FOUND,
        message: 'App by that Id does not exist.',
      };
    }

    return app;
  },

  /**
   * Registers a new application
   *
   * @param appType
   * @param description
   * @param domain
   */
  async registerApp(appType: AppTypes, description: string, permissions: string[], createdBy: string, domain?: string): Promise<IAppDto> {
    let ip;

    if (appType === AppTypes.BROWSER) {
      if (!domain) {
        throw {
          code: ErrorCode.BAD_REQUEST,
          message: 'For browser app types, a valid *domain* is required.',
        };
      }

      // do dns lookup
      ip = await lookupDomainIp(domain);
    }

    const password = cryptoRandomString({ length: 32 });
    const hash = await bcrypt.hash(password, 10);

    const app = await Applications.createApplication({
      appId: uuid.v4(),
      appType,
      domain,
      ip,
      description,
      permissions: permsToString(permissions),
      password: hash,
      createdBy,
    });

    return {
      ...AppsMap.mapToAppDto(app),
      token: password,
    };
  },

  /**
   * Updates an application's permissions
   *
   * @param appId
   * @param permissions
   */
  async updateAppPermissions(appId: string, permissions: string[]): Promise<IAppDto> {
    const app = await this.findAppById(appId);

    const appPerms: string[] = permsToArray(app.permissions);
    // concat current permissions with new permission(s)
    const allPermissions: string[] = appPerms.concat(
      // filter duplicate permissions
      permissions.filter((perm: string) => !appPerms.includes(perm)),
    );

    // update permissions
    await Applications.updateApplication(
      {
        permissions: allPermissions.join(','),
      },
      {
        where: {
          appId,
        },
      },
    );

    return {
      ...AppsMap.mapToAppDto(app),
      permissions: allPermissions,
    };
  },

  /**
   * Authenticates an application
   *
   * @param appId
   * @param password
   */
  async authenticateApp(appId: string, password: string): Promise<IAppDto> {
    const app = await this.findAppById(appId);

    const match: boolean = await bcrypt.compare(password, app.password);

    if (!match) {
      throw {
        code: ErrorCode.FORBIDDEN,
        data: 'Access unauthorized (password)',
      };
    }

    return AppsMap.mapToAppDto(app);
  },

  /**
   * Generates an application token
   *
   * @param appId
   * @param payload
   */
  generateAppToken(appId: string, permissions: string[], payload?: Object): Promise<IAppTokenGenerated> {
    const secKey: any = process.env.SERVICE_JWT_SECRET;

    return new Promise((resolve, reject) => {
      try {
        Jwt.sign(
          {
            appId,
            tokenType: JWT_TOKEN_TYPE.APP,
            permissions,
            data: payload,
          },
          Base64.decode(secKey),
          {
            algorithm: 'RS256',
            issuer: JWT_ISSUER,
          },
          (err, token) => {
            if (err) {
              Logger.Error('TOKEN_SIGNING', err);

              reject({
                code: ErrorCode.SERVER_ERROR,
                message: 'Jwt signing failed.',
                data: err.stack,
              });
            }

            resolve({
              appId,
              permissions,
              token,
              createdAt: new Date(),
            });
          },
        );
      } catch (err) {
        Logger.Error('TOKEN_GENERATION', err);

        reject({
          code: ErrorCode.SERVER_ERROR,
          message: 'Token generation failed.',
          data: err.stack,
        });
      }
    });
  },
};
