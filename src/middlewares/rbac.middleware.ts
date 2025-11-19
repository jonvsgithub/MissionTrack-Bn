import { Request, Response, NextFunction } from 'express';
import { errorResponse } from '../utils/apiResponse';

export const requireRoles = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      errorResponse(res, 403, 'You do not have permission to perform this action');
      return;
    }
    next();
  };
};



