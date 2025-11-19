import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler = (err: Error, req: Request, res: Response, _next: NextFunction): void => {
  logger.error(err.message, { stack: err.stack });
  res.status(500).json({
    status: 'error',
    message: err.message || 'Internal server error'
  });
};



