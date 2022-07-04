export interface IServiceDto {
  serviceId: string;
  description: string;
  permissions: string[];
  token?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IServiceRequestDto {
  description: string;
  permissions: string[];
}

export interface IServiceUpdateDto {
  serviceId: string;
  permissions: string[];
}
