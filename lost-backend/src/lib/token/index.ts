import jwt from 'jsonwebtoken';
import { User } from '../../interfaces/user.interface';
import { Request } from 'express';

export const generateToken = async ({ user, email }: { user: User; email: string }) => {
  const secret_key = process.env.JWT_SECRET || '';
  const { employeeId, role, branches, _id, organization } = user;
  const tokenPayload = {
    role,
    branches,
    employeeId,
    _id,
    email,
    organization,
  };
  return jwt.sign(tokenPayload, secret_key, {
    expiresIn: '9h',
  });
};

export const getToken = (req: Request): string => {
  const authHeader = req.headers?.authorization || '';
  // Strip "Bearer " prefix if present
  if (authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  return authHeader;
};
