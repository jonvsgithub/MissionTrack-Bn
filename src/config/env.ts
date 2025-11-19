import dotenv from 'dotenv';
import path from 'path';

dotenv.config({
  path: process.env.NODE_ENV === 'test' ? path.resolve(process.cwd(), '.env.test') : path.resolve(process.cwd(), '.env')
});

const REQUIRED_VARS = ['JWT_ACCESS_SECRET', 'JWT_REFRESH_SECRET'];

REQUIRED_VARS.forEach((key) => {
  if (!process.env[key]) {
    console.warn(`[env] Missing recommended environment variable: ${key}`);
  }
});

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  isDev: (process.env.NODE_ENV || 'development') === 'development',
  port: Number(process.env.PORT) || 4000,
  appUrl: process.env.APP_URL || 'http://localhost:4000',
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET!,
    refreshSecret: process.env.JWT_REFRESH_SECRET!,
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d'
  },
  database: {
    url: process.env.DATABASE_URL,
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    dbName: process.env.DB_NAME || 'missiontrack',
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT) || 5432
  },
  smtp: {
    host: process.env.EMAIL_HOST || '',
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: process.env.EMAIL_SECURE === 'true',
    user: process.env.EMAIL_USER || '',
    pass: process.env.EMAIL_PASSWORD || '',
    fromEmail: process.env.SMTP_FROM_EMAIL || 'noreplymission.track@gmail.com'
  },
  uploadsDir: process.env.UPLOADS_DIR || path.resolve(process.cwd(), 'src', 'uploads')
};
