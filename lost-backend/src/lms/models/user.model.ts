import prisma from './prisma';
import { User } from '@prisma/client';

export class UserModel {
  static async findAll(): Promise<User[]> {
    return await prisma.user.findMany();
  }

  static async findById(id: number): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { id },
    });
  }

  static async findByEmail(email: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { email },
    });
  }

  static async create(data: {
    email: string;
    name?: string;
    userId: string;
    createdBy: string;
  }): Promise<User> {
    return await prisma.user.create({
      data,
    });
  }

  static async update(id: number, data: { email?: string; name?: string }): Promise<User> {
    return await prisma.user.update({
      where: { id },
      data,
    });
  }

  static async delete(id: number): Promise<User> {
    return await prisma.user.delete({
      where: { id },
    });
  }
}
