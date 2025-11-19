import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import { env } from '../config/env';

export interface JwtPayload {
  sub: string;
  role: string;
  organizationId?: string;
  type: 'access' | 'refresh';
}

const accessSecret: Secret = env.jwt.accessSecret as unknown as Secret;
const refreshSecret: Secret = env.jwt.refreshSecret as unknown as Secret;

export const generateAccessToken = (payload: Omit<JwtPayload, 'type'>): string => {
  const options: SignOptions = { expiresIn: env.jwt.accessExpiresIn as unknown as number };
  return jwt.sign({ ...payload, type: 'access' }, accessSecret, options);
};

export const generateRefreshToken = (payload: Omit<JwtPayload, 'type'>): string => {
  const options: SignOptions = { expiresIn: env.jwt.refreshExpiresIn as unknown as number };
  return jwt.sign({ ...payload, type: 'refresh' }, refreshSecret, options);
};

export const verifyAccessToken = (token: string): JwtPayload => {
  return jwt.verify(token, accessSecret) as JwtPayload;
};

export const verifyRefreshToken = (token: string): JwtPayload => {
  return jwt.verify(token, refreshSecret) as JwtPayload;
};

