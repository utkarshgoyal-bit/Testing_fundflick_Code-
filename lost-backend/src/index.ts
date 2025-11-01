/* eslint-disable no-unused-vars */
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express, { Application, NextFunction, Request, Response } from 'express';
import helmet from 'helmet';
import http from 'http';
import moment from 'moment-timezone';
import { Server } from 'socket.io';
import db from './db/index';
import envChecker from './helper/envChecker';
import { default as Logger, default as logger } from './lib/logger';
import postgresRoutes from './lms/routes';
import { verifyToken } from './middleware';
import morganMiddleware from './middleware/loggerMiddleware';
import routesv2 from './routes/index';
import publicRoutes from './routes/public';
import scriptsRoutes from './routes/scripts';
import { SOCKET } from './shared/enums/socket';
import setupSocketServer from './socket';
import expressMongoSanitize = require('express-mongo-sanitize');

//default timezone to Asia/Kolkata
moment.tz.setDefault('Asia/Kolkata');

dotenv.config();
const app: Application = express();
app.use(cookieParser());
envChecker();

const port = process.env.PORT || 3000;
const corsOptions: cors.CorsOptions = {
  // origin: (process.env.ORIGIN || '').split(','),
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  optionsSuccessStatus: 200,
};

// export const COOKIE_OPTIONS: CookieOptions = {
//   httpOnly: true,
//   secure:true,
//   domain: process.env.DOMAIN,
//   maxAge: 1000 * 60 * 60 * 24 * 7,
//   sameSite:"none"
// };

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(helmet());
app.use(expressMongoSanitize());
app.use(cors(corsOptions));
app.use(express.json());
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error(`Error: ${err.message}`);
  res.status(500).send('Internal Server Error');
});
db();
const server = http.createServer(app);
export const io = new Server(server, {
  path: SOCKET.SOCKET_PATH,
  cors: {
    origin: '*',
    allowedHeaders: ['Content-Type', 'Authorization', 'Access-Control-Allow-Credentials'],
    credentials: true,
  },
});

export const onlineUsers: Record<string, string> = {};
setupSocketServer();
//public routes
app.use(publicRoutes);

//private routes

app.use(verifyToken, morganMiddleware);
app.use(routesv2);
app.use(postgresRoutes);
// scripts routes
app.use(scriptsRoutes);

server.listen(port as number, '0.0.0.0', () => {
  Logger.info(`⚡️[server]: Server is running at http://localhost:${port}`);
});

export default app;
