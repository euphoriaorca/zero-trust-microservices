import { Sentry } from './Sentry';
import { IErrorReporting, IErrorReporterOptions } from './interfaces';

class ErrorReporter {
  reporter: IErrorReporting;

  constructor(options: IErrorReporterOptions) {
    this.reporter = new Sentry(options);
  }

  static configure(options: IErrorReporterOptions): IErrorReporting {
    return new ErrorReporter(options).reporter;
  }
}

export { ErrorReporter };
