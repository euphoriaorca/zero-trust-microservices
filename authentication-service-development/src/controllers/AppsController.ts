import { Request, Response } from 'express';

import { IExpressRequest, IAppRequestDto, IAppUpdateDto, ITokenRequest } from '../interfaces';
import { handleErrorResponse } from '../handlers';
import { AppsService } from '../services';

export const AppsController = {
  /**
   * Register an application
   *
   * @param req
   * @param res
   */
  async register(req: IExpressRequest, res: Response): Promise<void> {
    const { appType, description, domain, permissions } = <IAppRequestDto>req.body;

    try {
      const app = await AppsService.registerApp(appType, description, permissions || [], <string>req.userId, domain);
      res.status(201).json(app);
    } catch (err) {
      handleErrorResponse(err, res);
    }
  },

  /**
   * Update an application's permissions
   *
   * @param req
   * @param res
   */
  async updatePermissions(req: Request, res: Response): Promise<void> {
    const { appId, permissions } = <IAppUpdateDto>req.body;

    try {
      const app = await AppsService.updateAppPermissions(appId, permissions);
      res.status(200).json(app);
    } catch (err) {
      handleErrorResponse(err, res);
    }
  },

  /**
   * Generate an application token
   *
   * @param req
   * @param res
   */
  async generateToken(req: IExpressRequest, res: Response): Promise<void> {
    const { payload }: ITokenRequest = req.body;

    try {
      const appToken = await AppsService.generateAppToken(req.appId!, req.permissions!, payload);
      res.status(201).json(appToken);
    } catch (err) {
      handleErrorResponse(err, res);
    }
  },
};
