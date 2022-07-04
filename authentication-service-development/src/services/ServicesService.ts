import bcrypt from 'bcryptjs';
import uuid4 from 'uuid/v4';
import cryptoRandomString from 'crypto-random-string';
import Jwt from 'jsonwebtoken';
import moment from 'moment';

import { Services } from '../models';
import { ErrorCode, JWT_TOKEN_TYPE, JWT_ISSUER, SERVICE_TOKEN_EXPIRY } from '../constants';
import { IServiceDto, IServiceTokenGenerated, ITokenDecoded } from '../interfaces';
import { ServicesMap } from '../mappers';
import { permsToString, permsToArray, Logger } from '../helpers';

export const ServicesService = {
  /**
   * Finds an service by it's Id
   *
   * @param serviceId
   */
  async findServiceById(serviceId: string): Promise<Services> {
    const service = await Services.findService({
      where: { serviceId },
    });

    if (!service) {
      throw {
        code: ErrorCode.RESOURCE_NOT_FOUND,
        message: 'Service by that Id does not exist.',
      };
    }

    return service;
  },

  /**
   * Authenticates a service by serviceId/password
   *
   * @param serviceId
   * @param password
   */
  async authenticateService(serviceId: string, password: string): Promise<IServiceDto> {
    const service = await this.findServiceById(serviceId);

    const match: boolean = await bcrypt.compare(password, service.password);

    if (!match) {
      throw {
        code: ErrorCode.FORBIDDEN,
        data: 'Access unauthorized (password)',
      };
    }

    return ServicesMap.mapToServiceDto(service);
  },

  /**
   * Creates a new service
   *
   * @param description
   * @param permissions
   * @param createdBy
   */
  async createService(description: string, permissions: string[], createdBy: string): Promise<IServiceDto> {
    const serviceId: string = uuid4();

    const password = cryptoRandomString({ length: 32 });
    const hash = await bcrypt.hash(password, 10);

    const service = await Services.createService({
      serviceId,
      description,
      permissions: permsToString(permissions),
      password: hash,
      createdBy,
    });

    return {
      ...ServicesMap.mapToServiceDto(service),
      token: password,
    };
  },

  /**
   * Updates a service permissions
   *
   * @param serviceId
   * @param permissions
   */
  async updateServicePermissions(serviceId: string, permissions: string[]): Promise<IServiceDto> {
    const service = await this.findServiceById(serviceId);

    const svcPerms: string[] = permsToArray(service.permissions);

    // concat current permissions with new permission(s)
    permissions.forEach((perm: string) => {
      if (!svcPerms.includes(perm)) {
        Logger.Info(serviceId, 'Adding permission: ', perm);
      }
    });

    svcPerms.forEach((perm: string) => {
      if (!permissions.includes(perm)) {
        Logger.Info(serviceId, 'Removing permission: ', perm);
      }
    });

    await Services.updateService(
      {
        permissions: permsToString(permissions),
      },
      {
        where: {
          serviceId,
        },
      },
    );

    return {
      ...ServicesMap.mapToServiceDto(service),
      permissions: permissions,
    };
  },

  /**
   * Generates a service token
   *
   * @param serviceId
   * @param permissions
   * @param payload
   */
  generateServiceToken(serviceId: string, permissions: string[], payload?: Object): Promise<IServiceTokenGenerated> {
    const secKey: any = process.env.SERVICE_JWT_SECRET;

    return new Promise((resolve, reject) => {
      Logger.Info(
        'Issuing token to service with serviceId: ' +
          serviceId +
          ', expiry ' +
          SERVICE_TOKEN_EXPIRY +
          's and permissions: ' +
          permissions.join(','),
      );

      try {
        Jwt.sign(
          {
            serviceId,
            tokenType: JWT_TOKEN_TYPE.SERVICE,
            permissions,
            data: payload,
          },
          Base64.decode(secKey),
          {
            algorithm: 'RS256',
            issuer: JWT_ISSUER,
            expiresIn: `${SERVICE_TOKEN_EXPIRY}s`,
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

            const createdAt = new Date();

            resolve({
              serviceId,
              permissions,
              token,
              createdAt,
              expiresAt: moment(createdAt).add(SERVICE_TOKEN_EXPIRY, 'seconds').toDate(),
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

  /**
   * Decodes a service token
   *
   * @param token
   */
  decodeToken(token: string): Promise<ITokenDecoded> {
    const pubKey: any = process.env.SERVICE_JWT_PUBLIC;

    return new Promise((resolve, reject) => {
      try {
        Jwt.verify(
          token,
          Base64.decode(pubKey),
          {
            algorithms: ['RS256'],
            issuer: JWT_ISSUER,
          },
          (err, decoded) => {
            if (err) {
              Logger.Error('TOKEN_DECODER ERR_1', err);

              return reject({
                code: ErrorCode.FORBIDDEN,
                message: 'Unable to decode token',
                data: err,
              });
            }

            resolve(<ITokenDecoded>decoded);
          },
        );
      } catch (err) {
        Logger.Error('TOKEN_DECODER ERR_2', err);

        reject(err);
      }
    });
  },
};
