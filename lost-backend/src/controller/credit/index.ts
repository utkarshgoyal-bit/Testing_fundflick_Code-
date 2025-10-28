import { Request, Response } from "express";
import { ApiResponseHandler, StatusCodes } from "../../helper/responseHelper";
import {
  getPersonalDetails,
  getPropertyDetails,
  getFamilyDetails,
  updateFamilyDetails,
  updatePersonalDetails,
  updatePropertyDetails,
  getIncomeDetails,
  deleteIncomeDetails,
  editIncomeDetails,
  addIncomeDetails,
  deleteLiabilityDetails,
  addLiabilityDetails,
  editLiabilityDetails,
  getLiabilityDetails,
} from "../../service/credit";
import { ERROR, SUCCESS } from "../../shared/enums";
class CreditController {
  async getCreditPersonalDetails(req: Request, res: Response): Promise<void> {
    try {
      const {
        loginUser,
        query: { fileId },
      } = req;

      const response = await getPersonalDetails(fileId as string, loginUser);
      ApiResponseHandler.sendResponse(res, StatusCodes.OK, response, "Credit " + SUCCESS.FETCHED);
    } catch (error) {
      ApiResponseHandler.sendErrorResponse(res, error, ERROR.BAD_REQUEST);
    }
  }
  async getCreditPropertyDetails(req: Request, res: Response): Promise<void> {
    try {
      const {
        loginUser,
        query: { fileId },
      } = req;

      const response = await getPropertyDetails(fileId as string, loginUser);
      ApiResponseHandler.sendResponse(res, StatusCodes.OK, response, "Credit " + SUCCESS.FETCHED);
    } catch (error) {
      ApiResponseHandler.sendErrorResponse(res, error, ERROR.BAD_REQUEST);
    }
  }
  async getCreditFamilyDetails(req: Request, res: Response): Promise<void> {
    try {
      const {
        loginUser,
        query: { fileId },
      } = req;

      const response = await getFamilyDetails(fileId as string, loginUser);
      ApiResponseHandler.sendResponse(res, StatusCodes.OK, response, "Credit " + SUCCESS.FETCHED);
    } catch (error) {
      ApiResponseHandler.sendErrorResponse(res, error, ERROR.BAD_REQUEST);
    }
  }

  async updateCreditFamilyDetails(req: Request, res: Response): Promise<void> {
    try {
      const {
        body,
        loginUser,
        query: { fileId },
      } = req;

      const response = await updateFamilyDetails(fileId as string, body, loginUser);
      ApiResponseHandler.sendResponse(res, StatusCodes.OK, response, "Credit " + SUCCESS.UPDATED);
    } catch (error) {
      ApiResponseHandler.sendErrorResponse(res, error, ERROR.BAD_REQUEST);
    }
  }
  async updateCreditPersonalDetails(req: Request, res: Response): Promise<void> {
    try {
      const {
        body,
        loginUser,
        query: { fileId },
      } = req;

      const response = await updatePersonalDetails(fileId as string, body, loginUser);
      ApiResponseHandler.sendResponse(res, StatusCodes.OK, response, "Credit " + SUCCESS.UPDATED);
    } catch (error) {
      ApiResponseHandler.sendErrorResponse(res, error, ERROR.BAD_REQUEST);
    }
  }
  async updateCreditPropertyDetails(req: Request, res: Response): Promise<void> {
    try {
      const {
        body,
        loginUser,
        query: { fileId },
      } = req;

      const response = await updatePropertyDetails(fileId as string, body, loginUser);
      ApiResponseHandler.sendResponse(res, StatusCodes.OK, response, "Credit " + SUCCESS.UPDATED);
    } catch (error) {
      ApiResponseHandler.sendErrorResponse(res, error, ERROR.BAD_REQUEST);
    }
  }
  async getCreditIncomeDetails(req: Request, res: Response): Promise<void> {
    try {
      const {
        params: { fileId },
        loginUser,
      } = req;

      const response = await getIncomeDetails(fileId as string, loginUser);
      ApiResponseHandler.sendResponse(res, StatusCodes.OK, response, "Credit " + SUCCESS.FETCHED);
    } catch (error) {
      ApiResponseHandler.sendErrorResponse(res, error, ERROR.BAD_REQUEST);
    }
  }
  async deleteCreditIncomeDetails(req: Request, res: Response): Promise<void> {
    try {
      const {
        params: { fileId },
        query: { id },
        loginUser,
      } = req;
      const response = await deleteIncomeDetails(fileId, id as string, loginUser);
      ApiResponseHandler.sendResponse(res, StatusCodes.OK, response, "Credit " + SUCCESS.UPDATED);
    } catch (error) {
      ApiResponseHandler.sendErrorResponse(res, error, ERROR.BAD_REQUEST);
    }
  }
  async editCreditIncomeDetails(req: Request, res: Response): Promise<void> {
    try {
      const {
        body,
        params: { fileId },
        query: { id },
        loginUser,
      } = req;
      const response = await editIncomeDetails(fileId, id as string, body, loginUser);
      ApiResponseHandler.sendResponse(res, StatusCodes.OK, response, "Credit " + SUCCESS.UPDATED);
    } catch (error) {
      ApiResponseHandler.sendErrorResponse(res, error, ERROR.BAD_REQUEST);
    }
  }
  async addCreditIncomeDetails(req: Request, res: Response): Promise<void> {
    try {
      const {
        body,
        params: { fileId },
        loginUser,
      } = req;
      const response = await addIncomeDetails(fileId, body, loginUser);
      ApiResponseHandler.sendResponse(res, StatusCodes.OK, response, "Credit " + SUCCESS.UPDATED);
    } catch (error) {
      ApiResponseHandler.sendErrorResponse(res, error, ERROR.BAD_REQUEST);
    }
  }

  async getCreditLiabilityDetails(req: Request, res: Response): Promise<void> {
    try {
      const {
        params: { fileId },
        loginUser,
      } = req;

      const response = await getLiabilityDetails(fileId as string, loginUser);
      ApiResponseHandler.sendResponse(res, StatusCodes.OK, response, "Credit " + SUCCESS.FETCHED);
    } catch (error) {
      ApiResponseHandler.sendErrorResponse(res, error, ERROR.BAD_REQUEST);
    }
  }
  async deleteCreditLiabilityDetails(req: Request, res: Response): Promise<void> {
    try {
      const {
        params: { fileId },
        query: { id },
        loginUser,
      } = req;
      const response = await deleteLiabilityDetails(fileId, id as string, loginUser);
      ApiResponseHandler.sendResponse(res, StatusCodes.OK, response, "Credit " + SUCCESS.UPDATED);
    } catch (error) {
      ApiResponseHandler.sendErrorResponse(res, error, ERROR.BAD_REQUEST);
    }
  }
  async editCreditLiabilityDetails(req: Request, res: Response): Promise<void> {
    try {
      const {
        body,
        params: { fileId },
        query: { id },
        loginUser,
      } = req;
      const response = await editLiabilityDetails(fileId, id as string, body, loginUser);
      ApiResponseHandler.sendResponse(res, StatusCodes.OK, response, "Credit " + SUCCESS.UPDATED);
    } catch (error) {
      ApiResponseHandler.sendErrorResponse(res, error, ERROR.BAD_REQUEST);
    }
  }
  async addCreditLiabilityDetails(req: Request, res: Response): Promise<void> {
    try {
      const {
        body,
        params: { fileId },
        loginUser,
      } = req;
      const response = await addLiabilityDetails(fileId, body, loginUser);
      ApiResponseHandler.sendResponse(res, StatusCodes.OK, response, "Credit " + SUCCESS.UPDATED);
    } catch (error) {
      ApiResponseHandler.sendErrorResponse(res, error, ERROR.BAD_REQUEST);
    }
  }
}

export default new CreditController();
