interface ITokenRequest {
  userId: string;
  payload?: Object;
}

export interface IUserHtokenRequest extends ITokenRequest {}

export interface IUserTokenRequest extends ITokenRequest {
  htoken: string;
  permissions: string[];
  ttl: number;
}

interface ITokenGenerated {
  userId: string;
  token: string;
  createdAt?: Date;
  expiresAt?: Date;
}

export interface IUserHtokenGenerated extends ITokenGenerated {}

export interface IUserTokenGenerated extends ITokenGenerated {
  permissions: string[];
}
