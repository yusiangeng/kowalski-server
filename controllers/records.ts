import { NextFunction, Request, Response } from "express";
import { SortOrder } from "mongoose";
import asyncHandler from "../middleware/async";
import { IUserRequest } from "../middleware/auth";
import Record from "../models/Record";
import ErrorResponse from "../utils/errorResponse";

// GET /api/v1/records
export const getRecords = asyncHandler(
  async (req: IUserRequest, res: Response, next: NextFunction) => {
    let query;

    const reqQuery = { ...req.query };
    const removeFields = ["sortBy", "order", "page", "limit", "userId"];
    removeFields.forEach((param) => delete reqQuery[param]);

    reqQuery.userId = req.user.id;

    let queryStr = JSON.stringify(reqQuery);
    queryStr = queryStr.replace(
      /\b(gt|gte|lt|lte|in)\b/g,
      (match) => `$${match}`
    );
    query = Record.find(JSON.parse(queryStr));

    // Sort
    if (typeof req.query.sortBy === "string") {
      const sortBy = req.query.sortBy.split(",").join(" ");
      query = query.sort({ [sortBy]: req.query.order as SortOrder });
    } else {
      query = query.sort("-date");
    }

    // Pagination
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 25;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Record.countDocuments();
    query = query.skip(startIndex).limit(limit);

    const records = await query;

    interface PaginationInfo {
      page: number;
      limit: number;
    }
    const pagination: { next?: PaginationInfo; prev?: PaginationInfo } = {};
    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit,
      };
    }
    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit,
      };
    }

    res.status(200).json({
      count: records.length,
      pagination,
      data: records,
    });
  }
);

// POST /api/v1/records
export const addRecord = asyncHandler(async function (
  req: IUserRequest,
  res: Response,
  next: NextFunction
) {
  const newRecord = new Record(req.body);
  newRecord.userId = req.user.id;
  const record = await newRecord.save();
  res.status(200).json({ message: "Record added!", data: record });
});

// PUT /api/v1/records/:id
export const updateRecord = asyncHandler(async function (
  req: IUserRequest,
  res: Response,
  next: NextFunction
) {
  let record = await Record.findById(req.params.id);

  if (!record) {
    return next(
      new ErrorResponse(`Record with id ${req.params.id} not found`, 404)
    );
  }

  //@ts-ignore
  if (record.userId!.toString() != req.user.id) {
    return next(
      new ErrorResponse(`You are not authorized to update this record`, 401)
    );
  }

  record = await Record.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ message: "Record updated!", data: record });
});

// DELETE /api/v1/records/:id
export const deleteRecord = asyncHandler(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  await Record.findOneAndDelete({ _id: req.params.id });
  res.status(200).json({ message: "Record deleted!", data: {} });
});
