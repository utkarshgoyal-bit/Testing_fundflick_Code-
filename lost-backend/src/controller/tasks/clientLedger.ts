import { Request, Response } from 'express';
import { ApiResponseHandler } from '../../helper/responseHelper';
import { ClientLedgerService } from '../../service/index';
import { ERROR, SUCCESS, StatusCodes } from '../../shared/enums';

class ClientLedgerController {
  async getClientLedgers(req: Request, res: Response): Promise<void> {
    try {
      const { query } = req;
      const { from, to, clientId } = query;
      const ledgers = await ClientLedgerService.getLedgers(clientId as string, {
        from: from ? Number(from) : undefined,
        to: to ? Number(to) : undefined,
      });
      ApiResponseHandler.sendResponse(res, StatusCodes.OK, ledgers, 'Ledgers ' + SUCCESS.FETCHED);
    } catch (error) {
      ApiResponseHandler.sendErrorResponse(res, error, ERROR.BAD_REQUEST);
    }
  }
  async getClientLedgerById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const ledger = await ClientLedgerService.getLedgerById(id);
      ApiResponseHandler.sendResponse(res, StatusCodes.OK, ledger, 'Ledgers ' + SUCCESS.FETCHED);
    } catch (error) {
      ApiResponseHandler.sendErrorResponse(res, error, ERROR.BAD_REQUEST);
    }
  }

  async updateClientLedger(req: Request, res: Response): Promise<void> {
    try {
      const { body, loginUser } = req;
      const payload = body;
      const ledgers = await ClientLedgerService.updateLedgerStatus(payload, loginUser);
      ApiResponseHandler.sendResponse(res, StatusCodes.OK, ledgers, 'Ledgers ' + SUCCESS.UPDATED);
    } catch (error) {
      ApiResponseHandler.sendErrorResponse(res, error, ERROR.BAD_REQUEST);
    }
  }
}

export default new ClientLedgerController();
