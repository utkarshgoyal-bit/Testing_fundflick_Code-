import { Request, Response } from 'express';
import { ApiResponseHandler, StatusCodes } from '../helper/responseHelper';
import { ERROR } from '../shared/enums';
import Logger from '../lib/logger';
import { loadOCR } from '../helper/ocr';
import { OCRResponse } from '../interfaces/index';

async function ocrController(req: Request, res: Response) {
  try {
    if (!req.file) {
      Logger.error('OCR MIDDLEWARE ERROR', 'File not found');
      return ApiResponseHandler.sendErrorResponse(
        res,
        'File not found. Please upload a file to process.',
        ERROR.NOT_FOUND
      );
    }

    const text = await loadOCR(req.file.path);

    const aadhaarNumber = text.match(/\d{4}\s\d{4}\s\d{4}/);
    const dobMatch = text.match(/(?:DOB|Date of Birth)\s*:\s*(.*)/);
    const result: OCRResponse = {
      aadhaarNumber: aadhaarNumber ? aadhaarNumber[0] : '',
      dob: dobMatch ? dobMatch[1]?.split(' ')[0] : '',
    };
    const messages = [];
    if (result.aadhaarNumber.length) {
      messages.push('Aadhar Number Found');
    }
    if (result.dob.length) {
      messages.push('Date of Birth Found');
    }

    if (messages.length > 1) {
      return ApiResponseHandler.sendResponse(res, StatusCodes.OK, result, 'Data Found');
    }
    return ApiResponseHandler.sendResponse(res, StatusCodes.OK, result, messages[0]);
  } catch (error) {
    Logger.error('OCR MIDDLEWARE ERROR', error);

    const errorMessage =
      error instanceof Error
        ? error.message
        : 'An unexpected error occurred during OCR processing.';
    return ApiResponseHandler.sendErrorResponse(res, errorMessage, ERROR.BAD_REQUEST);
  }
}

export default ocrController;
