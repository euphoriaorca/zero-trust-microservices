## Distinct NodeJS Logger

A NodeJs/Typescript package for handle Distinct application logs.
With this package, we can;

1. Generate logs for the application based on specified level during configuration levels,
2. Send logs to the console or to a specified file

### Installation

```
npm install --save @distinctai/application-logger@latest
```

Also make sure that you have Node.js 12 or newer in order to use it.

### Documentation

Sample Usage

```javascript
import LoggerFactory from "@distinctai/application-logger";

// Log to console
const ClientLogger = LoggerFactory.configure({
  id: "clients", // required
  type: {
    type: "console",
  }, // required
  level: "info",
});

// Log to file
const ClientLogger = LoggerFactory.configure({
  id: "clients", // required
  type: {
    type: "file",
    filename: `logs/client_log_${Date.now()}`,
  }, // required
  level: "error",
});

// E.g. with Info
ClientLogger.Info("Application started on port 8080");
ClientLogger.Info("Authenticating user", {
  email: "john.doe@gmail.com",
  password: "password@123",
});

// E.g. with Error
ClientLogger.Error("Application shutdown unexpectedly.");
ClientLogger.Error("Error fetching user information", new Error());
```

### License

Proprietary License
