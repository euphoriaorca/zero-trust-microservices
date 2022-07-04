import { Response } from 'express';
import { IExpressRequest } from '@distinctai/security/src/interfaces';
import { handleErrorResponse } from '../handlers';
import { SubscriptionsService } from '../services/SubscriptionsService';

export const SubscriptionsController = {
  /**
   * Add a subscription
   *
   * @param req
   * @param res
   */
  async addSubscription(req: IExpressRequest, res: Response): Promise<void> {
    const { platform, subscriptionId } = req.body;

    try {
      const subscription = await SubscriptionsService.addSubscription(req.userId!, subscriptionId, platform);
      res.status(201).json(subscription);
    } catch (err) {
      handleErrorResponse(err, res);
    }
  },
  /**
   * Remove a subscription
   *
   * @param req
   * @param res
   */
  async removeSubscription(req: IExpressRequest, res: Response): Promise<void> {
    try {
      const status = await SubscriptionsService.removeSubscription(req.userId!, req.body.subscriptionId);
      res.status(200).json(status);
    } catch (err) {
      handleErrorResponse(err, res);
    }
  },
};
