import { Request, Response } from 'express';
import { ApiResponseHandler } from '../../../helper/responseHelper';
import { FileOperationServices } from '../../../service';
import { ERROR, SUCCESS, StatusCodes } from '../../../shared/enums';
class FileOperationsController {
  async getVehicleRecords(req: Request, res: Response) {
    try {
      const { chassisNumber } = req.query;
      const response = await FileOperationServices.getVehicleDetails(
        chassisNumber as string,
        req.loginUser
      );
      ApiResponseHandler.sendResponse(res, StatusCodes.OK, response, 'Vehicle ' + SUCCESS.CREATED);
    } catch (error) {
      ApiResponseHandler.sendErrorResponse(res, error, ERROR.BAD_REQUEST);
    }
  }
  async getCustomerInformation(req: Request, res: Response) {
    try {
      const { aadhaarNumber } = req.query;
      const response = await FileOperationServices.getCustomerRecord(
        aadhaarNumber as string,
        req.loginUser
      );
      ApiResponseHandler.sendResponse(res, StatusCodes.OK, response, 'customer ' + SUCCESS.CREATED);
    } catch (error) {
      ApiResponseHandler.sendErrorResponse(res, error, ERROR.BAD_REQUEST);
    }
  }
  async updatedCustomerFileStatus(req: Request, res: Response) {
    try {
      const { loanApplicationNumber, status, data } = req.body;
      if (!loanApplicationNumber || !status) {
        throw 'Please provide loanApplicationNumber and status';
      }
      const response = await FileOperationServices.updateCustomerFileStatus({
        loanApplicationNumber: loanApplicationNumber as string,
        status: status as string,
        loginUser: req.loginUser,
        data,
      });
      ApiResponseHandler.sendResponse(res, StatusCodes.OK, response, 'customer ' + SUCCESS.CREATED);
    } catch (error) {
      ApiResponseHandler.sendErrorResponse(res, error, ERROR.BAD_REQUEST);
    }
  }
  async fileComments(req: Request, res: Response) {
    try {
      const { loanApplicationNumber, comments } = req.body;
      const response = await FileOperationServices.updateFileComments({
        loanApplicationNumber: loanApplicationNumber as string,
        comments,
        loginUser: req.loginUser,
      });
      ApiResponseHandler.sendResponse(res, StatusCodes.OK, response, 'customer ' + SUCCESS.CREATED);
    } catch (error) {
      ApiResponseHandler.sendErrorResponse(res, error, ERROR.BAD_REQUEST);
    }
  }
  async receiveFilePayment(req: Request, res: Response) {
    try {
      const response = await FileOperationServices.handleReceiveFilePayment({
        data: req.body,
        loginUser: req.loginUser,
      });
      ApiResponseHandler.sendResponse(res, StatusCodes.OK, response, 'Payment ' + SUCCESS.CREATED);
    } catch (error) {
      ApiResponseHandler.sendErrorResponse(res, error, ERROR.BAD_REQUEST);
    }
  }
  async fileHandlers(req: Request, res: Response) {
    const { fileId } = req.query;
    if (!fileId) {
      throw 'Please provide loanApplicationNumber ';
    }
    const response = await FileOperationServices.fileHandlersService({
      fileId: fileId as string,
      loginUser: req.loginUser,
    });
    ApiResponseHandler.sendResponse(res, StatusCodes.OK, response, 'Success');
  }
  async fileVerification(req: Request, res: Response) {
    try {
      const { step, fileId, isVerified } = req.body;
      const response = await FileOperationServices.fileVerificationService({
        loginUser: req.loginUser,
        fileId,
        step,
        isVerified,
      });
      return ApiResponseHandler.sendResponse(res, StatusCodes.OK, response, 'Success');
    } catch (error) {
      return ApiResponseHandler.sendErrorResponse(res, error, ERROR.BAD_REQUEST);
    }
  }
  async telephoneVerification(req: Request, res: Response) {
    try {
      const { review, fileId, description } = req.body;
      const response = await FileOperationServices.telephoneVerificationService({
        loginUser: req.loginUser,
        fileId,
        review,
        description,
      });
      return ApiResponseHandler.sendResponse(res, StatusCodes.OK, response, 'Success');
    } catch (error) {
      return ApiResponseHandler.sendErrorResponse(res, error, ERROR.BAD_REQUEST);
    }
  }
  async updatedCustomerCibilScore(req: Request, res: Response) {
    try {
      const { body, params, files, loginUser } = req;
      if (!params.id) {
        throw 'Please provide file id ';
      }
      const response = await FileOperationServices.updateCustomerCibilScore({
        body,
        files,
        fileId: params.id,
        loginUser,
      });
      ApiResponseHandler.sendResponse(res, StatusCodes.OK, response, 'Success ');
    } catch (error) {
      ApiResponseHandler.sendErrorResponse(res, error, ERROR.BAD_REQUEST);
    }
  }
}

export default new FileOperationsController();
