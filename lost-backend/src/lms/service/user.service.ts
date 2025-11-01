import { UserModel } from '../models/user.model';
import { User } from '@prisma/client';

export class UserService {
  static async getAllUsers(): Promise<User[]> {
    return await UserModel.findAll();
  }

  static async getUserById(id: number): Promise<User | null> {
    return await UserModel.findById(id);
  }

  static async getUserByEmail(email: string): Promise<User | null> {
    return await UserModel.findByEmail(email);
  }

  static async createUser(userData: {
    email: string;
    name?: string;
    userId: string;
    createdBy: string;
  }): Promise<User> {
    const existingUser = await UserModel.findByEmail(userData.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }
    return await UserModel.create(userData);
  }

  static async updateUser(id: number, userData: { email?: string; name?: string }): Promise<User> {
    const existingUser = await UserModel.findById(id);
    if (!existingUser) {
      throw new Error('User not found');
    }

    if (userData.email && userData.email !== existingUser.email) {
      const emailExists = await UserModel.findByEmail(userData.email);
      if (emailExists) {
        throw new Error('Email already in use');
      }
    }

    return await UserModel.update(id, userData);
  }

  static async deleteUser(id: number): Promise<User> {
    const existingUser = await UserModel.findById(id);
    if (!existingUser) {
      throw new Error('User not found');
    }
    return await UserModel.delete(id);
  }
}
