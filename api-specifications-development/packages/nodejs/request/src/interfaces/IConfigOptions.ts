export interface IConfigOptions {
  logError?(err: any): void;
  getServiceToken(): Promise<string>;
  handleErrorCodes(code: number, message: string, err: any): void;
}
