### Distinct AI NodeJS Security

NodeJS middleware package for handling Distinct security. This package allows us to;

- Check that the token `x-auth-token`  is present with our endpoints where used,
- Verify the auth token provided,
- Assign roles and checks for required endpoint permissions and roles
- Do some custom security checks

## Installation
```
npm install --save @distinctai/security
```
Also make sure that you have Node.js 12 or newer in order to use it.

## Documentation

Sample Usage

```javascript
import express from 'express';
import { DistinctSecurity } from '@distinctai/security';
import { RoleTypes } from '@distinctai/security/src/interfaces';

const app = express();

const Security = DistinctSecurity.config({
  pubKey: process.env.AUTH_SERVICE_PUBLIC_KEY,
  // app-level handle error response codes
  handleJsonResponse(statusCode, err) {
    switch statusCode {
      case 403:
        return {
          custom_message: ""
        }
      default:
        return {
          custom_message: ""
        }
    }
  }
});

const router = express.Router();

router.use(
  '/auth/level', 
  Security.requiresRolePermissions(
    RoleTypes.ROLE_SERVICE,
    [
      'svcs.service-id.do.something',
      'svcs.service-id.another-thing',
    ],
  ),
  someController.doSomeAuth,
);

```

## License

Proprietary License
