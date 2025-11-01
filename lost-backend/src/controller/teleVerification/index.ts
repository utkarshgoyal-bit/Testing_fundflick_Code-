import { Request, Response } from 'express';
import { ZodError } from 'zod';
import { ApiResponseHandler } from '../../helper/responseHelper';
import { TelephoneQuestionService } from '../../service/index';
import { ERROR, SUCCESS, StatusCodes } from '../../shared/enums';

class TeleVerificationController {
  getTelephoneQuestion = async (req: Request, res: Response) => {
    try {
      const telephoneQuestions = await TelephoneQuestionService.getTelephoneQuestions(
        req.loginUser
      );
      ApiResponseHandler.sendResponse(
        res,
        StatusCodes.OK,
        telephoneQuestions,
        'Telephone Question ' + SUCCESS.FETCHED
      );
    } catch (error) {
      ApiResponseHandler.sendErrorResponse(res, error, ERROR.BAD_REQUEST);
    }
  };

  addTelephoneQuestion = async (req: Request, res: Response) => {
    try {
      const telephoneQuestion = await TelephoneQuestionService.addTelephoneQuestion({
        body: req.body,
        loginUser: req.loginUser,
      });
      ApiResponseHandler.sendResponse(
        res,
        StatusCodes.OK,
        telephoneQuestion,
        'Telephone Question ' + SUCCESS.CREATED
      );
    } catch (error) {
      if (error instanceof ZodError) {
        return ApiResponseHandler.sendErrorResponse(res, error.errors, ERROR.BAD_REQUEST);
      }
      ApiResponseHandler.sendErrorResponse(res, error, ERROR.BAD_REQUEST);
    }
  };

  editTelephoneQuestion = async (req: Request, res: Response) => {
    try {
      const telephoneQuestion = await TelephoneQuestionService.editTelephoneQuestion(
        req.body,
        req.loginUser
      );
      return ApiResponseHandler.sendResponse(
        res,
        StatusCodes.OK,
        telephoneQuestion,
        'Telephone Question ' + SUCCESS.UPDATED
      );
    } catch (error) {
      if (error instanceof ZodError) {
        return ApiResponseHandler.sendErrorResponse(res, error.errors, ERROR.BAD_REQUEST);
      }
      ApiResponseHandler.sendErrorResponse(res, error, ERROR.BAD_REQUEST);
    }
  };

  deleteTelephoneQuestion = async (req: Request, res: Response) => {
    try {
      const { id } = req.body;
      const telephoneQuestion = await TelephoneQuestionService.deleteTelephoneQuestion({
        id,
        loginUser: req.loginUser,
      });
      ApiResponseHandler.sendResponse(
        res,
        StatusCodes.OK,
        telephoneQuestion,
        'Telephone Question ' + SUCCESS.DELETED
      );
    } catch (error) {
      ApiResponseHandler.sendErrorResponse(res, error, ERROR.BAD_REQUEST);
    }
  };

  getTelephoneQuestionById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const telephoneQuestion = await TelephoneQuestionService.getTelephoneQuestionById({
        id,
        loginUser: req.loginUser,
      });
      ApiResponseHandler.sendResponse(
        res,
        StatusCodes.OK,
        telephoneQuestion,
        'Telephone Question ' + SUCCESS.FETCHED
      );
    } catch (error) {
      ApiResponseHandler.sendErrorResponse(res, error, ERROR.BAD_REQUEST);
    }
  };
}

export default new TeleVerificationController();
