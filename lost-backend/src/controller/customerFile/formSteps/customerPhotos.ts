import { Request, Response } from 'express';
import { ZodError } from 'zod';
import { ApiResponseHandler } from '../../../helper/responseHelper';
import { CustomerPhotosService } from '../../../service/index';
import { ERROR, SUCCESS, StatusCodes } from '../../../shared/enums';

class CustomerPhotoController {
  addCustomerPhoto = async (req: Request, res: Response) => {
    try {
      const { body, loginUser, params, files } = req;
      if (!params.id || !loginUser || !files || !body) {
        return ApiResponseHandler.sendErrorResponse(res, ERROR.BAD_REQUEST, ERROR.BAD_REQUEST);
      }
      const customerFile = await CustomerPhotosService.addCustomerPhotos({
        id: params.id,
        files: files as any,
        body,
        loginUser,
      });
      ApiResponseHandler.sendResponse(
        res,
        StatusCodes.OK,
        customerFile,
        'Customer File ' + SUCCESS.CREATED
      );
    } catch (error) {
      console.log(error);
      if (error instanceof ZodError) {
        const formattedErrors = error.errors
          .map(err => `${err.path.join('.')}: ${err.message}`)
          .join('\n');
        return ApiResponseHandler.sendErrorResponse(res, formattedErrors, ERROR.BAD_REQUEST);
      }

      // Handle MongoDB duplicate key error (code 11000)
      if (error instanceof Error && (error as any).code === 11000) {
        const duplicateField = Object.keys((error as any).keyValue).join(', ');
        return ApiResponseHandler.sendErrorResponse(
          res,
          ERROR.ALREADY_EXISTS,
          `Duplicate entry found for: ${duplicateField}`
        );
      }

      // Handle all other errors
      if (error instanceof Error) {
        ApiResponseHandler.sendErrorResponse(res, JSON.stringify(error), ERROR.BAD_REQUEST);
      } else {
        // If the error is not an instance of Error, return a generic message
        ApiResponseHandler.sendErrorResponse(res, JSON.stringify(error), ERROR.BAD_REQUEST);
      }
    }
  };
  deleteCustomerPhotos = async (req: Request, res: Response) => {
    try {
      const { body, loginUser, params } = req;
      const customerFile = await CustomerPhotosService.deleteCustomerPhotos({
        body,
        id: params.id,
        loginUser,
      });
      ApiResponseHandler.sendResponse(
        res,
        StatusCodes.OK,
        customerFile,
        'Customer File ' + SUCCESS.CREATED
      );
    } catch (error) {
      console.log(error);
      // Type guard to check if error is an instance of Error
      if (error instanceof ZodError) {
        const formattedErrors = error.errors
          .map(err => `${err.path.join('.')}: ${err.message}`)
          .join('\n');
        return ApiResponseHandler.sendErrorResponse(res, formattedErrors, ERROR.BAD_REQUEST);
      }

      // Handle MongoDB duplicate key error (code 11000)
      if (error instanceof Error && (error as any).code === 11000) {
        const duplicateField = Object.keys((error as any).keyValue).join(', ');
        return ApiResponseHandler.sendErrorResponse(
          res,
          ERROR.ALREADY_EXISTS,
          `Duplicate entry found for: ${duplicateField}`
        );
      }

      // Handle all other errors
      if (error instanceof Error) {
        ApiResponseHandler.sendErrorResponse(res, error, ERROR.BAD_REQUEST);
      } else {
        // If the error is not an instance of Error, return a generic message
        ApiResponseHandler.sendErrorResponse(res, error, ERROR.BAD_REQUEST);
      }
    }
  };
  getCustomerPhotos = async (req: Request, res: Response) => {
    try {
      const { params, loginUser } = req;
      const customerFile = await CustomerPhotosService.getCustomerPhotos({
        id: params.id,
        loginUser,
      });
      ApiResponseHandler.sendResponse(
        res,
        StatusCodes.OK,
        customerFile,
        'Customer File ' + SUCCESS.CREATED
      );
    } catch (error) {
      console.log(error);
      // Type guard to check if error is an instance of Error
      if (error instanceof ZodError) {
        const formattedErrors = error.errors
          .map(err => `${err.path.join('.')}: ${err.message}`)
          .join('\n');
        return ApiResponseHandler.sendErrorResponse(res, formattedErrors, ERROR.BAD_REQUEST);
      }

      // Handle MongoDB duplicate key error (code 11000)
      if (error instanceof Error && (error as any).code === 11000) {
        const duplicateField = Object.keys((error as any).keyValue).join(', ');
        return ApiResponseHandler.sendErrorResponse(
          res,
          ERROR.ALREADY_EXISTS,
          `Duplicate entry found for: ${duplicateField}`
        );
      }

      // Handle all other errors
      if (error instanceof Error) {
        ApiResponseHandler.sendErrorResponse(res, error, ERROR.BAD_REQUEST);
      } else {
        // If the error is not an instance of Error, return a generic message
        ApiResponseHandler.sendErrorResponse(res, error, ERROR.BAD_REQUEST);
      }
    }
  };
}
export default new CustomerPhotoController();
