import { Response } from 'express';

import { IExpressRequest, IUserHtokenRequest, IUserTokenRequest } from '../interfaces';
import { handleErrorResponse } from '../handlers';
import { UserService } from '../services';

export const UserController = {
  /**
   * Generates a user handshake token
   *
   * @param req
   * @param res
   */
  async generateHToken(req: IExpressRequest, res: Response): Promise<void> {
    try {
      const userToken = await UserService.generateHandshakeToken(<IUserHtokenRequest>req.body);
      res.status(201).json(userToken);
    } catch (err) {
      handleErrorResponse(err, res);
    }
  },

  /**
   * Generates a user token
   *
   * @param req
   * @param res
   */
  async generateToken(req: IExpressRequest, res: Response): Promise<void> {
    try {
      const userToken = await UserService.generateUserToken(<IUserTokenRequest>req.body);
      res.status(201).json(userToken);
    } catch (err) {
      handleErrorResponse(err, res);
    }
  },
};
