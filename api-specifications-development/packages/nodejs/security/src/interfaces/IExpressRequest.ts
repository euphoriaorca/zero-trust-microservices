import { Request } from 'express';
import { RoleTypes } from './IAuthValidatorOptions';
import { ManagedAccount } from './ITokenDecoded';

interface Auth {
  role: RoleTypes;
  token: string;
  permissions: string[];
  managedAccount?: ManagedAccount;
}

export interface IExpressRequest extends Request {
  [x: string]: any;
  appId?: string;
  userId?: string;
  serviceId?: string;
  auth?: Auth;
  managerUserId?: string;
  managedAccount?: ManagedAccount;
}
