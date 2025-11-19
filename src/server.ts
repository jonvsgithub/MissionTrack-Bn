import { app } from './app';
import { env } from './config/env';
import { logger } from './utils/logger';

const server = app.listen(env.port, () => {
  logger.info(`MissionTrack API running on port ${env.port}`);
});

process.on('SIGINT', () => {
  server.close(() => {
    logger.info('Server shut down gracefully');
    process.exit(0);
  });
});



