import { Request, Response } from "express";
import { ZodError } from "zod";
import { ApiResponseHandler, StatusCodes } from "../../helper/responseHelper";
import RoleService from "../../service/roles";
import { ERROR, SUCCESS } from "../../shared/enums";

class RolesController {
  getRole = async (req: Request, res: Response) => {
    try {
      const Roles = await RoleService.getRoles(req.loginUser);
      ApiResponseHandler.sendResponse(res, StatusCodes.OK, Roles, "Roles" + SUCCESS.FETCHED);
    } catch (error) {
      ApiResponseHandler.sendErrorResponse(res, error, ERROR.BAD_REQUEST);
    }
  };

  addRole = async (req: Request, res: Response) => {
    try {
      const { body, loginUser } = req;
      const Role = await RoleService.addRole({ data: body, loginUser });
      ApiResponseHandler.sendResponse(res, StatusCodes.OK, Role, "Roles" + SUCCESS.CREATED);
    } catch (error) {
      if (error instanceof ZodError) {
        return ApiResponseHandler.sendErrorResponse(res, error.errors, ERROR.BAD_REQUEST);
      }
      ApiResponseHandler.sendErrorResponse(res, error, ERROR.BAD_REQUEST);
    }
  };

  editRole = async (req: Request, res: Response) => {
    try {
      const { body, params, loginUser } = req;
      const Role = await RoleService.editRole({ id: params.id, data: body, loginUser });
      return ApiResponseHandler.sendResponse(res, StatusCodes.OK, Role, "Roles " + SUCCESS.UPDATED);
    } catch (error) {
      if (error instanceof ZodError) {
        return ApiResponseHandler.sendErrorResponse(res, error.errors, ERROR.BAD_REQUEST);
      }
      ApiResponseHandler.sendErrorResponse(res, error, ERROR.BAD_REQUEST);
    }
  };

  deleteRole = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const Role = await RoleService.deleteRole({ id, loginUser: req.loginUser });
      ApiResponseHandler.sendResponse(res, StatusCodes.OK, Role, "Roles" + SUCCESS.DELETED);
    } catch (error) {
      ApiResponseHandler.sendErrorResponse(res, error, ERROR.BAD_REQUEST);
    }
  };

  getRoleById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const Role = await RoleService.getRoleById({ id, loginUser: req.loginUser });
      ApiResponseHandler.sendResponse(res, StatusCodes.OK, Role, "Roles" + SUCCESS.FETCHED);
    } catch (error) {
      ApiResponseHandler.sendErrorResponse(res, error, ERROR.BAD_REQUEST);
    }
  };

  getPermissions = async (req: Request, res: Response) => {
    try {
      const { loginUser, employee } = req;
      const Role = await RoleService.getPermissions({ employee, loginUser });
      ApiResponseHandler.sendResponse(res, StatusCodes.OK, Role, "Roles" + SUCCESS.FETCHED);
    } catch (error) {
      ApiResponseHandler.sendErrorResponse(res, error, ERROR.BAD_REQUEST);
    }
  };
}

export default new RolesController();
