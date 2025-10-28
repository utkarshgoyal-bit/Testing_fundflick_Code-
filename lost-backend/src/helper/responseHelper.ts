import { ZodError } from "zod";

export enum StatusCodes {
  Continue = 100,
  SwitchingProtocols = 101,
  Processing = 102,
  EarlyHints = 103,
  OK = 200,
  Created = 201,
  Accepted = 202,
  NonAuthoritativeInformation = 203,
  NoContent = 204,
  ResetContent = 205,
  PartialContent = 206,
  MultiStatus = 207,
  AlreadyReported = 208,
  IMUsed = 226,
  MultipleChoices = 300,
  MovedPermanently = 301,
  Found = 302,
  SeeOther = 303,
  NotModified = 304,
  UseProxy = 305,
  TemporaryRedirect = 307,
  PermanentRedirect = 308,
  BadRequest = 400,
  Unauthorized = 401,
  PaymentRequired = 402,
  Forbidden = 403,
  NotFound = 404,
  MethodNotAllowed = 405,
  NotAcceptable = 406,
  ProxyAuthenticationRequired = 407,
  RequestTimeout = 408,
  Conflict = 409,
  Gone = 410,
  LengthRequired = 411,
  PreconditionFailed = 412,
  PayloadTooLarge = 413,
  URITooLong = 414,
  UnsupportedMediaType = 415,
  RangeNotSatisfiable = 416,
  ExpectationFailed = 417,
  ImATeapot = 418,
  MisdirectedRequest = 421,
  UnprocessableEntity = 422,
  Locked = 423,
  FailedDependency = 424,
  TooEarly = 425,
  UpgradeRequired = 426,
  PreconditionRequired = 428,
  TooManyRequests = 429,
  RequestHeaderFieldsTooLarge = 431,
  UnavailableForLegalReasons = 451,
  InternalServerError = 500,
  NotImplemented = 501,
  BadGateway = 502,
  ServiceUnavailable = 503,
  GatewayTimeout = 504,
  HTTPVersionNotSupported = 505,
  VariantAlsoNegotiates = 506,
  InsufficientStorage = 507,
  LoopDetected = 508,
  NotExtended = 510,
  NetworkAuthenticationRequired = 511,
}

export class ApiResponseHandler {
  private static getKeyByValue(enumType: any, value: number): string | undefined {
    const entries = Object.entries(enumType);
    const foundEntry = entries.find(([, val]) => val === value);
    return foundEntry ? foundEntry[0] : undefined;
  }

  public static sendResponse(res: any, statusCode: StatusCodes | number, data: any, responseMessage: string): Response {
    const statusMessageDescription = this.getKeyByValue(StatusCodes, statusCode);
    return res.status(statusCode).json({
      statusCode: statusCode,
      statusMessage: statusMessageDescription,
      message: responseMessage,
      data: data,
    });
  }

  public static sendErrorResponse(res: any, error: any, responseMessage: string, noErrorMessage?: boolean): Response {
    let statusCode = StatusCodes.InternalServerError;
    let errorMessage = "";
    if (error instanceof ZodError) {
      errorMessage = error.errors.map((err) => `${err.path.join(".")}: ${err.message}`).join("\n");
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
    });
  }
}

export default class CustomError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.name = "CustomError";
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, CustomError.prototype);
  }
}

export function getCallerLineNumber(e: Error | CustomError) {
  try {
    const stackLines = e.stack?.split("\n");
    if (stackLines && stackLines.length > 2) {
      const callerLine = stackLines[2];
      const lineNumberMatch = callerLine?.match(/:(\d+):\d+\)?$/);
      if (lineNumberMatch && lineNumberMatch.length > 1) {
        return lineNumberMatch[1];
      }
    }
  } catch (e) {
    return -1;
  }
}
