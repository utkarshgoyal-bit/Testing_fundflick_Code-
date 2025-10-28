import { Request, Response } from "express";
import { ZodError } from "zod";
import { ApiResponseHandler, StatusCodes } from "../../../helper/responseHelper";
import { CustomerIncomeService } from "../../../service/index";
import { ERROR, SUCCESS } from "../../../shared/enums";
import camelToTitle from "../../../helper/camelToTitle";

class CustomerIncomeController {
  addCustomerIncomes = async (req: Request, res: Response) => {
    try {
      const { body, params } = req;
      const customerFile = await CustomerIncomeService.addCustomerIncome({
        body,
        id: params.id,
        loginUser: req.loginUser,
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

  getCustomerIncomes = async (req: Request, res: Response) => {
    try {
      const { params, loginUser } = req;
      const customerFile = await CustomerIncomeService.getCustomerIncomes({ id: params.id, loginUser });
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
  deleteCustomerIncomes = async (req: Request, res: Response) => {
    try {
      const { params, loginUser } = req;
      const customerFile = await CustomerIncomeService.deleteCustomerIncomes({
        id: params.id,
        IncomeId: params.IncomeId,
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

export default new CustomerIncomeController();
