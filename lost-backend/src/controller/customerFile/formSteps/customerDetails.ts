import { Request, Response } from 'express';
import { ZodError } from 'zod';
import camelToTitle from '../../../helper/camelToTitle';
import { ApiResponseHandler } from '../../../helper/responseHelper';
import { CustomerDetailsService } from '../../../service/index';
import { ERROR, SUCCESS, StatusCodes } from '../../../shared/enums';

class CustomerDetailsFileController {
  getCustomerDetailsFile = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const customerFile = await CustomerDetailsService.getCustomerDetails({
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

  addCustomerDetailsFile = async (req: Request, res: Response) => {
    try {
      const { body, files, loginUser } = req;
      // Call the service function to add customer details
      const customerFile = await CustomerDetailsService.addCustomerDetails({
        body,
        loginUser,
        files,
      });

      // Send success response
      ApiResponseHandler.sendResponse(
        res,
        StatusCodes.OK,
        customerFile,
        'Customer File ' + SUCCESS.CREATED
      );
    } catch (error: unknown) {
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
          `Duplicate entry found for: ${camelToTitle(duplicateField)}`,
          `Duplicate entry found for: ${camelToTitle(duplicateField)}`
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

  editCustomerDetailsFile = async (req: Request, res: Response) => {
    try {
      const { params, body, files, loginUser } = req;
      const customerFile = await CustomerDetailsService.editCustomerDetails({
        body,
        fileId: params.id,
        files,
        loginUser,
      });
      ApiResponseHandler.sendResponse(
        res,
        StatusCodes.OK,
        customerFile,
        'CustomerFile ' + SUCCESS.UPDATED
      );
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = error.errors.map(err => ({
          path: err.path.join('.'),
          message: err.message,
        }));

        return ApiResponseHandler.sendErrorResponse(
          res,
          JSON.stringify(formattedErrors),
          ERROR.BAD_REQUEST
        );
      }
      ApiResponseHandler.sendErrorResponse(res, JSON.stringify(error), ERROR.BAD_REQUEST);
    }
  };
}

export default new CustomerDetailsFileController();
