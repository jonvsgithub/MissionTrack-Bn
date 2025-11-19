import { ZodError, ZodTypeAny } from 'zod';
import { Request, Response, NextFunction } from 'express';
import { errorResponse } from '../utils/apiResponse';

export const validate =
  (schema: ZodTypeAny, property: 'body' | 'params' | 'query' = 'body') =>
  (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse(req[property]);
      next();
    } catch (error) {
      const validationError = error as ZodError;
      errorResponse(
        res,
        422,
        'Validation failed',
        validationError.issues.map((issue) => ({
          path: issue.path.join('.'),
          message: issue.message
        }))
      );
    }
  };

