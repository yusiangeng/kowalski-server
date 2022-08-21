import { NextFunction, Request, Response } from "express";
import asyncHandler from "../middleware/async";
import { IUserRequest } from "../middleware/auth";
import User, { IUserMethods } from "../models/User";
import ErrorResponse from "../utils/errorResponse";

// POST /api/v1/users/register
export const register = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    const user = await User.create({
      email,
      password,
    });

    const token = user.getSignedJwtToken();

    res.status(200).json({
      message: `Welcome, ${user.email}`,
      data: { token },
    });
  }
);

// POST /api/v1/users/login
export const login = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(
        new ErrorResponse("Please enter your email and password", 422)
      );
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return next(new ErrorResponse("Invalid credentials", 401));
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return next(new ErrorResponse("Invalid credentials", 401));
    }

    const token = user.getSignedJwtToken();

    res.status(200).json({
      message: `Welcome back, ${user.email}!`,
      data: { token },
    });
  }
);

// GET /api/v1/users/me
export const getMe = async (
  req: IUserRequest,
  res: Response,
  next: NextFunction
) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    data: user,
  });
};
