/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import path from 'path';
import { searchQuery, searchQueryPayment } from '../../../src/interfaces';
import { ApiResponseHandler, StatusCodes } from '../../helper/responseHelper';
import Logger from '../../lib/logger';
import {
  addCaseContact,
  addCaseRemarks,
  assignedCase,
  deleteCaseRemark,
  exportCasesByDate,
  generateCompanyNoticePDF,
  generateLegalNoticePDF,
  getAllFollowUps,
  getAllPayments,
  getCaseLocation,
  getCases,
  getCollectionFileByCaseNo,
  getCollectionsDashboard,
  getDailyFollowUpReport,
  getDailyPaymentsReport,
  getFollowUpByCaseNo,
  unAssignCase,
  updateBranchService,
  updateCaseFollowUpTimeline,
  updateCasePayment,
  uploadBulkCases,
} from '../../service/collection';
import getCollectionsReports from '../../service/collection/getCollectionsDashboardReports';
import { ERROR, SUCCESS } from '../../shared/enums';
const bulkUploadCases = async (req: Request, res: Response) => {
  try {
    const { file, body, employee, loginUser } = req;
    if (!file || !file.path || !file.originalname) {
      return ApiResponseHandler.sendErrorResponse(
        res,
        'No file was uploaded or file information is missing.',
        ERROR.BAD_REQUEST
      );
    }
    if (+body.fileType != 1 && +body.fileType != 0) {
      return ApiResponseHandler.sendErrorResponse(res, 'File type not allowed', ERROR.BAD_REQUEST);
    }
    const filePath = file.path;
    const fileExtension = path.extname(file.originalname).toLowerCase();
    const result = await uploadBulkCases({
      filePath,
      fileExtension,
      fileType: body.fileType,
      employee,
      loginUser,
    });
    ApiResponseHandler.sendResponse(res, StatusCodes.OK, result, 'Result' + SUCCESS.FETCHED);
  } catch (error) {
    return ApiResponseHandler.sendErrorResponse(res, error, ERROR.BAD_REQUEST);
  }
};

const getCasesController = async (req: Request, res: Response) => {
  try {
    const { loginUser, query } = req;
    const allData = await getCases({ loginUser, query });
    ApiResponseHandler.sendResponse(res, StatusCodes.OK, allData, 'All Data' + SUCCESS.FETCHED);
  } catch (error) {
    return ApiResponseHandler.sendErrorResponse(res, error, ERROR.BAD_REQUEST);
  }
};

const updateBranchController = async (req: Request, res: Response) => {
  try {
    const { loginUser, body } = req;
    const { caseNo, newBranch } = body;
    if (!caseNo || !newBranch) {
      return ApiResponseHandler.sendErrorResponse(
        res,
        'caseNo and newBranch are required',
        ERROR.BAD_REQUEST
      );
    }

    const updatedRecord = await updateBranchService(caseNo, newBranch, loginUser);

    if (!updatedRecord) {
      return ApiResponseHandler.sendErrorResponse(res, 'Record not found', ERROR.BAD_REQUEST);
    }
    ApiResponseHandler.sendResponse(
      res,
      StatusCodes.OK,
      updatedRecord,
      'Update Record' + SUCCESS.FETCHED
    );
  } catch (error) {
    Logger.error('Error updating branch:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getCaseNoDetailsController = async (req: Request, res: Response) => {
  try {
    const { params, loginUser } = req;
    const { caseNo } = params;
    const dataRecord = await getCollectionFileByCaseNo({ caseNo, loginUser });
    if (!dataRecord) {
      return ApiResponseHandler.sendErrorResponse(res, 'case not found', ERROR.BAD_REQUEST);
    }
    ApiResponseHandler.sendResponse(
      res,
      StatusCodes.OK,
      dataRecord,
      'Data Record and Follow-Up Data ' + SUCCESS.FETCHED
    );
  } catch (error) {
    Logger.error((error as Error).message);
    ApiResponseHandler.sendErrorResponse(res, error, ERROR.BAD_REQUEST);
  }
};

const paymentCollectionController = async (req: Request, res: Response) => {
  try {
    const { params, loginUser, file, employee } = req;
    const { caseId } = params;
    const payload = req.body;
    const result = await updateCasePayment({ caseId, payload, file, loginUser, employee });
    ApiResponseHandler.sendResponse(res, StatusCodes.OK, result, 'Result' + SUCCESS.FETCHED);
  } catch (error) {
    return ApiResponseHandler.sendErrorResponse(res, error, ERROR.BAD_REQUEST);
  }
};

const getPaymentsController = async (req: Request, res: Response) => {
  try {
    const payments = await getAllPayments(req.loginUser);
    ApiResponseHandler.sendResponse(res, StatusCodes.OK, payments, 'Payments' + SUCCESS.FETCHED);
  } catch (error) {
    return ApiResponseHandler.sendErrorResponse(res, error, ERROR.BAD_REQUEST);
  }
};

const updateFollowUpCaseIDController = async (req: Request, res: Response) => {
  try {
    const { caseId } = req.params;
    const { body: payload, employee } = req;
    const result = await updateCaseFollowUpTimeline({
      employee,
      caseId,
      payload,
      file: req.file,
      loginUser: req.loginUser,
    });
    ApiResponseHandler.sendResponse(res, StatusCodes.OK, result, 'Result' + SUCCESS.FETCHED);
  } catch (error) {
    return ApiResponseHandler.sendErrorResponse(res, error, ERROR.BAD_REQUEST);
  }
};

const getCaseNoFollowUpDetailsController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { params, loginUser } = req;
    const { caseNo } = params;
    const dataRecord = await getFollowUpByCaseNo(caseNo, loginUser);
    ApiResponseHandler.sendResponse(
      res,
      StatusCodes.OK,
      dataRecord,
      'Data Record' + SUCCESS.FETCHED
    );
  } catch (error) {
    ApiResponseHandler.sendErrorResponse(res, error, ERROR.BAD_REQUEST);
  }
};

const getFollowUpController = async (req: Request, res: Response): Promise<void> => {
  try {
    const follows = await getAllFollowUps(req.loginUser);
    ApiResponseHandler.sendResponse(res, StatusCodes.OK, follows, 'Follows' + SUCCESS.FETCHED);
  } catch (error) {
    ApiResponseHandler.sendErrorResponse(res, error, ERROR.BAD_REQUEST);
  }
};

const editLegalNoticeController = async (req: Request, res: Response) => {
  try {
    const bufferData = await generateLegalNoticePDF(req.body);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=legal_notice.pdf');
    return res.send(bufferData);
  } catch (error) {
    ApiResponseHandler.sendResponse(
      res,
      StatusCodes.InternalServerError,
      null,
      (error as Error).message || 'An error occurred while editing the Word file.'
    );
  }
};

const editCompanyNoticeController = async (req: Request, res: Response) => {
  try {
    const bufferData = await generateCompanyNoticePDF(req.body);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=legal_notice.pdf');
    return res.send(bufferData);
  } catch (error) {
    Logger.error('Error editing the Word file:', error);
    ApiResponseHandler.sendResponse(
      res,
      StatusCodes.InternalServerError,
      null,
      (error as Error).message || 'An error occurred while editing the Word file.'
    );
  }
};

const getDailyPaymentsReportController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { query, loginUser } = req;
    const follows = await getDailyPaymentsReport({
      searchQuery: query as searchQueryPayment,
      loginUser,
    });
    ApiResponseHandler.sendResponse(res, StatusCodes.OK, follows, 'Report' + SUCCESS.FETCHED);
  } catch (error) {
    ApiResponseHandler.sendErrorResponse(res, error, ERROR.BAD_REQUEST);
  }
};

const getDailyFollowUpReportController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { query, loginUser } = req;
    const follows = await getDailyFollowUpReport({
      searchQuery: query as searchQuery,
      loginUser,
    });
    ApiResponseHandler.sendResponse(res, StatusCodes.OK, follows, 'Report' + SUCCESS.FETCHED);
  } catch (error) {
    ApiResponseHandler.sendErrorResponse(res, error, ERROR.BAD_REQUEST);
  }
};

const assignedCaseController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { body, loginUser } = req;
    const follows = await assignedCase({
      userId: body.userId as string,
      caseNo: body.caseNo as string,
      loginUser,
    });
    ApiResponseHandler.sendResponse(res, StatusCodes.OK, follows, 'Report' + SUCCESS.FETCHED);
  } catch (error) {
    ApiResponseHandler.sendErrorResponse(res, error, ERROR.BAD_REQUEST);
  }
};

const unassignCaseController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { body, loginUser } = req;
    const { caseNo } = body;
    const result = await unAssignCase(caseNo, loginUser);
    if (!result) {
      ApiResponseHandler.sendErrorResponse(res, 'Case not found', ERROR.BAD_REQUEST);
    } else {
      ApiResponseHandler.sendResponse(res, StatusCodes.OK, result, 'Result' + SUCCESS.FETCHED);
    }
  } catch (error) {
    ApiResponseHandler.sendErrorResponse(res, error, ERROR.BAD_REQUEST);
  }
};

const caseLocationController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { body } = req;
    const follows = await getCaseLocation({
      caseNo: body.caseNo as string,
      latitude: body.latitude as string,
      longitude: body.longitude as string,
      loginUser: req.loginUser,
      name: body.name as string,
    });
    ApiResponseHandler.sendResponse(res, StatusCodes.OK, follows, 'Report' + SUCCESS.FETCHED);
  } catch (error) {
    ApiResponseHandler.sendErrorResponse(res, error, ERROR.BAD_REQUEST);
  }
};

const exportCasesByDateController = async (req: Request, res: Response): Promise<void> => {
  try {
    // const { startDate, endDate } = req.body;
    const follows = await exportCasesByDate(req.loginUser);
    ApiResponseHandler.sendResponse(res, StatusCodes.OK, follows, 'Report' + SUCCESS.FETCHED);
  } catch (error) {
    ApiResponseHandler.sendErrorResponse(res, error, ERROR.BAD_REQUEST);
  }
};
const dashboardDataController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { loginUser, query: filters } = req;
    const dashboard = await getCollectionsDashboard({ loginUser, filters: filters as any });
    ApiResponseHandler.sendResponse(res, StatusCodes.OK, dashboard, 'Report' + SUCCESS.FETCHED);
  } catch (error) {
    ApiResponseHandler.sendErrorResponse(res, error, ERROR.BAD_REQUEST);
  }
};
const dashboardReportDataController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { loginUser } = req;
    const dashboard = await getCollectionsReports({ loginUser });
    ApiResponseHandler.sendResponse(res, StatusCodes.OK, dashboard, 'Report' + SUCCESS.FETCHED);
  } catch (error) {
    ApiResponseHandler.sendErrorResponse(res, error, ERROR.BAD_REQUEST);
  }
};
const addCaseRemarksController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { body, loginUser, params } = req;
    const follows = await addCaseRemarks({
      caseNo: params.caseNo as string,
      remark: body.remark as string,
      loginUser,
    });
    ApiResponseHandler.sendResponse(res, StatusCodes.OK, follows, 'Report' + SUCCESS.FETCHED);
  } catch (error) {
    ApiResponseHandler.sendErrorResponse(res, error, ERROR.BAD_REQUEST);
  }
};
const deleteCaseRemarkController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { params, loginUser } = req;
    const follows = await deleteCaseRemark({
      caseNo: params.caseNo as string,
      remarkId: params.remarkId as string,
      loginUser,
    });
    ApiResponseHandler.sendResponse(res, StatusCodes.OK, follows, 'Report' + SUCCESS.FETCHED);
  } catch (error) {
    ApiResponseHandler.sendErrorResponse(res, error, ERROR.BAD_REQUEST);
  }
};
const addCaseContactController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { body, loginUser } = req;
    const follows = await addCaseContact({
      body,
      loginUser,
    });
    ApiResponseHandler.sendResponse(res, StatusCodes.OK, follows, 'Report' + SUCCESS.FETCHED);
  } catch (error) {
    ApiResponseHandler.sendErrorResponse(res, error, ERROR.BAD_REQUEST);
  }
};

export {
  addCaseContactController,
  addCaseRemarksController,
  assignedCaseController,
  bulkUploadCases,
  caseLocationController,
  dashboardDataController,
  dashboardReportDataController,
  deleteCaseRemarkController,
  editCompanyNoticeController,
  editLegalNoticeController,
  exportCasesByDateController,
  getCaseNoDetailsController,
  getCaseNoFollowUpDetailsController,
  getCasesController,
  getDailyFollowUpReportController,
  getDailyPaymentsReportController,
  getFollowUpController,
  getPaymentsController,
  paymentCollectionController,
  unassignCaseController,
  updateBranchController,
  updateFollowUpCaseIDController,
};
