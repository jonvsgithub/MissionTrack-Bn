import { BaseRepository } from './base.repository';
import { MissionExpense } from '../models/mission-expense.model';

class MissionExpenseRepository extends BaseRepository<MissionExpense> {
  constructor() {
    super(MissionExpense);
  }
}

export const missionExpenseRepository = new MissionExpenseRepository();



