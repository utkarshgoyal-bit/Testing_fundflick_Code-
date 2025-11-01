import { Request, Response } from 'express';
import { UserService } from '../service/user.service';
import { v4 as uuidv4 } from 'uuid';

export class UserController {
  static async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const users = await UserService.getAllUsers();
      res.status(200).json({
        success: true,
        data: users,
        message: 'Users fetched successfully',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching users',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  static async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const user = await UserService.getUserById(parseInt(id));

      if (!user) {
        res.status(404).json({
          success: false,
          message: 'User not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: user,
        message: 'User fetched successfully',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching user',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  static async createUser(req: Request, res: Response): Promise<void> {
    try {
      const { email, name } = req.body;
      const { loginUser } = req;
      const loginUserId = loginUser?._id || 'system';

      if (!email) {
        res.status(400).json({
          success: false,
          message: 'Email is required',
        });
        return;
      }

      const userId = uuidv4();
      const user = await UserService.createUser({ email, name, userId, createdBy: loginUserId });
      res.status(201).json({
        success: true,
        data: user,
        message: 'User created successfully',
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: 'Error creating user',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  static async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { email, name } = req.body;

      const user = await UserService.updateUser(parseInt(id), { email, name });
      res.status(200).json({
        success: true,
        data: user,
        message: 'User updated successfully',
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: 'Error updating user',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  static async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const user = await UserService.deleteUser(parseInt(id));
      res.status(200).json({
        success: true,
        data: user,
        message: 'User deleted successfully',
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: 'Error deleting user',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}
