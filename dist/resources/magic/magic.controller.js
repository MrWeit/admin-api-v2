"use strict";
// src/controllers/magic.controller.ts
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
const logger_service_1 = __importDefault(require("../logger/logger.service"));
const magic_validation_1 = require("./magic.validation");
const magic_middleware_1 = __importDefault(require("../../middleware/magic.middleware"));
const client_service_1 = __importDefault(require("../client/client.service"));
const miningAccount_service_1 = __importDefault(require("../miningAccount/miningAccount.service"));
const magic_service_1 = __importDefault(require("./magic.service"));
class MagicController {
    constructor() {
        this.path = "/admin/magic";
        this.router = (0, express_1.Router)();
        this.log = new logger_service_1.default();
        this.clientService = new client_service_1.default();
        this.miningAccountService = new miningAccount_service_1.default();
        this.magicService = new magic_service_1.default();
        /**
         * Authenticates a miner and assigns it to an appropriate mining account.
         */
        this.authenticateMiner = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { worker_name, worker_password: password, public_ip: publicIp, coin, instance_id, } = req.body;
                //Slits the workerName to have the workerUsername and workerPrefix
                const workerUsername = worker_name.split(".")[0];
                const minerPrefix = worker_name.split(".")[1];
                const client = yield this.clientService.getClientByWorkerNameIpAndPassword(workerUsername, password, publicIp || "");
                if (!client) {
                    this.log.createLog("WARNING", "Miner unauthorized", JSON.stringify({ ip: req.ip, worker_name, publicIp }));
                    throw new http_exceptions_1.BadRequestError("Who TF are you? :D");
                }
                // Fetch mining accounts for the client and coin
                const miningAccounts = yield this.miningAccountService.getMiningAccountsByClientIdAndCoin(client.id, coin);
                if (!miningAccounts || miningAccounts.length === 0) {
                    throw new http_exceptions_1.BadRequestError("No mining accounts available");
                }
                // Populate Redis with mining account data
                yield this.magicService.populateMiningAccountsInRedis(client.id, miningAccounts);
                // Respond with the assigned mining account details
                (0, helper_1.showSuccess)(req, res, "Miner authenticated and assigned to mining account", {
                    data: {
                        client_id: client.id,
                    },
                });
            }
            catch (error) {
                yield this.log.createLog("ERROR", error.message, JSON.stringify({ ip: req.ip, url: req.originalUrl }));
                //If its an prisma error, sends new message
                if (error.message.includes("prisma")) {
                    next(new http_exceptions_1.BadRequestError("Error authenticating miner"));
                }
                next(new http_exceptions_1.BadRequestError(error.message));
            }
        });
        this.getPoolProxy = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            //Gets all proxies
            const proxy = yield this.magicService.getRandomProxy();
            (0, helper_1.showSuccess)(req, res, "Pool proxy details", {
                data: {
                    pool_url: "btc.viabtc.io",
                    pool_port: 3333,
                    proxy_address: "isp.oxylabs.io",
                    proxy_port: proxy.port,
                    proxy_username: "nebolaloop_Mlupa",
                    proxy_password: "Nebolaloop123++",
                    in_diff: 1048576,
                }
            });
        });
        this.initializeRoutes();
    }
    initializeRoutes() {
        // Authenticate miner
        this.router.post(`${this.path}/miner/authenticate`, magic_middleware_1.default, (0, validation_middleware_1.validateRequest)(magic_validation_1.authenticateMinerSchema), this.authenticateMiner);
        this.router.post(`${this.path}/pool/get-proxy`, magic_middleware_1.default, this.getPoolProxy);
    }
}
exports.default = MagicController;
