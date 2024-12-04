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
const jwtToken_1 = __importDefault(require("../utils/jwtToken"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const http_exceptions_1 = __importDefault(require("../utils/http.exceptions"));
const lodash_1 = require("lodash");
const auth_service_1 = __importDefault(require("../resources/auth/auth.service"));
const logger_service_1 = __importDefault(require("../resources/logger/logger.service"));
function authenticatedMiddleware(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const authService = new auth_service_1.default();
        const logger = new logger_service_1.default();
        const bearer = req.headers.authorization;
        if (!bearer || !bearer.startsWith('Bearer ')) {
            return next(new http_exceptions_1.default('Unauthorized', 401, { translation: false }));
        }
        const accessToken = bearer.split('Bearer ')[1].trim();
        try {
            const payload = yield jwtToken_1.default.verifyToken(accessToken);
            if (payload instanceof jsonwebtoken_1.default.JsonWebTokenError) {
                return next(new http_exceptions_1.default('Unauthorized', 401, { translation: false }));
            }
            if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
                return next(new http_exceptions_1.default('Unauthorized', 401, { translation: false }));
            }
            const admin = yield authService.getAdminAccountById(payload.id);
            if (!admin) {
                return next(new http_exceptions_1.default('Unauthorized', 401, { translation: false }));
            }
            //Adds the user to the req
            (0, lodash_1.merge)(req, { admin });
            return next();
        }
        catch (error) {
            yield logger.createLog('WARNING', error.message, JSON.stringify({ ip: req.ip, url: req.originalUrl }));
            return next(new http_exceptions_1.default('Unauthorized', 401, { translation: false }));
        }
    });
}
exports.default = authenticatedMiddleware;
