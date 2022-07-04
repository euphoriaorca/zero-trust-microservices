export enum AppTypes {
  BROWSER = 'BROWSER',
}

export interface IAppRequestDto {
  appType: AppTypes;
  description: string;
  permissions: string[];
  domain?: string;
}

export interface IAppUpdateDto {
  appId: string;
  permissions: string[];
}

export interface IAppDto {
  appId: string;
  appType: AppTypes;
  description: string;
  permissions: string[];
  token?: string;
  domain?: string;
  ip?: string;
  createdAt: Date;
  updatedAt: Date;
}
