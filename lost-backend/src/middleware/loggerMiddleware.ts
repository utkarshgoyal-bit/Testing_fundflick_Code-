import morgan, { StreamOptions } from 'morgan';
import logger from '../lib/logger';

const morganFormat = ':loginUser :separator :method :url :status :response-time ms ';

morgan.token('loginUser', (req: any) => {
  if (req.loginUser) {
    return req.loginUser.employeeId;
  }
  return 'Unauthenticated';
});
morgan.token('separator', () => {
  return '-->';
});

const stream: StreamOptions = {
  write: (message: string) => {
    const logObject = {
      loginUser: message.split(' ')[0],
      separator: message.split(' ')[1],
      method: message.split(' ')[2],
      url: message.split(' ')[3],
      status: message.split(' ')[4],
      responseTime: message.split(' ')[5],
    };
    if (logObject.status.startsWith('2')) {
      logger.info(JSON.stringify(logObject));
    } else if (logObject.status.startsWith('4') || logObject.status.startsWith('5')) {
      logger.error(JSON.stringify(logObject));
    } else {
      logger.warn(JSON.stringify(logObject));
    }
  },
};

const skip = (): boolean => {
  return process.env.NODE_ENV === 'production';
};

const morganMiddleware = morgan(morganFormat, { stream, skip });

export default morganMiddleware;
