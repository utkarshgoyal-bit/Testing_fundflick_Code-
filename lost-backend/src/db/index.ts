import mongoose from 'mongoose';
import Logger from '../lib/logger';

async function connectToDatabase() {
  try {
    const isDevelopment = process.env.DB_ENV === 'development';
    const isPreProd = process.env.DB_ENV === 'preprod';
    const db = isDevelopment ? 'dev' : isPreProd ? 'preprod' : 'prod';
    const URL = process.env.DATABASE_URL + db + process.env.DB_CONFIG || '';

    Logger.warn(`Attempting to connect to ${db} database at ${URL}`);

    await mongoose.connect(URL, {
      serverSelectionTimeoutMS: 30000,
    });

    Logger.warn(`Successfully connected to database ${db}`);

    ['SIGINT', 'SIGTERM'].forEach(signal => {
      process.on(signal, async () => {
        Logger.info('MongoDB connection closed');
        await mongoose.connection.close();
        process.exit(0);
      });
    });

    mongoose.connection.on('connected', () => {
      Logger.warn('MongoDB connection established successfully.');
    });

    mongoose.connection.on('error', err => {
      Logger.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      Logger.info('MongoDB connection disconnected.');
    });
  } catch (error: any) {
    Logger.error('Error connecting to DB.', error, error.message);
    setTimeout(connectToDatabase, 5000);
  }
}

export default connectToDatabase;
