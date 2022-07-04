import * as log4js from 'log4js';
import { ILogger, ILoggerOptions } from './interfaces';

export class Log4js implements ILogger {
  logger: log4js.Logger;
  options: ILoggerOptions;

  constructor(options: ILoggerOptions) {
    this.options = options;
    log4js.configure({
      appenders: {
        [options.id]: {
          type: options.type.type || 'console',
          layout: { type: 'colored' },
          filename: options.type.filename,
        },
      },
      categories: {
        default: { appenders: [options.id], level: options.level || 'error' },
      },
    });

    this.logger = log4js.getLogger(options.id);
  }

  Info(...info: any): void {
    this.logger.info(info);
  }

  Error(...error: any): void {
    this.logger.error(error);
  }

  Warn(...message: any): void {
    this.logger.warn(message);
  }

  Debug(...message: any): void {
    this.logger.debug(message);
  }

  Trace(...message: any): void {
    this.logger.trace(message);
  }
}
