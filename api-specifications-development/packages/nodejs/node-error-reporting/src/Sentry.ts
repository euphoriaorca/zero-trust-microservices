/* istanbul ignore file */

import * as _Sentry from '@sentry/node';
import { IErrorObject, IErrorReporting, IErrorReportScopes, IErrorReporterOptions } from './interfaces';

export class Sentry implements IErrorReporting {
  constructor(options: IErrorReporterOptions) {
    _Sentry.init({
      dsn: options.sentryKey,
      integrations(integrations) {
        return integrations.filter(integration => integration.name !== 'Breadcrumbs');
      },
      beforeBreadcrumb(breadcrumb: _Sentry.Breadcrumb) {
        const { filterBreadcrumbs } = options;

        return filterBreadcrumbs ? filterBreadcrumbs(breadcrumb) : breadcrumb;
      },
      beforeSend(event: _Sentry.Event) {
        const { beforeReport } = options;

        return beforeReport ? beforeReport(event) : event;
      }
    });
  }

  private useScopes(sentryCapture: Function, useScopes?: IErrorReportScopes) {
    _Sentry.withScope(scope => {
      if (useScopes) {
        const { tags, userInfo } = useScopes;

        userInfo && scope.setUser(userInfo);
        tags && tags.map(tag => scope.setTag(tag.name, tag.value));
      }

      sentryCapture();
    });
  }

  reportEvent(event: Object, scopes?: IErrorReportScopes): void {
    this.useScopes(() => {
      _Sentry.captureEvent(event);
    }, scopes);
  }

  reportException(error: Error | IErrorObject, scopes?: IErrorReportScopes): void {
    this.useScopes(() => {
      _Sentry.captureException(error);
    }, scopes);
  }

  reportMessage(message: string, scopes?: IErrorReportScopes): void {
    this.useScopes(() => {
      _Sentry.captureMessage(message);
    }, scopes);
  }
}
