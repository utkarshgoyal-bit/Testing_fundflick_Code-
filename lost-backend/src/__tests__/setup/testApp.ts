/**
 * Test App Configuration
 * Creates a separate Express app instance for testing without starting the server
 */

import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Application, NextFunction, Request, Response } from 'express';
import helmet from 'helmet';
import moment from 'moment-timezone';
import { default as logger } from '../../lib/logger';
import morganMiddleware from '../../middleware/loggerMiddleware';
import { verifyToken } from '../../middleware';
import routesv2 from '../../routes/index';
import publicRoutes from '../../routes/public';
import scriptsRoutes from '../../routes/scripts';
import postgresRoutes from '../../lms/routes';
import expressMongoSanitize = require('express-mongo-sanitize');

// Set default timezone to Asia/Kolkata
moment.tz.setDefault('Asia/Kolkata');

/**
 * Create Express app instance for testing
 * Note: Does NOT connect to database or start server
 */
export const createTestApp = (): Application => {
  const app: Application = express();

  // Middleware setup
  app.use(cookieParser());
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
  app.use(helmet());
  app.use(expressMongoSanitize());

  const corsOptions: cors.CorsOptions = {
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    optionsSuccessStatus: 200,
  };
  app.use(cors(corsOptions));
  app.use(express.json());

  // Error handling middleware
  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    logger.error(`Error: ${err.message}`);
    res.status(500).send('Internal Server Error');
  });

  // Routes setup
  // Public routes (no auth required)
  app.use(publicRoutes);

  // Private routes (auth required)
  app.use(verifyToken, morganMiddleware);
  app.use(routesv2);
  app.use(postgresRoutes);

  // Scripts routes
  app.use(scriptsRoutes);

  return app;
};

// Export a singleton test app instance
export const testApp = createTestApp();
