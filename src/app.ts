import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { apiRouter } from './routes';
import { notFoundHandler } from './middlewares/notFound.middleware';
import { errorHandler } from './middlewares/error.middleware';
import { env } from './config/env';
import { logger } from './utils/logger';
import { sequelize } from './models';

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan(env.isDev ? 'dev' : 'combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  '/uploads',
  express.static(path.resolve(process.cwd(), 'src', 'uploads'), {
    setHeaders: (res) => {
      res.set('Content-Type', 'application/octet-stream');
    }
  })
);

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: 'Too many login attempts, please try again later.'
});

app.use('/api/v1/auth/login', loginLimiter);
app.use('/api/v1', apiRouter);

app.use(notFoundHandler);
app.use(errorHandler);

sequelize
  .authenticate()
  .then(() => logger.info('Database connected'))
  .catch((error) => logger.error('Database connection failed', { error }));

export { app };



