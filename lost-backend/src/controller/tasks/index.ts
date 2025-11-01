import { Request, Response } from 'express';
import { TASK_DASHBOARD_TYPE_ENUM } from '../../enums/task.enum';
import { isTrue } from '../../helper';
import { ApiResponseHandler } from '../../helper/responseHelper';
import { TasksService } from '../../service/index';
import { ERROR, SUCCESS, StatusCodes } from '../../shared/enums';

class TaskController {
  async fetchTasks(req: Request, res: Response): Promise<void> {
    try {
      const loginUser = req.loginUser;
      const { active, activeFilter, statusFilter, page } = req.query;
      const tasksData = await TasksService.fetchTasks({
        loginUser,
        active: active === 'true' ? true : false,
        activeFilter: activeFilter as string,
        statusFilter: statusFilter as string,
        page: Number(page),
      });
      ApiResponseHandler.sendResponse(res, StatusCodes.OK, tasksData, 'Tasks ' + SUCCESS.FETCHED);
    } catch (error) {
      ApiResponseHandler.sendErrorResponse(res, error, ERROR.BAD_REQUEST);
    }
  }
  async fetchTaskDashboard(req: Request, res: Response): Promise<void> {
    try {
      const { query, loginUser } = req;
      const { type, incompleteTasksFilter } = query;
      const tasksData = await TasksService.fetchTaskDashboard(
        loginUser,
        type as TASK_DASHBOARD_TYPE_ENUM,
        incompleteTasksFilter as 'pending' | 'inProgress'
      );
      ApiResponseHandler.sendResponse(
        res,
        StatusCodes.OK,
        tasksData,
        'Tasks Dashboard ' + SUCCESS.FETCHED
      );
    } catch (error) {
      ApiResponseHandler.sendErrorResponse(res, error, ERROR.BAD_REQUEST);
    }
  }

  async createTask(req: Request, res: Response): Promise<void> {
    try {
      const loginUser = req.loginUser;
      const tasksData = await TasksService.createTask({ body: req.body, loginUser });
      ApiResponseHandler.sendResponse(res, StatusCodes.OK, tasksData, 'Tasks ' + SUCCESS.CREATED);
    } catch (error) {
      ApiResponseHandler.sendErrorResponse(res, error, ERROR.BAD_REQUEST);
    }
  }

  async updateTask(req: Request, res: Response): Promise<void> {
    try {
      const loginUser = req.loginUser;
      const tasksData = await TasksService.updateTask({ body: req.body, loginUser });
      ApiResponseHandler.sendResponse(res, StatusCodes.OK, tasksData, 'Tasks ' + SUCCESS.UPDATED);
    } catch (error) {
      ApiResponseHandler.sendErrorResponse(res, error, ERROR.BAD_REQUEST);
    }
  }

  async deleteTask(req: Request, res: Response): Promise<void> {
    try {
      const loginUser = req.loginUser;
      const tasksData = await TasksService.deleteTask({ loginUser, body: req.body });
      ApiResponseHandler.sendResponse(res, StatusCodes.OK, tasksData, 'Tasks ' + SUCCESS.DELETED);
    } catch (error) {
      ApiResponseHandler.sendErrorResponse(res, error, ERROR.BAD_REQUEST);
    }
  }

  async addComment(req: Request, res: Response): Promise<void> {
    try {
      const loginUser = req.loginUser;
      const body = req.body;
      const tasksData = await TasksService.addComments({ loginUser, body });
      ApiResponseHandler.sendResponse(res, StatusCodes.OK, tasksData, 'Tasks ' + SUCCESS.FETCHED);
    } catch (error) {
      ApiResponseHandler.sendErrorResponse(res, error, ERROR.BAD_REQUEST);
    }
  }

  async markComplete(req: Request, res: Response): Promise<void> {
    try {
      const loginUser = req.loginUser;
      const tasksData = await TasksService.markTaskAsCompleted({ loginUser, body: req.body });
      ApiResponseHandler.sendResponse(res, StatusCodes.OK, tasksData, 'Tasks ' + SUCCESS.FETCHED);
    } catch (error) {
      ApiResponseHandler.sendErrorResponse(res, error, ERROR.BAD_REQUEST);
    }
  }
  async stopRepeat(req: Request, res: Response): Promise<void> {
    try {
      const loginUser = req.loginUser;
      const tasksData = await TasksService.stopRepeat({ loginUser, body: req.body });
      ApiResponseHandler.sendResponse(res, StatusCodes.OK, tasksData, 'Tasks ' + SUCCESS.FETCHED);
    } catch (error) {
      ApiResponseHandler.sendErrorResponse(res, error, ERROR.BAD_REQUEST);
    }
  }
  async acceptTask(req: Request, res: Response): Promise<void> {
    try {
      const { loginUser, params } = req;

      const tasksData = await TasksService.acceptTask({ loginUser, taskId: params.taskId });
      ApiResponseHandler.sendResponse(res, StatusCodes.OK, tasksData, 'Tasks ' + SUCCESS.FETCHED);
    } catch (error) {
      ApiResponseHandler.sendErrorResponse(res, error, ERROR.BAD_REQUEST);
    }
  }
  async pinTask(req: Request, res: Response): Promise<void> {
    try {
      const { loginUser, params } = req;

      const tasksData = await TasksService.pinTask({ loginUser, taskId: params.taskId });
      ApiResponseHandler.sendResponse(res, StatusCodes.OK, tasksData, 'Tasks ' + SUCCESS.UPDATED);
    } catch (error) {
      ApiResponseHandler.sendErrorResponse(res, error, ERROR.BAD_REQUEST);
    }
  }

  async fetchScheduledRecurringTasks(req: Request, res: Response): Promise<void> {
    try {
      const loginUser = req.loginUser;
      const { active, statusFilter, page } = req.query;
      const tasksData = await TasksService.fetchScheduledRecurringTasks({
        loginUser,
        active: isTrue(active as string),
        statusFilter: (statusFilter as string) || 'all',
        page: Number(page) || 1,
      });
      ApiResponseHandler.sendResponse(
        res,
        StatusCodes.OK,
        tasksData,
        'Scheduled Recurring Tasks ' + SUCCESS.FETCHED
      );
    } catch (error) {
      ApiResponseHandler.sendErrorResponse(res, error, ERROR.BAD_REQUEST);
    }
  }

  async updateScheduledRecurringTask(req: Request, res: Response): Promise<void> {
    try {
      const loginUser = req.loginUser;
      const tasksData = await TasksService.updateScheduledRecurringTask({
        body: req.body,
        loginUser,
      });
      ApiResponseHandler.sendResponse(
        res,
        StatusCodes.OK,
        tasksData,
        'Scheduled/Recurring Tasks ' + SUCCESS.UPDATED
      );
    } catch (error) {
      ApiResponseHandler.sendErrorResponse(res, error, ERROR.BAD_REQUEST);
    }
  }

  async deleteScheduledRecurringTask(req: Request, res: Response): Promise<void> {
    try {
      const loginUser = req.loginUser;
      const tasksData = await TasksService.deleteScheduledRecurringTask({
        loginUser,
        body: req.body,
      });
      ApiResponseHandler.sendResponse(
        res,
        StatusCodes.OK,
        tasksData,
        'Scheduled/Recurring Tasks ' + SUCCESS.DELETED
      );
    } catch (error) {
      ApiResponseHandler.sendErrorResponse(res, error, ERROR.BAD_REQUEST);
    }
  }
  async createBulkTask(req: Request, res: Response): Promise<void> {
    try {
      const loginUser = req.loginUser;
      const tasksData = await TasksService.createBulkTask({
        body: req.body,
        loginUser,
      });
      ApiResponseHandler.sendResponse(
        res,
        StatusCodes.OK,
        tasksData,
        'Bulk Tasks ' + SUCCESS.CREATED
      );
    } catch (error) {
      ApiResponseHandler.sendErrorResponse(res, error, ERROR.BAD_REQUEST);
    }
  }
}

export default new TaskController();
