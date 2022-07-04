/* istanbul ignore file */
import 'reflect-metadata';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { Logger, ReportError } from './helpers';

dotenv.config();

(async () => {
  Logger.Info('Intiatializing mongodb connection.');

  try {
    await mongoose.connect(<string>process.env.MONGODB_URI, {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (err) {
    Logger.Error('Mongoose connection error', err);
    ReportError.reportException(err);
  }
})();

export { mongoose };
