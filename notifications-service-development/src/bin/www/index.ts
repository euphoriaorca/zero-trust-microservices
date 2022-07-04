/* istanbul ignore file */
import errorHandler from 'errorhandler';
import { Logger } from '../../helpers/Logger';
import { mongoose } from '../../mongoose';
import { ReportError } from '../../helpers';
import app from '../../app';

app.use(errorHandler());

(async () => {
  mongoose.connection.once('open', () => {
    Logger.Info('Mongo connection established.');

    // Initialize server
    const server = app.listen(process.env.APP_PORT || 8000, async () => {
      const port = app.get('port');

      Logger.Info(`Service Started at http://localhost:${port}`);
      Logger.Info('Press CTRL+C to stop\n');
    });

    // Nodemon dev hack
    process.once('SIGUSR2', function () {
      server.close(function () {
        process.kill(process.pid, 'SIGUSR2');
      });
    });

    process.on('SIGINT', () => {
      mongoose.connection.close(() => {
        Logger.Info('Mongoose default connection disconnected through app termination.');
        process.exit(0);
      });
    });
  });

  mongoose.connection.on('error', (err) => {
    Logger.Error(`Mongo Connection Error : ${err}`);
    ReportError.reportException(err);
    process.exit(1);
  });

  mongoose.connection.on('disconnected', () => {
    Logger.Error('Mongo Connection disconnected.');
    process.exit(1);
  });
})();
