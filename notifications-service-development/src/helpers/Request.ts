import BmRequest from '@distinctai/request';
import BmAuthenticator from '@distinctai/authenticator';
import dotenv from 'dotenv';
import { ReportError } from './ErrorReport';

dotenv.config();

const Authenticator = BmAuthenticator.config({
  authUrl: <string>process.env.AUTH_SERVICE_URL,
  serviceId: <string>process.env.SERVICE_ID,
  serviceToken: <string>process.env.SERVICE_TOKEN,
});

const Request = BmRequest.config({
  async getServiceToken(): Promise<string> {
    let token = '';

    try {
      token = await Authenticator.getServiceToken();
    } catch (err) {
      ReportError.reportException(err);
    }

    return token;
  },
  handleErrorCodes(code, message, err: any) {
    throw {
      message,
      ...err,
      code,
    };
  },
});

export { Request };
