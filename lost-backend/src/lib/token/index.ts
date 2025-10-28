import jwt from "jsonwebtoken";
import { User } from "../../interfaces/user.interface";
import { Request } from "express";

export const generateToken = async ({ user, email }: { user: User; email: string }) => {
  const secret_key = process.env.JWT_SECRET || "";
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
    expiresIn: "1d",
  });
};

export const getToken = (req: Request): string => {
  const token = req.headers?.authorization || "";
  return token;
};
