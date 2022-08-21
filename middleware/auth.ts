import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import asyncHandler from "./async";
import ErrorResponse from "../utils/errorResponse";
import User from "../models/User";

export interface IUserRequest extends Request {
  user?: any;
}

// Protect routes
export const protect = asyncHandler(
  async (req: IUserRequest, res: Response, next: NextFunction) => {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return next(
        new ErrorResponse("You are not authorized to access this route", 401)
      );
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
        id: string;
      };

      req.user = await User.findById(decoded.id);

      next();
    } catch (err) {
      return next(
        new ErrorResponse("You are not authorized to access this route", 401)
      );
    }
  }
);
