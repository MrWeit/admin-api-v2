"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const express_1 = require("express");
const http_exceptions_1 = require("../../utils/http.exceptions");
const helper_1 = require("../../utils/helper");
const auth_service_1 = __importStar(require("../auth/auth.service"));
const validation_middleware_1 = require("../../middleware/validation.middleware");
const auth_validation_1 = require("./auth.validation");
const logger_service_1 = __importDefault(require("../logger/logger.service"));
const auth_middleware_1 = __importDefault(require("../../middleware/auth.middleware"));
const lodash_1 = require("lodash");
//------------------- AdminAuthController -------------------//
class AdminAuthController {
    constructor() {
        this.path = "/admin/auth";
        this.router = (0, express_1.Router)();
        this.AuthService = new auth_service_1.default();
        this.log = new logger_service_1.default();
        this.login = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const TokenAndUser = yield this.AuthService.login(req.body);
                (0, helper_1.showSuccess)(req, res, "Login Successful", { data: TokenAndUser });
            }
            catch (error) {
                yield this.log.createLog('WARNING', error.message, JSON.stringify({ ip: req.ip, url: req.originalUrl }));
                next(new http_exceptions_1.BadRequestError(error.message));
            }
        });
        this.getAccount = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const user = (0, lodash_1.omit)(req.admin, auth_service_1.adminOmit);
                (0, helper_1.showSuccess)(req, res, "User Account", { data: user });
            }
            catch (error) {
                yield this.log.createLog('WARNING', error.message, JSON.stringify({ ip: req.ip, url: req.originalUrl }));
                next(new http_exceptions_1.BadRequestError(error.message));
            }
        });
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.post(`${this.path}/login`, (0, validation_middleware_1.validateRequest)(auth_validation_1.loginAdminUserSchema), this.login);
        this.router.get(`${this.path}/getAccount`, auth_middleware_1.default, this.getAccount);
    }
}
exports.default = AdminAuthController;
