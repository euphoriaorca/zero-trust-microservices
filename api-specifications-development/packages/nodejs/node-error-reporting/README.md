### NodeJS Error Reporting

This package handles error reporting in Distinct's NodeJs projects.

## Installation
```
yarn add @distinctai/node-error-reporting
```
Also make sure that you have Node.js 12 or newer in order to use it.

## Documentation

Sample Usage

```javascript
import { ErrorReporter } from '@distinctai/node-error-reporting';

// Configuring reporter for sentry
const Reporter = ErrorReporter.configure({
  sentryKey: process.env.SENTRY_DSN,
});

// Reporting events
Reporter.reportEvent({
  eventName: 'abxyz',
});

// Reporting exceptions
Reporter.reportException(new Error('Some error'));
Reporter.reportException({
  code: 'INTERNAL_SERVER_ERROR',
  message: 'Some server error occurred.',
  data: '__STACK__',
});

// Report message
Reporter.reportMessage('Some message');


// Reporting with scopes, this applies to all methods
//  This is useful in tracking user issues
Reporter.reportEvent({
  eventName: 'Some event',
  data: 'Some data'
}, {
  tags: [
    {
      name: 'tag_name',
      value: 'tag_value',
    }
  ],
  userInfo: {
    id: 'user_id',
    email: 'user_email',
  },
});
```

## License

Proprietary License
