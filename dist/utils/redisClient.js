"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_service_1 = __importDefault(require("../resources/logger/logger.service"));
const ioredis_1 = __importDefault(require("ioredis"));
const logger_1 = __importDefault(require("./logger"));
const logger = new logger_service_1.default();
const redisClient = new ioredis_1.default({
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
    password: process.env.REDIS_PASSWORD,
    username: process.env.REDIS_USERNAME,
});
redisClient.on('error', (err) => {
    logger_1.default.error('Redis error', err.message);
    logger.createLog('ERROR', 'Redis error', err.message);
});
redisClient.on('connect', () => {
    logger_1.default.info('Redis connected');
    logger.createLog('INFO', 'Redis connected', 'Redis connected');
});
exports.default = redisClient;
