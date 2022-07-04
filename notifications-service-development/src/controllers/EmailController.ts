import { Request, Response } from 'express';
import { IExpressRequest } from '@distinctai/security/src/interfaces';
import { handleErrorResponse } from '../handlers';
import { EmailService } from '../services/EmailService';

export const EmailController = {
  /**
   * Preview email templates
   *
   * @param req
   * @param res
   */
  async previewEmailTemplate(req: Request, res: Response): Promise<any> {
    const { id } = req.query;

    if (!id) {
      return res.send('No valid template Id provided');
    }

    const data = EmailService.previewEmailTemplate(id);

    res.send(data);
  },
  /**
   * Send emails
   *
   * @param req
   * @param res
   */
  async sendMail(req: IExpressRequest, res: Response): Promise<void> {
    try {
      const status = await EmailService.sendEmail(req.body);
      res.status(200).json(status);
    } catch (err) {
      handleErrorResponse(err, res);
    }
  },
  /**
   * Add contact to list
   *
   * @todo
   * @param req
   */
  async addContactToList(req: IExpressRequest, res: Response): Promise<void> {
    try {
      /** @todo Implementation */
    } catch (err) {
      handleErrorResponse(err, res);
    }
  },
};
