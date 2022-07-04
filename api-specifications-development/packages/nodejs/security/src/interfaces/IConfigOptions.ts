export interface IConfigOptions {
  pubKey: any;
  handleJsonResponse?(responseCode: number, message?: any): Object;
}
