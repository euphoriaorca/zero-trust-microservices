interface ITokenGenerated {
  token: string;
  permissions: string[];
  createdAt?: Date;
  expiresAt?: Date;
}

export interface ITokenDecoded {
  userId: string;
  tokenType: string;
  serviceId: string;
  permissions: string[];
  data: {
    permissions: string[];
  };
}

export interface ITokenRequest {
  payload?: string | number | object;
}

export interface IAppTokenGenerated extends ITokenGenerated {
  appId: string;
}

export interface IServiceTokenGenerated extends ITokenGenerated {
  serviceId: string;
}
