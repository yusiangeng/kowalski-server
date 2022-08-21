import { NextFunction, Response } from "express";
import asyncHandler from "../middleware/async";
import { IUserRequest } from "../middleware/auth";
import Record from "../models/Record";

// GET /api/v1/report
export const getReport = asyncHandler(
  async (req: IUserRequest, res: Response, next: NextFunction) => {
    const records = await Record.find({ userId: req.user._id });

    let totalIncome = 0;
    let totalExpense = 0;
    const incomeCategories: { [key: string]: number } = {};
    const expenseCategories: { [key: string]: number } = {};

    records.forEach((record) => {
      if (record.type === "Income") {
        const amount = record.amount as number;
        totalIncome += amount;

        const category = record.category as string;
        if (!incomeCategories[category]) {
          incomeCategories[category] = 0;
        }
        incomeCategories[category] += amount;
      } else {
        const amount = record.amount as number;
        totalExpense += amount;

        const category = record.category as string;
        if (!expenseCategories[category]) {
          expenseCategories[category] = 0;
        }
        expenseCategories[category] += amount;
      }
    });

    res.status(200).json({
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
      incomeCategories,
      expenseCategories,
    });
  }
);
