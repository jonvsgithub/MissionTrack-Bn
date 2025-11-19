import { Request, Response } from 'express';
import { expenseService } from '../services/expense.service';
import { successResponse } from '../utils/apiResponse';

export class ExpenseController {
  create = async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const expense = await expenseService.createExpense(id, req.user!.id, {
      expenseType: req.body.expenseType,
      amount: req.body.amount,
      receiptFile: req.file?.path ?? null
    });
    return successResponse(res, 201, 'Expense submitted', expense);
  };

  approve = async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const expense = await expenseService.updateExpenseStatus(id, 'approved', req.user!.id);
    return successResponse(res, 200, 'Expense approved', expense);
  };

  reject = async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const expense = await expenseService.updateExpenseStatus(id, 'rejected', req.user!.id);
    return successResponse(res, 200, 'Expense rejected', expense);
  };
}

export const expenseController = new ExpenseController();

