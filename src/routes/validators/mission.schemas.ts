import { z } from 'zod';

export const createMissionSchema = z.object({
  purpose: z.string(),
  destination: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  duration: z.number().int().positive(),
  estimatedCost: z.number().positive()
});

export const missionDecisionSchema = z.object({
  comment: z.string().optional()
});



