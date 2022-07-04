export type LoggerLevel = 'off' | 'all' | 'trace' | 'debug' | 'info' | 'warn' | 'error';
export type LoggerType = 'console' | 'file';

export interface LoggerTypeData {
  type: LoggerType;
  // the path of the file where you want your logs written.
  filename?: string;
}

export interface ILoggerOptions {
  id: string;
  type: LoggerTypeData;
  level?: LoggerLevel;
}

export interface ILogger {
  Info(...info: any): void;
  Error(...error: any): void;
  Debug(...message: any): void;
  Warn(...message: any): void;
  Trace(...message: any): void;
}
