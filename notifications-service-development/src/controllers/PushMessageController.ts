import { Response } from 'express';
import { IExpressRequest } from '@distinctai/security/src/interfaces';
import { handleErrorResponse } from '../handlers';
import { PushMessagesService } from '../services/PushMessagesService';

export const PushMessageController = {
  /**
   * Get all user's push notifications
   *
   * @param req
   * @param res
   */
  async getPushMessages(req: IExpressRequest, res: Response): Promise<void> {
    const { page, size } = req.query;

    try {
      const messages = await PushMessagesService.getMessages(req.userId!, page, size);
      res.status(200).json(messages);
    } catch (err) {
      handleErrorResponse(err, res);
    }
  },
  /**
   * Send a push message to user
   *
   * @param req
   * @param res
   */
  async sendPushMessage(req: IExpressRequest, res: Response): Promise<void> {
    const { recipient, message } = req.body;

    try {
      // Pending implementation
      const status = await PushMessagesService.sendMessages(
        recipient.userId! || recipient.subscriptionId!,
        message.title!,
        message.body,
        message.data,
      );
      res.status(200).json(status);
    } catch (err) {
      handleErrorResponse(err, res);
    }
  },
};
