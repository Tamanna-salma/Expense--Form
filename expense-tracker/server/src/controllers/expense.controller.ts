import { Request, Response, NextFunction } from 'express';
import { Expense } from '../models/Expense';

// Helper wrapper to avoid try-catch repeating blocks
const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// @desc    Create new expense
// @route   POST /api/expenses
// @access  Public
export const createExpense = asyncHandler(async (req: Request, res: Response) => {
  const { title, amount, category, date } = req.body;

  const expense = await Expense.create({
    title,
    amount,
    category,
    date,
  });

  res.status(201).json({
    success: true,
    data: expense,
  });
});

// @desc    Get all expenses
// @route   GET /api/expenses
// @access  Public
export const getAllExpenses = asyncHandler(async (req: Request, res: Response) => {
  const expenses = await Expense.find().sort({ date: -1 });

  res.status(200).json({
    success: true,
    count: expenses.length,
    data: expenses,
  });
});

// @desc    Get single expense
// @route   GET /api/expenses/:id
// @access  Public
export const getExpenseById = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const expense = await Expense.findById(req.params.id);

  if (!expense) {
    res.status(404);
    return next(new Error('Expense not found'));
  }

  res.status(200).json({
    success: true,
    data: expense,
  });
});

// @desc    Update expense
// @route   PATCH /api/expenses/:id
// @access  Public
export const updateExpense = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const expense = await Expense.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!expense) {
    res.status(404);
    return next(new Error('Expense not found'));
  }

  res.status(200).json({
    success: true,
    data: expense,
  });
});

// @desc    Delete expense
// @route   DELETE /api/expenses/:id
// @access  Public
export const deleteExpense = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const expense = await Expense.findByIdAndDelete(req.params.id);

  if (!expense) {
    res.status(404);
    return next(new Error('Expense not found'));
  }

  res.status(200).json({
    success: true,
    message: 'Expense removed successfully',
  });
});
