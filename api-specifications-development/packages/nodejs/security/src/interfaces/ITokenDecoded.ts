export enum TokenTypes {
  APP = 'APP',
  USER = 'USER',
  SERVICE = 'SERVICE',
}

export interface ManagedAccount {
  id: string;
  name: string;
  photo: string;
  role: string;
}

export interface ITokenDecoded {
  appId?: string;
  userId?: string;
  serviceId?: string;
  permissions: string[];
  tokenType: TokenTypes;
  data?: {
    managedAccount: ManagedAccount
  };
}
