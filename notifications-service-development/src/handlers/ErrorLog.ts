/* istanbul ignore file */
import { ErrorCode } from '../constants';
import { ReportError } from '../helpers';
import { Logger } from '../helpers/Logger';

export const ErrorLog = {
  /**
   * Log an error
   * @param err
   */
  log(err: Error | string) {
    ReportError.reportException(<any>{
      code: ErrorCode.SERVER_ERROR,
      message: err,
    });

    if ('string' === typeof err) {
      Logger.Error('SERVER_ERROR: ', err);
    } else {
      Logger.Error('SERVER_ERROR: ', err.message, err.stack);
    }
  },
};
