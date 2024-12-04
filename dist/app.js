"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const compression_1 = __importDefault(require("compression"));
const morgan_1 = __importDefault(require("morgan"));
//Utils
const logger_1 = __importDefault(require("./utils/logger"));
const error_middleware_1 = __importDefault(require("./middleware/error.middleware"));
const prismaClient_1 = require("./utils/prismaClient");
class App {
    constructor(controllers, port = Number(process.env.PORT) | 3000) {
        this.initialRoute = '/api';
        this.express = (0, express_1.default)();
        this.port = port;
        this.initializeDatabaseConnection();
        this.initializeMiddleware();
        this.initializeControllers(controllers);
        this.initializeErrorHandling();
    }
    initializeMiddleware() {
        this.express.use((0, helmet_1.default)());
        this.express.use((0, cors_1.default)({ origin: '*' }));
        this.express.use((0, morgan_1.default)('dev'));
        this.express.use(express_1.default.json());
        this.express.use(express_1.default.urlencoded({ extended: false }));
        this.express.use((0, compression_1.default)());
    }
    initializeControllers(controllers) {
        controllers.forEach((controller) => {
            this.express.use(this.initialRoute, controller.router);
        });
    }
    initializeErrorHandling() {
        this.express.use(error_middleware_1.default);
    }
    initializeDatabaseConnection() {
        prismaClient_1.prisma.$connect();
        logger_1.default.info('DATABASE CONNECTED');
    }
    listen() {
        this.express.listen(this.port, () => {
            logger_1.default.info('API IS RUNING');
        });
    }
}
exports.default = App;
