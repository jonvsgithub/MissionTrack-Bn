import { z } from 'zod';

export const fundAllocationSchema = z.object({
  allocatedAmount: z.number().positive()
});



