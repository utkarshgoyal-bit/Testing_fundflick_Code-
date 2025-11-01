import { Request, Response } from 'express';
import { Types } from 'mongoose';
import Logger from '../../lib/logger';
import getOrganizationConfigs from '../../service/organizationConfigs/getOrganizationConfigs';
import { SUCCESS, StatusCodes } from '../../shared/enums';

class OrganizationsController {
  async getOrganizationConfigs(req: Request, res: Response) {
    try {
      const { id } = req.params as { id: string };
      if (!Types.ObjectId.isValid(id)) {
        res.status(StatusCodes.Locked).json({
          message: 'Organization Configs ' + SUCCESS.BLOCKED,
          statusCode: StatusCodes.Locked,
        });
      }
      const organizationConfigs = await getOrganizationConfigs({
        organizationId: id,
      });
      res.status(StatusCodes.OK).json({
        data: organizationConfigs,
        message: 'Organization Configs ' + SUCCESS.FETCHED,
        statusCode: StatusCodes.OK,
      });
    } catch (err) {
      const error = err as Error;
      Logger.error(error);
      res.status(StatusCodes.UnprocessableEntity).json({
        message: error?.message || 'Organization Configs ' + SUCCESS.BLOCKED,
        statusCode: StatusCodes.UnprocessableEntity,
      });
    }
  }
}
export default new OrganizationsController();
