import { Request, Response } from "express";
import { ZodError } from "zod";
import { ApiResponseHandler, StatusCodes } from "../../helper/responseHelper";
import { EmployeesServices } from "../../service/index";
import { ERROR, SUCCESS } from "../../shared/enums";
import addEmployeeReqValidation from "./validations";

class EmployeesControllers {
  getEmployee = async (req: Request, res: Response) => {
    try {
      const loginUser = req.loginUser;
      const employees = await EmployeesServices.getEmployees({ loginUser });
      ApiResponseHandler.sendResponse(res, StatusCodes.OK, employees, "Employee " + SUCCESS.FETCHED);
    } catch (error) {
      ApiResponseHandler.sendErrorResponse(res, error, ERROR.BAD_REQUEST);
    }
  };
  getEmployeeById = async (req: Request, res: Response) => {
    try {
      const loginUser = req.loginUser;
      const id = req.params.id;
      const employee = await EmployeesServices.getEmployeeById({ loginUser, id });
      ApiResponseHandler.sendResponse(res, StatusCodes.OK, employee, "Employee " + SUCCESS.FETCHED);
    } catch (error) {
      ApiResponseHandler.sendErrorResponse(res, error, ERROR.BAD_REQUEST);
    }
  };

  addEmployee = async (req: Request, res: Response) => {
    try {
      const { body, loginUser } = req;
      const validatedReq = addEmployeeReqValidation.parse(body);
      const employee = await EmployeesServices.addEmployee({ body: validatedReq, loginUser: loginUser });
      ApiResponseHandler.sendResponse(res, StatusCodes.OK, employee, "Employee " + SUCCESS.CREATED);
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = error.errors.map((err) => ({
          path: err.path.join("."),
          message: err.message,
        }));

        return ApiResponseHandler.sendErrorResponse(res, JSON.stringify(formattedErrors), ERROR.BAD_REQUEST);
      }
      ApiResponseHandler.sendErrorResponse(res, error, ERROR.BAD_REQUEST);
    }
  };

  editEmployee = async (req: Request, res: Response) => {
    try {
      const { body, loginUser } = req;
      const validatedReq = addEmployeeReqValidation.parse(body);
      const employee = await EmployeesServices.editEmployee({ body: validatedReq, loginUser });
      ApiResponseHandler.sendResponse(res, StatusCodes.OK, employee, "Employee " + SUCCESS.UPDATED);
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = error.errors.map((err) => ({
          path: err.path.join("."),
          message: err.message,
        }));

        return ApiResponseHandler.sendErrorResponse(res, JSON.stringify(formattedErrors), ERROR.BAD_REQUEST);
      }
      ApiResponseHandler.sendErrorResponse(res, JSON.stringify(error), ERROR.BAD_REQUEST);
    }
  };

  blockEmployee = async (req: Request, res: Response) => {
    try {
      const { loginUser, body } = req;
      const { id } = body;
      const employee = await EmployeesServices.blockEmployee({ id, loginUser });
      ApiResponseHandler.sendResponse(res, StatusCodes.OK, employee, "Employee " + SUCCESS.BLOCKED);
    } catch (error) {
      ApiResponseHandler.sendErrorResponse(res, error, ERROR.BAD_REQUEST);
    }
  };

  unblockEmployee = async (req: Request, res: Response) => {
    try {
      const { loginUser, body } = req;
      const { id } = body;
      const employee = await EmployeesServices.unblockEmployee({ id, loginUser });
      ApiResponseHandler.sendResponse(res, StatusCodes.OK, employee, "Employee " + SUCCESS.UNBLOCKED);
    } catch (error) {
      ApiResponseHandler.sendErrorResponse(res, error, ERROR.BAD_REQUEST);
    }
  };
}

export default new EmployeesControllers();
