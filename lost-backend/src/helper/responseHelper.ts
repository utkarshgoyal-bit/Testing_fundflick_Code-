import { ZodError } from 'zod';
import Logger from '../lib/logger';
import { StatusCodes } from '../shared/enums';

/* eslint-disable no-unused-vars */

export class ApiResponseHandler {
  private static getKeyByValue(enumType: any, value: number): string | undefined {
    const entries = Object.entries(enumType);
    const foundEntry = entries.find(([, val]) => val === value);
    return foundEntry ? foundEntry[0] : undefined;
  }

  public static sendResponse(
    res: any,
    statusCode: StatusCodes | number,
    data: any,
    responseMessage: string
  ): Response {
    const statusMessageDescription = this.getKeyByValue(StatusCodes, statusCode);
    return res.status(statusCode).json({
      statusCode: statusCode,
      statusMessage: statusMessageDescription,
      message: responseMessage,
      data: data,
    });
  }

  public static sendErrorResponse(
    res: any,
    error: any,
    responseMessage: string,
    noErrorMessage?: boolean,
    _statusCode?: StatusCodes | number,
    data?: any
  ): Response {
    let statusCode = _statusCode || StatusCodes.InternalServerError;
    let errorMessage = '';
    if (error instanceof ZodError) {
      errorMessage = error.errors.map(err => `${err.path.join('.')}: ${err.message}`).join('\n');
    }
    if (error instanceof CustomError) {
      statusCode = error.statusCode;
      errorMessage = error.message;
    } else if (error?.code === 11000) {
      statusCode = StatusCodes.Conflict;
      const key = Object.keys(error.keyValue)[0];
      const value = error.keyValue[key];
      errorMessage = `Duplicate ${key}, '${value}' is already in exist.`;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    } else {
      errorMessage = error.toString();
    }

    const statusMessageDescription = this.getKeyByValue(StatusCodes, statusCode);
    return res.status(statusCode).json({
      statusCode: statusCode,
      statusMessage: statusMessageDescription,
      message: responseMessage,
      ...(!noErrorMessage && { errorMessage }),
      data: data || null,
    });
  }
}

export default class CustomError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.name = 'CustomError';
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, CustomError.prototype);
  }
}

export function getCallerLineNumber(e: Error | CustomError) {
  try {
    const stackLines = e.stack?.split('\n');
    if (stackLines && stackLines.length > 2) {
      const callerLine = stackLines[2];
      const lineNumberMatch = callerLine?.match(/:(\d+):\d+\)?$/);
      if (lineNumberMatch && lineNumberMatch.length > 1) {
        return lineNumberMatch[1];
      }
    }
  } catch (e) {
    Logger.error('Error while getting caller line number', e);
    return -1;
  }
}
