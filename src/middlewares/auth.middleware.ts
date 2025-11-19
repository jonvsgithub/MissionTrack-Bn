import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt';
import { errorResponse } from '../utils/apiResponse';

export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    errorResponse(res, 401, 'Authorization header missing');
    return;
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    errorResponse(res, 401, 'Token missing');
    return;
  }

  try {
    const payload = verifyAccessToken(token);
    req.user = {
      id: payload.sub,
      role: payload.role,
      email: '',
      ...(payload.organizationId ? { organizationId: payload.organizationId } : {})
    };
    next();
  } catch (error) {
    errorResponse(res, 401, 'Invalid or expired token', error);
  }
};

