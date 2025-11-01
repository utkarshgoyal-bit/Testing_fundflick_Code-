import { Request, Response } from 'express';
import { ZodError } from 'zod';
import { ApiResponseHandler } from '../../../helper/responseHelper';
import { CustomerAddressService } from '../../../service/index';
import { ERROR, SUCCESS, StatusCodes } from '../../../shared/enums';

class CustomerAddressControllers {
  addCustomerAddress = async (req: Request, res: Response) => {
    try {
      const { body, params } = req;
      const { id } = params;
      if (!id) {
        return ApiResponseHandler.sendErrorResponse(
          res,
          'Please provide customer id',
          ERROR.BAD_REQUEST
        );
      }
      const customerFile = await CustomerAddressService.addCustomerAddress({
        body,
        fileId: id,
        loginUser: req.loginUser,
      });
      ApiResponseHandler.sendResponse(
        res,
        StatusCodes.OK,
        customerFile,
        'Customer File ' + SUCCESS.CREATED
      );
    } catch (error) {
      // Type guard to check if error is an instance of Error
      if (error instanceof ZodError) {
        const formattedErrors = error.errors
          ?.map(err => `${err.path.join('.')}: ${err.message}`)
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

  getCustomerAddress = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const customerFile = await CustomerAddressService.getCustomerAddress({
        id,
        loginUser: req.loginUser,
      });
      ApiResponseHandler.sendResponse(
        res,
        StatusCodes.OK,
        customerFile,
        'Customer File ' + SUCCESS.FETCHED
      );
    } catch (error: unknown) {
      console.log(error);
      if (error instanceof ZodError) {
        const formattedErrors = error.errors
          .map(err => `${err.path.join('.')}: ${err.message}`)
          .join('\n');
        return ApiResponseHandler.sendErrorResponse(res, formattedErrors, ERROR.BAD_REQUEST);
      }
      if (error instanceof Error) {
        ApiResponseHandler.sendErrorResponse(res, error, ERROR.BAD_REQUEST);
      } else {
        ApiResponseHandler.sendErrorResponse(res, error, ERROR.BAD_REQUEST);
      }
    }
  };
}

export default new CustomerAddressControllers();
