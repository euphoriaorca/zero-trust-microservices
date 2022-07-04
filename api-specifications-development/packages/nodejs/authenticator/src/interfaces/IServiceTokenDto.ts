export class IServiceTokenDto {
  serviceId!: string;
  permissions!: string[];
  token!: string;
  createdAt!: string;
  expiresAt!: string;
}
