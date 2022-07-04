import { Breadcrumb, Event } from '@sentry/node';
import { IErrorObject } from './IErrorObject';

export interface IErrorReporterOptions {
  sentryKey: string;
  filterBreadcrumbs?(breadcrumb: Breadcrumb): Breadcrumb | null;
  beforeReport?(event: Event): Event | null;
}

export interface IErrorReportScopes {
  tags?: {
    name: string;
    value: string;
  }[];
  userInfo?: {
    id: string;
    email: string;
  };
}

export interface IErrorReporting {
  reportEvent(event: Object, scopes?: IErrorReportScopes): void;
  reportMessage(message: string, scopes?: IErrorReportScopes): void;
  reportException(error: Error | IErrorObject, scopes?: IErrorReportScopes): void;
}
