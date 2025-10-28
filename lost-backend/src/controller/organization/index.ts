import { Request, Response } from "express";
import { ZodError } from "zod";
import { ApiResponseHandler, StatusCodes } from "../../helper/responseHelper";
import OrganizationService from "../../service/organizations";
import { ERROR, SUCCESS } from "../../shared/enums";

class OrganizationsController {
  getOrganization = async (req: Request, res: Response) => {
    try {
      const Organizations = await OrganizationService.getOrganizations();
      ApiResponseHandler.sendResponse(res, StatusCodes.OK, Organizations, "Organizations" + SUCCESS.FETCHED);
    } catch (error) {
      ApiResponseHandler.sendErrorResponse(res, error, ERROR.BAD_REQUEST);
    }
  };

  addOrganization = async (req: Request, res: Response) => {
    try {
      const { body, loginUser } = req;
      const Organization = await OrganizationService.addOrganization({ data: body, loginUser });
      ApiResponseHandler.sendResponse(res, StatusCodes.OK, Organization, "Organizations" + SUCCESS.CREATED);
    } catch (error) {
      if (error instanceof ZodError) {
        return ApiResponseHandler.sendErrorResponse(res, error.errors, ERROR.BAD_REQUEST);
      }
      ApiResponseHandler.sendErrorResponse(res, error, ERROR.BAD_REQUEST);
    }
  };

  editOrganization = async (req: Request, res: Response) => {
    try {
      const { body, params } = req;
      const Organization = await OrganizationService.editOrganization({ id: params.id, data: body });
      return ApiResponseHandler.sendResponse(res, StatusCodes.OK, Organization, "Organizations " + SUCCESS.UPDATED);
    } catch (error) {
      if (error instanceof ZodError) {
        return ApiResponseHandler.sendErrorResponse(res, error.errors, ERROR.BAD_REQUEST);
      }
      ApiResponseHandler.sendErrorResponse(res, error, ERROR.BAD_REQUEST);
    }
  };

  deleteOrganization = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const Organization = await OrganizationService.deleteOrganization({ id });
      ApiResponseHandler.sendResponse(res, StatusCodes.OK, Organization, "Organizations" + SUCCESS.DELETED);
    } catch (error) {
      ApiResponseHandler.sendErrorResponse(res, error, ERROR.BAD_REQUEST);
    }
  };

  getOrganizationById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const Organization = await OrganizationService.getOrganizationById({ id });
      ApiResponseHandler.sendResponse(res, StatusCodes.OK, Organization, "Organizations" + SUCCESS.FETCHED);
    } catch (error) {
      ApiResponseHandler.sendErrorResponse(res, error, ERROR.BAD_REQUEST);
    }
  };
}

export default new OrganizationsController();
