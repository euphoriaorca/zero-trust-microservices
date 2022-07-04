export enum RoleTypes {
  ROLE_APP = 'APP',
  ROLE_USER = 'USER',
  ROLE_SERVICE = 'SERVICE',
  ROLE_GUEST = 'GUEST',
}

interface defaultOptions {
  pubKey?: any;
  handleJsonResponse?(responseCode: number, message?: any): Object;
}

interface withPermissions extends defaultOptions {
  permissions: string[];
}

interface withRole extends defaultOptions {
  role: RoleTypes;
}

export type IAuthValidatorOptions = withPermissions | withRole;
