import { Request, Response } from "express";
import { ZodError } from "zod";
import { ApiResponseHandler, StatusCodes } from "../../../helper/responseHelper";
import { CustomerAssociatesServices } from "../../../service/index";
import { ERROR, SUCCESS } from "../../../shared/enums";
import camelToTitle from "../../../helper/camelToTitle";

class CustomerAssociatesController {
  addCustomerAssociate = async (req: Request, res: Response) => {
    try {
      const { body, files, loginUser, params } = req;
      const customerFile = await CustomerAssociatesServices.addCustomerAssociate({
        fileId: params.id,
        body,
        files,
        loginUser,
      });
      ApiResponseHandler.sendResponse(res, StatusCodes.OK, customerFile, "Customer File " + SUCCESS.CREATED);
    } catch (error) {
      // Type guard to check if error is an instance of Error
      if (error instanceof ZodError) {
        const formattedErrors = error.errors.map((err) => `${err.path.join(".")}: ${err.message}`).join("\n");
        return ApiResponseHandler.sendErrorResponse(res, formattedErrors, ERROR.BAD_REQUEST);
      }

      // Handle MongoDB duplicate key error (code 11000)
      if (error instanceof Error && (error as any).code === 11000) {
        const duplicateField = Object.keys((error as any).keyValue).join(", ");
        return ApiResponseHandler.sendErrorResponse(
          res,
          `Duplicate entry found for: ${camelToTitle(duplicateField)}`,
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
  editCustomerAssociate = async (req: Request, res: Response) => {
    try {
      const { body, files, loginUser, params } = req;
      const customerFile = await CustomerAssociatesServices.editCustomerAssociate({
        fileId: params.id,
        body,
        files,
        loginUser,
      });
      ApiResponseHandler.sendResponse(res, StatusCodes.OK, customerFile, "Customer File " + SUCCESS.UPDATED);
    } catch (error) {
      // Type guard to check if error is an instance of Error
      if (error instanceof ZodError) {
        const formattedErrors = error.errors.map((err) => `${err.path.join(".")}: ${err.message}`).join("\n");
        return ApiResponseHandler.sendErrorResponse(res, formattedErrors, ERROR.BAD_REQUEST);
      }

      // Handle MongoDB duplicate key error (code 11000)
      if (error instanceof Error && (error as any).code === 11000) {
        const duplicateField = Object.keys((error as any).keyValue).join(", ");
        return ApiResponseHandler.sendErrorResponse(
          res,
          `Duplicate entry found for: ${camelToTitle(duplicateField)}`,
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
  getCustomerAssociates = async (req: Request, res: Response) => {
    try {
      const { params, loginUser } = req;
      const customerFile = await CustomerAssociatesServices.getCustomerAssociates({ id: params.id, loginUser });
      ApiResponseHandler.sendResponse(res, StatusCodes.OK, customerFile, "Customer File " + SUCCESS.FETCHED);
    } catch (error) {
      // Type guard to check if error is an instance of Error
      if (error instanceof ZodError) {
        const formattedErrors = error.errors.map((err) => `${err.path.join(".")}: ${err.message}`).join("\n");
        return ApiResponseHandler.sendErrorResponse(res, formattedErrors, ERROR.BAD_REQUEST);
      }
      if (error instanceof Error) {
        ApiResponseHandler.sendErrorResponse(res, error, ERROR.BAD_REQUEST);
      } else {
        // If the error is not an instance of Error, return a generic message
        ApiResponseHandler.sendErrorResponse(res, error, ERROR.BAD_REQUEST);
      }
    }
  };
  deleteCustomerAssociates = async (req: Request, res: Response) => {
    try {
      const { params, loginUser } = req;
      const customerFile = await CustomerAssociatesServices.deleteCustomerAssociates({
        id: params.id,
        associateId: params.associateId,
        loginUser,
      });
      ApiResponseHandler.sendResponse(res, StatusCodes.OK, customerFile, "Customer File " + SUCCESS.DELETED);
    } catch (error) {
      // Type guard to check if error is an instance of Error
      if (error instanceof ZodError) {
        const formattedErrors = error.errors.map((err) => `${err.path.join(".")}: ${err.message}`).join("\n");
        return ApiResponseHandler.sendErrorResponse(res, formattedErrors, ERROR.BAD_REQUEST);
      }
      if (error instanceof Error) {
        ApiResponseHandler.sendErrorResponse(res, error, ERROR.BAD_REQUEST);
      } else {
        // If the error is not an instance of Error, return a generic message
        ApiResponseHandler.sendErrorResponse(res, error, ERROR.BAD_REQUEST);
      }
    }
  };
}

export default new CustomerAssociatesController();
