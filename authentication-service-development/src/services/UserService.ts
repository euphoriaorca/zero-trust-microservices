import Jwt from 'jsonwebtoken';
import moment from 'moment';

import { IUserHtokenRequest, IUserHtokenGenerated, IUserTokenRequest, IUserTokenGenerated } from '../interfaces';
import { JWT_TOKEN_TYPE, JWT_ISSUER, ErrorCode, USER_HTOKEN_EXPIRY } from '../constants';
import { Logger } from '../helpers';
import { ServicesService } from './ServicesService';

export const UserService = {
  /**
   * Generates a user handshake token
   *
   * @param request
   */
  generateHandshakeToken(request: IUserHtokenRequest): Promise<IUserHtokenGenerated> {
    const secKey: any = process.env.SERVICE_JWT_SECRET;
    const { userId, payload } = request;

    return new Promise((resolve, reject) => {
      try {
        Jwt.sign(
          {
            userId,
            tokenType: JWT_TOKEN_TYPE.USER,
            data: payload,
          },
          Base64.decode(secKey),
          {
            algorithm: 'RS256',
            issuer: JWT_ISSUER,
            expiresIn: `${USER_HTOKEN_EXPIRY}s`,
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
              userId,
              token,
              createdAt,
              expiresAt: moment(createdAt).add(USER_HTOKEN_EXPIRY, 'seconds').toDate(),
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
   * Generates a user authentication token
   *
   * @param request
   */
  async generateUserToken(request: IUserTokenRequest): Promise<IUserTokenGenerated> {
    const secKey: any = process.env.SERVICE_JWT_SECRET;
    const { payload = {}, permissions, ttl, htoken } = request;

    const decoded = await ServicesService.decodeToken(htoken);

    if (!decoded.userId || decoded.tokenType !== JWT_TOKEN_TYPE.USER) {
      throw {
        code: ErrorCode.FORBIDDEN,
        message: 'Handskahe token does not contain required information',
      };
    }

    return new Promise((resolve, reject) => {
      const { userId } = decoded;

      try {
        Jwt.sign(
          {
            userId,
            tokenType: JWT_TOKEN_TYPE.USER,
            permissions: decoded.data?.permissions || permissions,
            data: {
              ...payload,
              ...(decoded.data || {}),
            },
          },
          Base64.decode(secKey),
          {
            algorithm: 'RS256',
            issuer: JWT_ISSUER,
            expiresIn: `${ttl}s`,
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
              userId,
              token,
              permissions,
              createdAt,
              expiresAt: moment(createdAt).add(ttl, 'seconds').toDate(),
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
