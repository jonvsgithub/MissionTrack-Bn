import { BaseRepository } from './base.repository';
import { FundAllocation } from '../models/fund-allocation.model';

class FundAllocationRepository extends BaseRepository<FundAllocation> {
  constructor() {
    super(FundAllocation);
  }
}

export const fundAllocationRepository = new FundAllocationRepository();



