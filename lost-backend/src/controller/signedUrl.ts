import { Request, Response } from 'express'
import { generateSignedUrl } from '../aws/s3';
import { ApiResponseHandler, StatusCodes } from '../helper/responseHelper';
import { ERROR, SUCCESS } from '../shared/enums';

async function GetSignedUrl(req: Request, res: Response) {
    try {
        const response = await generateSignedUrl(req.body.url)
        return ApiResponseHandler.sendResponse(res, StatusCodes.OK, response, 'Url' + SUCCESS.CREATED);
    }
    catch (error) {
        return ApiResponseHandler.sendErrorResponse(res, error, ERROR.BAD_REQUEST);
    }
}

export default GetSignedUrl