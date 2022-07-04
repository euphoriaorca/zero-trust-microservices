import dotenv from 'dotenv';
import { ErrorReporter } from '@distinctai/node-error-reporting';
import { filterSecretsInObject } from '@distinctai/random-utils';

dotenv.config();

const filters = [process.env.POSTMARK_API_KEY, process.env.FIREBASE_CM_SERVER_KEY];

const ReportError = ErrorReporter.configure({
  sentryKey: <string>process.env.SENTRY_DSN,
  filterBreadcrumbs(breadcrumb) {
    return filterSecretsInObject(breadcrumb, filters as string[]);
  },
});

export { ReportError };
