import { Request, Response } from 'express';
import { ZodError } from 'zod';
import { ApiResponseHandler } from '../../helper/responseHelper';
import {
  addBranch,
  blockBranch,
  deleteBranch,
  editBranch,
  getBranch,
  getBranchById,
  unblockBranch,
} from '../../service/branch';
import getChildBranch from '../../service/branch/getChildbranches';
import { ERROR, SUCCESS, StatusCodes } from '../../shared/enums';
import { addBranchReqValidation, editBranchReqValidation } from './validations';
const getBranchController = async (req: Request, res: Response) => {
  try {
    const { loginUser, query } = req;
    const branches = await getBranch(loginUser, query.isRoot as string);
    ApiResponseHandler.sendResponse(res, StatusCodes.OK, branches, 'Branch ' + SUCCESS.FETCHED);
  } catch (error) {
    ApiResponseHandler.sendErrorResponse(res, error, ERROR.BAD_REQUEST);
  }
};
const getChildBranchController = async (req: Request, res: Response) => {
  try {
    const { loginUser, params } = req;
    if (!params.parentId)
      return ApiResponseHandler.sendErrorResponse(res, 'Parent Id is required', ERROR.BAD_REQUEST);
    const branches = await getChildBranch(params.parentId as string, loginUser);
    ApiResponseHandler.sendResponse(res, StatusCodes.OK, branches, 'Branch ' + SUCCESS.FETCHED);
  } catch (error) {
    ApiResponseHandler.sendErrorResponse(res, error, ERROR.BAD_REQUEST);
  }
};
const getBranchByIdController = async (req: Request, res: Response) => {
  try {
    const { loginUser, params } = req;
    const id = params.id;
    const branches = await getBranchById(id, loginUser);
    ApiResponseHandler.sendResponse(res, StatusCodes.OK, branches, 'Branch ' + SUCCESS.FETCHED);
  } catch (error) {
    ApiResponseHandler.sendErrorResponse(res, error, ERROR.BAD_REQUEST);
  }
};

const addBranchController = async (req: Request, res: Response) => {
  try {
    const validatedReq = addBranchReqValidation.safeParse(req.body);
    if (validatedReq.error) {
      return ApiResponseHandler.sendErrorResponse(res, validatedReq.error, ERROR.BAD_REQUEST);
    }
    const branch = await addBranch({
      body: validatedReq.data,
      loginUser: req.loginUser,
    });
    ApiResponseHandler.sendResponse(res, StatusCodes.OK, branch, 'Branch ' + SUCCESS.CREATED);
  } catch (error) {
    if (error instanceof ZodError) {
      return ApiResponseHandler.sendErrorResponse(res, error.errors, ERROR.BAD_REQUEST);
    }
    ApiResponseHandler.sendErrorResponse(res, error, ERROR.BAD_REQUEST);
  }
};

const editBranchesController = async (req: Request, res: Response) => {
  try {
    const { body, loginUser } = req;
    const validatedReq = editBranchReqValidation.parse(body);
    const branch = await editBranch(validatedReq, loginUser);
    return ApiResponseHandler.sendResponse(
      res,
      StatusCodes.OK,
      branch,
      'Branch ' + SUCCESS.UPDATED
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return ApiResponseHandler.sendErrorResponse(res, error.errors, ERROR.BAD_REQUEST);
    }
    ApiResponseHandler.sendErrorResponse(res, error, ERROR.BAD_REQUEST);
  }
};
const blockBranchController = async (req: Request, res: Response) => {
  try {
    const { body, loginUser } = req;
    const { id } = body;
    const branch = await blockBranch({ id, loginUser });
    ApiResponseHandler.sendResponse(res, StatusCodes.OK, branch, 'Branch ' + SUCCESS.BLOCKED);
  } catch (error) {
    ApiResponseHandler.sendErrorResponse(res, error, ERROR.BAD_REQUEST);
  }
};

const unblockBranchController = async (req: Request, res: Response) => {
  try {
    const { body, loginUser } = req;
    const { id } = body;
    const branch = await unblockBranch({ id, loginUser });
    ApiResponseHandler.sendResponse(res, StatusCodes.OK, branch, 'Branch ' + SUCCESS.UNBLOCKED);
  } catch (error) {
    ApiResponseHandler.sendErrorResponse(res, error, ERROR.BAD_REQUEST);
  }
};

const deleteBranchController = async (req: Request, res: Response) => {
  try {
    const { params, loginUser } = req;
    const { id } = params;
    const branch = await deleteBranch({ id, loginUser });
    ApiResponseHandler.sendResponse(res, StatusCodes.OK, branch, 'Branch ' + SUCCESS.DELETED);
  } catch (error) {
    ApiResponseHandler.sendErrorResponse(res, error, ERROR.BAD_REQUEST, true);
  }
};

export {
  addBranchController,
  blockBranchController,
  deleteBranchController,
  editBranchesController,
  getBranchByIdController,
  getBranchController,
  getChildBranchController,
  unblockBranchController,
};
