import axios from 'axios';
import { Request, Response } from 'express';
import { ApiResponseHandler } from '../helper/responseHelper';
import { ERROR, StatusCodes, SUCCESS } from '../shared/enums';
const data = JSON.stringify({
  ifsc: 'HDFC0000314',
});

const getIFSCDetails = async (req: Request, res: Response) => {
  try {
    const config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: 'https://ifsc.razorpay.com/' + req.params.ifsc,
      headers: {
        'Content-Type': 'application/json',
      },
      data: data,
    };
    const response = await axios.request(config);
    ApiResponseHandler.sendResponse(res, StatusCodes.OK, response.data, 'User ' + SUCCESS.FETCHED);
  } catch (error) {
    ApiResponseHandler.sendErrorResponse(res, error, ERROR.BAD_REQUEST);
  }
};
export default getIFSCDetails;
