import { Response } from 'express';

import { IExpressRequest, IServiceUpdateDto, IServiceRequestDto, ITokenRequest } from '../interfaces';
import { handleErrorResponse } from '../handlers';
import { ServicesService } from '../services';

export const ServicesController = {
  /**
   * Create a service
   *
   * @param req
   * @param res
   */
  async createService(req: IExpressRequest, res: Response): Promise<void> {
    const { description, permissions } = <IServiceRequestDto>req.body;

    try {
      const service = await ServicesService.createService(description, permissions || [], req.userId!);
      res.status(201).json(service);
    } catch (err) {
      handleErrorResponse(err, res);
    }
  },

  /**
   * Update a service permission
   *
   * @param req
   * @param res
   */
  async updatePermissions(req: IExpressRequest, res: Response): Promise<void> {
    const { serviceId, permissions } = <IServiceUpdateDto>req.body;

    try {
      const service = await ServicesService.updateServicePermissions(serviceId, permissions);
      res.status(200).json(service);
    } catch (err) {
      handleErrorResponse(err, res);
    }
  },

  /**
   * Generate a service token
   *
   * @param req
   * @param res
   */
  async generateToken(req: IExpressRequest, res: Response): Promise<void> {
    const { payload } = <ITokenRequest>req.body;

    try {
      const serviceToken = await ServicesService.generateServiceToken(req.serviceId!, req.permissions!, payload);
      res.status(201).json(serviceToken);
    } catch (err) {
      handleErrorResponse(err, res);
    }
  },
};
