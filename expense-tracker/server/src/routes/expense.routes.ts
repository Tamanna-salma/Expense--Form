import { Router } from 'express';
import {
  createExpense,
  getAllExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
} from '../controllers/expense.controller';

const router = Router();

router.route('/')
  .post(createExpense)
  .get(getAllExpenses);

router.route('/:id')
  .get(getExpenseById)
  .patch(updateExpense)
  .delete(deleteExpense);

export default router;
