import { Request } from 'express';

export interface IExpressRequest extends Request {
  appId?: string;
  userId?: string;
  serviceId?: string;
  permissions?: string[];
}
