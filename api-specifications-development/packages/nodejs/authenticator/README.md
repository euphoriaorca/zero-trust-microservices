## Distinct NodeJS Authenticator

A NodeJs/Typescript package for handle Distinct service authentications.
With this package, we can;

1. Generate a service token for a service if none is currently active,
2. Checks if token is still valid or about to expire (< 5mins) and generates another

### Installation
```
npm install --save @distinctai/authenticator@latest
```
Also make sure that you have Node.js 12 or newer in order to use it.

### Documentation

Sample Usage

```javascript
import { DistinctAuthenticator } from '@distinctai/authenticator';
import 'Axios' from 'axios';

// Configure authenticator
const Authenticator = DistinctAuthenticator.config({
  authUrl: process.env.AUTH_SERVICE_ENDPOINT,
  serviceId: process.env.SERVICE_ID, // required
  serviceToken: process.env.SERVICE_PASSWORD, // required
  payload: { // optional
    ref: "someRef",
  },
});

/**
 * Get token like this,
 *  use token with the request header `x-auth-token`.
 */
let token: string = '';

try {
  token = await DistinctAuthenticator.getServiceToken();
} catch(err) {
  // some error occurred
}

/**
 * Generate a token yourself
 */
try {
  const serviceToken: IServiceTokenDto = await DistinctAuthenticator.generateServiceToken();
  console.log(serviceToken.token);
} catch(err) {
  // some error occurred
}

// E.g. with axios
Axios.post(SERVICE_ENDPOINT, {
  headers: {
    'x-auth-token': token,
  },
});
```

### License

Proprietary License
