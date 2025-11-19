import { z } from 'zod';

export const createExpenseSchema = z.object({
  expenseType: z.string(),
  amount: z.number().positive()
});



