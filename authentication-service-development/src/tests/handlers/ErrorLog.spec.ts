import { Logger } from '../../helpers/Logger';
import { ErrorLog } from '../../handlers/ErrorLog';
import { ReportError } from '../../helpers/ErrorReporter';

describe('ErrorLog tests', () => {
  it('Should log error', () => {
    ReportError.reportException = jest.fn();
    Logger.Error = jest.fn();

    ErrorLog.log('__DUMMY__');

    expect(Logger.Error).toHaveBeenCalledTimes(1);
  });
});
