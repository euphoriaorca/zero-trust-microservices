export class CustomError extends Error {
  code: string;
  message: string;
  data?: object;

  constructor(code: string, message: string, data?: object) {
    super();

    this.code = code;
    this.message = message;

    if (data) {
      this.data = data;
    }
  }
}
