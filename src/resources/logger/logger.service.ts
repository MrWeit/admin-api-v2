import { LogType } from '@prisma/client';
import log from '@utils/logger';
import { prisma } from '@utils/prismaClient';

class LoggerService {

    public async getLogsByLogTypeWithPagination(logType: LogType, page: number, limit: number) {
        //Using prisma.adminApiLogs
        const skip = (page - 1) * limit;
        const totalLogs = await prisma.adminApiLog.count({ where: { logType } });
        const totalPages = Math.ceil(totalLogs / limit);
        const logs = await prisma.adminApiLog.findMany({ where: { logType }, skip, take: limit });
        return { logs, totalPages };

    }

    public async getAllLogs(page: number, limit: number) {
        //Using prisma.adminApiLogs
        const skip = (page - 1) * limit;
        const totalLogs = await prisma.adminApiLog.count();
        const totalPages = Math.ceil(totalLogs / limit);
        const logs = await prisma.adminApiLog.findMany({ skip, take: limit });
        return { logs, totalPages };
    }

    public async createLog(logType: LogType, message: string, data: string) {
        //Using prisma.adminApiLogs
        const { DEBUG } = process.env;
        if(DEBUG) {
            if(logType === 'CRITICAL') log.error(`[${new Date().toISOString()} -- ${logType}] ${message}`);
            else if(logType === 'ERROR') log.error(`[${new Date().toISOString()} -- ${logType}] ${message}`);
            else if(logType === 'WARNING') log.warn(`[${new Date().toISOString()} -- ${logType}] ${message}`);
            else if(logType === 'INFO') log.debug(`[${new Date().toISOString()} -- ${logType}] ${message}`);
        }
        return await prisma.adminApiLog.create({ data: { logType, message, data } });
    }
}

export default LoggerService;