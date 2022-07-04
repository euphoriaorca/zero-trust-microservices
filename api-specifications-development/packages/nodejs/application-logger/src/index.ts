import { ILogger, ILoggerOptions } from './interfaces';
import { Log4js } from './Log4js';

export default class LoggerFactory {
  static configure(options: ILoggerOptions): ILogger {
    return new Log4js(options);
  }
}
