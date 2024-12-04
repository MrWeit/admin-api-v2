"use strict";
// src/controllers/settings.controller.ts
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
const validation_middleware_1 = require("../../middleware/validation.middleware");
const helper_1 = require("../../utils/helper");
const http_exceptions_1 = require("../../utils/http.exceptions");
const auth_middleware_1 = __importDefault(require("../../middleware/auth.middleware"));
const logger_service_1 = __importDefault(require("../logger/logger.service"));
const settings_service_1 = __importDefault(require("./settings.service"));
const settings_validation_1 = require("./settings.validation");
const functions_1 = require("../../utils/functions");
class SettingsController {
    constructor() {
        this.path = "/admin/settings";
        this.router = (0, express_1.Router)();
        this.log = new logger_service_1.default();
        this.settingsService = new settings_service_1.default();
        this.createUpdateSettings = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.settingsService.createUpdateSettings(req.body);
                const settings = yield this.settingsService.getSettingsWithStatus();
                (0, helper_1.showSuccess)(req, res, "Settings updated successfully", { data: settings });
            }
            catch (error) {
                yield this.log.createLog('ERROR', error.message, JSON.stringify({ ip: req.ip, url: req.originalUrl }));
                next(new http_exceptions_1.BadRequestError("Failed to update settings"));
            }
        });
        this.getSettings = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const settings = yield this.settingsService.getSettingsWithStatus();
                (0, helper_1.showSuccess)(req, res, "Settings retrieved successfully", { data: settings });
            }
            catch (error) {
                yield this.log.createLog('ERROR', error.message, JSON.stringify({ ip: req.ip, url: req.originalUrl }));
                next(new http_exceptions_1.BadRequestError("Failed to get settings"));
            }
        });
        this.postProxies = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.settingsService.postJsonProxiesList(req.body);
                (0, helper_1.showSuccess)(req, res, "Proxies added successfully");
            }
            catch (error) {
                yield this.log.createLog('ERROR', error.message, JSON.stringify({ ip: req.ip, url: req.originalUrl }));
                next(new http_exceptions_1.BadRequestError("Failed to add proxies"));
            }
        });
        this.getProxies = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const proxies = yield this.settingsService.getProxies();
                //Will ping all proxies
                const pingedProxies = yield Promise.all(proxies.map((proxy) => __awaiter(this, void 0, void 0, function* () {
                    return Object.assign(Object.assign({}, proxy), { status: (yield (0, functions_1.pingServer)(proxy.ip)) ? "online" : "offline", numberOfMiningAccounts: proxy.miningAccounts.length });
                })));
                (0, helper_1.showSuccess)(req, res, "Proxies retrieved successfully", { data: pingedProxies });
            }
            catch (error) {
                yield this.log.createLog('ERROR', error.message, JSON.stringify({ ip: req.ip, url: req.originalUrl }));
                next(new http_exceptions_1.BadRequestError("Failed to get proxies"));
            }
        });
        this.initializeRoutes();
    }
    initializeRoutes() {
        // Create/updates settings
        this.router.post(`${this.path}`, auth_middleware_1.default, (0, validation_middleware_1.validateRequest)(settings_validation_1.createUpdateSettingsSchema), this.createUpdateSettings);
        // Get settings
        this.router.get(`${this.path}`, auth_middleware_1.default, this.getSettings);
        //Post all proxies
        this.router.post(`${this.path}/proxies`, auth_middleware_1.default, this.postProxies);
        this.router.get(`${this.path}/proxies`, auth_middleware_1.default, this.getProxies);
    }
}
exports.default = SettingsController;
