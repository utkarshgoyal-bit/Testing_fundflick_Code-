import { Request, Response } from "express";
import { ApiResponseHandler, StatusCodes } from "../../helper/responseHelper";
import { TasksService } from "../../service/index";
import { ERROR, SUCCESS } from "../../shared/enums";

class TaskController {
  async getTasks(req: Request, res: Response): Promise<void> {
    try {
      const loginUser = req.loginUser;
      const { active, activeFilter } = req.query;
      const tasksData = await TasksService.getTasks({
        loginUser,
        active: active === "true" ? true : false,
        activeFilter: activeFilter as string,
      });
      ApiResponseHandler.sendResponse(res, StatusCodes.OK, tasksData, "Tasks " + SUCCESS.FETCHED);
    } catch (error) {
      ApiResponseHandler.sendErrorResponse(res, error, ERROR.BAD_REQUEST);
    }
  }

  async createTask(req: Request, res: Response): Promise<void> {
    try {
      const loginUser = req.loginUser;
      const tasksData = await TasksService.createTask({ body: req.body, loginUser });
      ApiResponseHandler.sendResponse(res, StatusCodes.OK, tasksData, "Tasks " + SUCCESS.CREATED);
    } catch (error) {
      ApiResponseHandler.sendErrorResponse(res, error, ERROR.BAD_REQUEST);
    }
  }

  async updateTask(req: Request, res: Response): Promise<void> {
    try {
      const loginUser = req.loginUser;
      const tasksData = await TasksService.updateTask({ body: req.body, loginUser });
      ApiResponseHandler.sendResponse(res, StatusCodes.OK, tasksData, "Tasks " + SUCCESS.UPDATED);
    } catch (error) {
      ApiResponseHandler.sendErrorResponse(res, error, ERROR.BAD_REQUEST);
    }
  }

  async deleteTask(req: Request, res: Response): Promise<void> {
    try {
      const loginUser = req.loginUser;
      const tasksData = await TasksService.deleteTask({ loginUser, body: req.body });
      ApiResponseHandler.sendResponse(res, StatusCodes.OK, tasksData, "Tasks " + SUCCESS.DELETED);
    } catch (error) {
      ApiResponseHandler.sendErrorResponse(res, error, ERROR.BAD_REQUEST);
    }
  }

  async addComment(req: Request, res: Response): Promise<void> {
    try {
      const loginUser = req.loginUser;
      const body = req.body;
      const tasksData = await TasksService.addComments({ loginUser, body });
      ApiResponseHandler.sendResponse(res, StatusCodes.OK, tasksData, "Tasks " + SUCCESS.FETCHED);
    } catch (error) {
      ApiResponseHandler.sendErrorResponse(res, error, ERROR.BAD_REQUEST);
    }
  }

  async markComplete(req: Request, res: Response): Promise<void> {
    try {
      const loginUser = req.loginUser;
      const tasksData = await TasksService.markAsDone({ loginUser, body: req.body });
      ApiResponseHandler.sendResponse(res, StatusCodes.OK, tasksData, "Tasks " + SUCCESS.FETCHED);
    } catch (error) {
      ApiResponseHandler.sendErrorResponse(res, error, ERROR.BAD_REQUEST);
    }
  }
  async stopRepeat(req: Request, res: Response): Promise<void> {
    try {
      const loginUser = req.loginUser;
      const tasksData = await TasksService.stopRepeat({ loginUser, body: req.body });
      ApiResponseHandler.sendResponse(res, StatusCodes.OK, tasksData, "Tasks " + SUCCESS.FETCHED);
    } catch (error) {
      ApiResponseHandler.sendErrorResponse(res, error, ERROR.BAD_REQUEST);
    }
  }
  async acceptTask(req: Request, res: Response): Promise<void> {
    try {
      const { loginUser, params } = req;

      const tasksData = await TasksService.acceptTask({ loginUser, taskId: params.taskId });
      ApiResponseHandler.sendResponse(res, StatusCodes.OK, tasksData, "Tasks " + SUCCESS.FETCHED);
    } catch (error) {
      ApiResponseHandler.sendErrorResponse(res, error, ERROR.BAD_REQUEST);
    }
  }
}

export default new TaskController();
