import { NextFunction, Request, Response } from "express";
import { MongoError } from "mongodb";
import { Error } from "mongoose";
import ErrorResponse from "../utils/errorResponse";

const errorHandler = (
  err: Error | MongoError | ErrorResponse,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err);

  let error = { ...err };
  error.message = err.message;

  // Mongoose bad ObjectId
  if (err.name == "CastError") {
    const message = `Resource not found`;
    error = new ErrorResponse(message, 404);
  }

  // Mongoose duplicate key
  if ((err as MongoError).code === 11000) {
    const message = "Duplicate field value entered";
    error = new ErrorResponse(message, 422);
  }

  // Mongoose validation error
  if (err instanceof Error.ValidationError) {
    const message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");
    error = new ErrorResponse(message, 422);
  }

  res.status((error as ErrorResponse).statusCode ?? 500).json({
    message: error.message || "Something went wrong, please try again later",
  });
};

export default errorHandler;
