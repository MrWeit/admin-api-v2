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
const express_1 = require("express");
const http_exceptions_1 = require("../../utils/http.exceptions");
const helper_1 = require("../../utils/helper");
const validation_middleware_1 = require("../../middleware/validation.middleware");
const logger_service_1 = __importDefault(require("../logger/logger.service"));
const client_service_1 = __importDefault(require("./client.service"));
const client_validation_1 = require("./client.validation");
const auth_middleware_1 = __importDefault(require("../../middleware/auth.middleware"));
class ClientController {
    constructor() {
        this.path = "/admin/client";
        this.router = (0, express_1.Router)();
        this.clientService = new client_service_1.default();
        this.log = new logger_service_1.default();
        this.createClient = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const client = yield this.clientService.createClient(req.body);
                (0, helper_1.showSuccess)(req, res, "Client Created", { data: client });
            }
            catch (error) {
                yield this.log.createLog('WARNING', error.message, JSON.stringify({ ip: req.ip, url: req.originalUrl }));
                next(new http_exceptions_1.BadRequestError("Error creating client"));
            }
        });
        this.getClient = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.params.id) {
                    throw new http_exceptions_1.BadRequestError("Client ID is required");
                }
                const client = yield this.clientService.getClientById(req.params.id);
                (0, helper_1.showSuccess)(req, res, "Client Retrieved", { data: client });
            }
            catch (error) {
                yield this.log.createLog('WARNING', error.message, JSON.stringify({ ip: req.ip, url: req.originalUrl }));
                next(new http_exceptions_1.BadRequestError("Error retrieving client"));
            }
        });
        this.getAllClients = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const clients = yield this.clientService.getAllClients();
                (0, helper_1.showSuccess)(req, res, "Clients Retrieved", { data: clients });
            }
            catch (error) {
                yield this.log.createLog('WARNING', error.message, JSON.stringify({ ip: req.ip, url: req.originalUrl }));
                next(new http_exceptions_1.BadRequestError("Error retrieving clients"));
            }
        });
        this.updateClient = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.params.id) {
                    throw new http_exceptions_1.BadRequestError("Client ID is required");
                }
                const client = yield this.clientService.updateClient(req.params.id, req.body);
                (0, helper_1.showSuccess)(req, res, "Client Updated", { data: client });
            }
            catch (error) {
                yield this.log.createLog('WARNING', error.message, JSON.stringify({ ip: req.ip, url: req.originalUrl }));
                next(new http_exceptions_1.BadRequestError("Error updating client"));
            }
        });
        this.deleteClient = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.params.id) {
                    throw new http_exceptions_1.BadRequestError("Client ID is required");
                }
                const client = yield this.clientService.deleteClient(req.params.id);
                (0, helper_1.showSuccess)(req, res, "Client Deleted", { data: client });
            }
            catch (error) {
                yield this.log.createLog('WARNING', error.message, JSON.stringify({ ip: req.ip, url: req.originalUrl }));
                next(new http_exceptions_1.BadRequestError("Error deleting client"));
            }
        });
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.post(`${this.path}/create`, auth_middleware_1.default, (0, validation_middleware_1.validateRequest)(client_validation_1.createClientSchema), this.createClient);
        this.router.get(`${this.path}/get/:id`, auth_middleware_1.default, this.getClient);
        this.router.get(`${this.path}/get`, auth_middleware_1.default, this.getAllClients);
        this.router.put(`${this.path}/update/:id`, auth_middleware_1.default, (0, validation_middleware_1.validateRequest)(client_validation_1.createClientSchema), this.updateClient);
        this.router.delete(`${this.path}/delete/:id`, auth_middleware_1.default, this.deleteClient);
    }
}
exports.default = ClientController;
