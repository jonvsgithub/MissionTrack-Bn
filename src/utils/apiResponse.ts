import { Response } from 'express';

export const successResponse = <T>(res: Response, status: number, message: string, data?: T) =>
  res.status(status).json({ status: 'success', message, data });

export const errorResponse = (res: Response, status: number, message: string, errors?: unknown) =>
  res.status(status).json({ status: 'error', message, errors });



