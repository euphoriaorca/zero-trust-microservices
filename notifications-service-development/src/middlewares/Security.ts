/* istanbul ignore file */
import dotenv from 'dotenv';
import AuthSecurity from '@distinctai/security';

import { ErrorCode } from '../constants';

dotenv.config();

const Security = AuthSecurity.config({
  pubKey: process.env.AUTH_SERVICE_PUBLIC_KEY,
  handleJsonResponse(responseCode, message) {
    switch (responseCode) {
      case 403:
        return {
          code: ErrorCode.FORBIDDEN,
          message,
        };
      default:
        return {
          code: ErrorCode.SERVER_ERROR,
          message,
        };
    }
  },
});

export { Security };
