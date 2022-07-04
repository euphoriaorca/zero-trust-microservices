export * from './ErrorCodes';
export * from './permissions';

export const JWT_ISSUER = 'SVCS/AUTH';
export const JWT_TOKEN_TYPE = {
  APP: 'APP',
  SERVICE: 'SERVICE',
  USER: 'USER',
};

export const USER_HTOKEN_EXPIRY = process.env.USER_HTOKEN_EXPIRY || 60;
export const SERVICE_TOKEN_EXPIRY = process.env.SERVICE_TOKEN_EXPIRY || 60 * 60;
