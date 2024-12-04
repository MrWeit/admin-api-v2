"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("../../utils/logger"));
const prismaClient_1 = require("../../utils/prismaClient");
class LoggerService {
    getLogsByLogTypeWithPagination(logType, page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            //Using prisma.adminApiLogs
            const skip = (page - 1) * limit;
            const totalLogs = yield prismaClient_1.prisma.adminApiLog.count({ where: { logType } });
            const totalPages = Math.ceil(totalLogs / limit);
            const logs = yield prismaClient_1.prisma.adminApiLog.findMany({ where: { logType }, skip, take: limit });
            return { logs, totalPages };
        });
    }
    getAllLogs(page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            //Using prisma.adminApiLogs
            const skip = (page - 1) * limit;
            const totalLogs = yield prismaClient_1.prisma.adminApiLog.count();
            const totalPages = Math.ceil(totalLogs / limit);
            const logs = yield prismaClient_1.prisma.adminApiLog.findMany({ skip, take: limit });
            return { logs, totalPages };
        });
    }
    createLog(logType, message, data) {
        return __awaiter(this, void 0, void 0, function* () {
            //Using prisma.adminApiLogs
            const { DEBUG } = process.env;
            if (DEBUG) {
                if (logType === 'CRITICAL')
                    logger_1.default.error(`[${new Date().toISOString()} -- ${logType}] ${message}`);
                else if (logType === 'ERROR')
                    logger_1.default.error(`[${new Date().toISOString()} -- ${logType}] ${message}`);
                else if (logType === 'WARNING')
                    logger_1.default.warn(`[${new Date().toISOString()} -- ${logType}] ${message}`);
                else if (logType === 'INFO')
                    logger_1.default.debug(`[${new Date().toISOString()} -- ${logType}] ${message}`);
            }
            return yield prismaClient_1.prisma.adminApiLog.create({ data: { logType, message, data } });
        });
    }
}
exports.default = LoggerService;
