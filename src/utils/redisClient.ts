
import LoggerService from '@resources/logger/logger.service';
import Redis from 'ioredis';
import log from './logger';

const logger = new LoggerService();

const redisClient = new Redis({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  password: process.env.REDIS_PASSWORD,
  username: process.env.REDIS_USERNAME,
  tls: {}
});

redisClient.on('error', (err) => {
  log.error('Redis error', err.message);
  logger.createLog('ERROR', 'Redis error', err.message);
});

redisClient.on('connect', () => {
  log.info('Redis connected');
  logger.createLog('INFO', 'Redis connected', 'Redis connected');
});

export default redisClient;