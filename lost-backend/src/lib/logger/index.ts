import dotenv from 'dotenv';
import { addColors, createLogger, format, transports } from 'winston';
dotenv.config();

const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

addColors(colors);

const isDevelopment = (process.env.DB_ENV || 'development') === 'development';

const logger = createLogger({
  levels,
  level: isDevelopment ? 'debug' : 'warn',
  format: isDevelopment
    ? format.combine(
        format.colorize({ all: true }),
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.printf(
          ({ level, message, timestamp }) => `${timestamp} [${level.toUpperCase()}]: ${message}`
        )
      )
    : format.combine(format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), format.json()),
  transports: [
    new transports.Console(),
    new transports.File({ filename: 'logs/error.log', level: 'error' }),
    new transports.File({ filename: 'logs/combined.log' }),
  ],
});

export default logger;
