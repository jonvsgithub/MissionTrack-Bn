import { missionExpenseRepository } from '../repositories/expense.repository';
import { missionRepository } from '../repositories/mission.repository';
import { notificationRepository } from '../repositories/notification.repository';

interface CreateExpenseInput {
  expenseType: string;
  amount: number;
  receiptFile?: string | null;
}

export class ExpenseService {
  async createExpense(missionId: string, submittedBy: string, payload: CreateExpenseInput) {
    const mission = await missionRepository.findById(missionId);
    if (!mission) {
      throw new Error('Mission not found');
    }
    return missionExpenseRepository.create({
      missionId,
      submittedBy,
      expenseType: payload.expenseType,
      amount: payload.amount,
      receiptFile: payload.receiptFile || null,
      status: 'pending_finance'
    } as any);
  }

  async updateExpenseStatus(id: string, status: 'approved' | 'rejected', reviewerId: string) {
    const expense = await missionExpenseRepository.findById(id);
    if (!expense) {
      throw new Error('Expense not found');
    }
    await missionExpenseRepository.update(id, { status } as any);
    await notificationRepository.create({
      userId: expense.submittedBy,
      title: 'Expense update',
      message: `Your expense for mission ${expense.missionId} is ${status}`
    } as any);
    if (status === 'approved') {
      // optionally update mission to completed
      await missionRepository.update(expense.missionId, { status: 'completed' } as any);
    }
    return missionExpenseRepository.findById(id);
  }
}

export const expenseService = new ExpenseService();



