"use strict";
// src/controllers/docker.controller.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
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
const miningAccount_service_1 = __importDefault(require("./miningAccount.service"));
const miningAccount_validation_1 = require("./miningAccount.validation");
class MiningAccountController {
    constructor() {
        this.path = "/admin/mining-account";
        this.router = (0, express_1.Router)();
        this.miningAccountService = new miningAccount_service_1.default();
        this.log = new logger_service_1.default();
        this.createMiningAccount = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                //Will create the mining account
                const _a = req.body, { poolId, clientId, proxyId } = _a, rest = __rest(_a, ["poolId", "clientId", "proxyId"]);
                const miningAccount = yield this.miningAccountService.createMiningAccount(Object.assign(Object.assign({}, rest), { pool: {
                        connect: {
                            id: poolId,
                        },
                    }, client: {
                        connect: {
                            id: clientId,
                        },
                    }, proxy: {
                        connect: {
                            id: proxyId,
                        }
                    } }));
                (0, helper_1.showSuccess)(req, res, "Mining Account Created", {
                    data: miningAccount,
                });
            }
            catch (error) {
                yield this.log.createLog("ERROR", error.message, JSON.stringify({ ip: req.ip, url: req.originalUrl }));
                next(new http_exceptions_1.BadRequestError("Error creating Mining Account"));
            }
        });
        this.listMiningAccounts = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const miningAccounts = yield this.miningAccountService.getMiningAccounts();
                (0, helper_1.showSuccess)(req, res, "Mining Accounts listed successfully", {
                    data: miningAccounts,
                });
            }
            catch (error) {
                yield this.log.createLog("ERROR", error.message, JSON.stringify({ ip: req.ip, url: req.originalUrl }));
                next(new http_exceptions_1.BadRequestError("Error listing mining accounts"));
            }
        });
        this.deleteMiningAccount = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.params.id) {
                    throw new Error("Mining Account ID is required");
                }
                const minerAccount = yield this.miningAccountService.deleteMiningAccount(req.params.id);
                //Deletes from db
                (0, helper_1.showSuccess)(req, res, "Mining account Deleted", {
                    data: minerAccount,
                });
            }
            catch (error) {
                this.log.createLog("ERROR", error.message, JSON.stringify({ ip: req.ip, url: req.originalUrl }));
                next(new http_exceptions_1.BadRequestError("Error deleting mining account container"));
            }
        });
        this.getMiningAccount = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.params.id) {
                    throw new Error("Mining Account ID is required");
                }
                const miningAccount = yield this.miningAccountService.getMiningAccountById(req.params.id);
                (0, helper_1.showSuccess)(req, res, "Mining Account", {
                    data: miningAccount,
                });
            }
            catch (error) {
                this.log.createLog("ERROR", error.message, JSON.stringify({ ip: req.ip, url: req.originalUrl }));
                next(new http_exceptions_1.BadRequestError("Error getting mining account"));
            }
        });
        this.createMultipleMiningAccounts = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { workerNames } = req.body;
                // Constants for Mining Account Parameters
                const POOL_ID = "6740ce5f147e213c2a4b3157";
                const CLIENT_ID = "674936a9a138316ce046b6ee";
                const COIN = "BTC"; // or "LTC"
                const NOTE = "Nebolaloop1";
                const CODE_PREFIX = "sha"; // Code prefix for unique code generation
                const HASHRATE_LIMIT_PH = 4;
                const HASHRATE_PER_MACHINE_TH = 120;
                const MULTIPLICATION_FACTOR = 3;
                const IN_DIFF = 1048576;
                // Get available proxies
                const proxies = yield this.miningAccountService.getProxies();
                if (proxies.length === 0) {
                    throw new Error("No proxies available");
                }
                // Distribute workerNames across proxies evenly
                const proxyAssignments = workerNames.map((workerName, index) => {
                    const proxy = proxies[index % proxies.length];
                    return { workerName, proxyId: proxy.id };
                });
                // Prepare Mining Accounts Data
                const miningAccountsData = proxyAssignments.map(({ workerName, proxyId }, index) => ({
                    note: NOTE,
                    code: `${CODE_PREFIX}-${Date.now()}-${index}`,
                    coin: COIN,
                    hashrateLimitPh: HASHRATE_LIMIT_PH,
                    hashratePerMachineTh: HASHRATE_PER_MACHINE_TH,
                    multiplicationFactor: MULTIPLICATION_FACTOR,
                    inDiff: IN_DIFF,
                    wallets: [],
                    workerName,
                    pool: {
                        connect: {
                            id: POOL_ID,
                        },
                    },
                    client: {
                        connect: {
                            id: CLIENT_ID,
                        },
                    },
                    proxy: {
                        connect: {
                            id: proxyId,
                        },
                    },
                }));
                // Create Mining Accounts in Bulk
                const createdMiningAccounts = yield this.miningAccountService.createMultipleMiningAccounts(miningAccountsData);
                (0, helper_1.showSuccess)(req, res, "Mining Accounts Created", {
                    data: createdMiningAccounts,
                });
            }
            catch (error) {
                yield this.log.createLog("ERROR", error.message, JSON.stringify({ ip: req.ip, url: req.originalUrl }));
                next(new http_exceptions_1.BadRequestError("Error creating multiple Mining Accounts"));
            }
        });
        this.initializeRoutes();
    }
    initializeRoutes() {
        // Create mining account
        this.router.post(`${this.path}/create`, auth_middleware_1.default, (0, validation_middleware_1.validateRequest)(miningAccount_validation_1.createMiningAccountSchema), this.createMiningAccount);
        // List all mining accounts
        this.router.get(`${this.path}/list`, auth_middleware_1.default, this.listMiningAccounts);
        // Delete mining account
        this.router.delete(`${this.path}/delete/:id`, auth_middleware_1.default, this.deleteMiningAccount);
        this.router.get(`${this.path}/get/:id`, auth_middleware_1.default, this.getMiningAccount);
        this.router.post(`${this.path}/create-multiple`, auth_middleware_1.default, this.createMultipleMiningAccounts);
    }
}
exports.default = MiningAccountController;
