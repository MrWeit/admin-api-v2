"use strict";
// src/controllers/magic.service.ts
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
const logger_service_1 = __importDefault(require("../logger/logger.service"));
const functions_1 = require("../../utils/functions");
const prismaClient_1 = require("../../utils/prismaClient");
const redisClient_1 = __importDefault(require("../../utils/redisClient"));
class MagicService {
    constructor() {
        this.log = new logger_service_1.default();
        /**
         * Populates Redis with mining accounts for a given client without overwriting existing data.
         *
         * @param clientID ID of the client.
         * @param miningAccounts List of mining accounts to populate.
         * @returns Promise<void>
         */
        this.populateMiningAccountsInRedis = (clientID, miningAccounts) => __awaiter(this, void 0, void 0, function* () {
            const miningAccountsKey = `client:{123}:${clientID}:miningAccounts`;
            // Add all miningAccountIDs to the client's set
            const miningAccountIDs = miningAccounts.map(account => account.id.toString());
            if (miningAccountIDs.length > 0) {
                yield redisClient_1.default.sadd(miningAccountsKey, miningAccountIDs);
            }
            // For each mining account, create a hash with necessary details only if it doesn't exist
            for (const account of miningAccounts) {
                const miningAccountKey = `miningAccount:{123}:${account.id}`;
                // Start a transaction
                const multi = redisClient_1.default.multi();
                // Check if the miningAccountKey exists
                multi.exists(miningAccountKey);
                // Execute the transaction
                const replies = yield multi.exec();
                if (!replies || replies.length === 0) {
                    this.log.createLog("ERROR", `Redis transaction failed for mining account '${account.id}'.`, "");
                    continue;
                }
                const [error, result] = replies[0];
                if (error) {
                    this.log.createLog("ERROR", `Redis error while checking mining account '${account.id}'.`, error.message);
                    continue;
                }
                const exists = result === 1;
                //Constructs the worker name workerName.workerPrefix
                const workerName = `${account.workerName}.${Math.floor(Math.random() * 999) + 1}`;
                if (!exists) {
                    // If the mining account doesn't exist, set the hash fields
                    multi.hmset(miningAccountKey, {
                        worker_name: workerName, // Ensure `workerName` is part of `MiningAccountWithPoolAndProxy`
                        hashrate_limit: functions_1.HashrateConverter.petahashesToHashes(account.hashrateLimitPh),
                        sum_diffs_last_hour: "0",
                        multiplication_factor: account.multiplicationFactor.toString(),
                        average_hashrate_hour: "0",
                        average_hashrate_day: "0",
                        clientID: account.clientId.toString(),
                        coin: account.coin,
                    });
                    // Initialize the sorted set for shares if not already present
                    const sharesKey = `shares:{123}:${account.id}`;
                    multi.exists(sharesKey);
                    // Execute the transaction
                    const setReplies = yield multi.exec();
                    if (!setReplies || setReplies.length < 2) {
                        this.log.createLog("ERROR", `Redis transaction failed while setting mining account '${account.id}'.`, "");
                        continue;
                    }
                    const [setError, setResult] = setReplies[0];
                    const [sharesExistsError, sharesExistsResult] = setReplies[1];
                    if (setError) {
                        this.log.createLog("ERROR", `Redis error while setting mining account '${account.id}'.`, setError.message);
                        continue;
                    }
                    if (sharesExistsError) {
                        this.log.createLog("ERROR", `Redis error while checking shares for mining account '${account.id}'.`, sharesExistsError.message);
                        continue;
                    }
                    const sharesExists = sharesExistsResult === 1;
                    if (!sharesExists) {
                        // Initialize shares sorted set
                        const zaddReply = yield redisClient_1.default.zadd(sharesKey, 0, ""); // Initialize with a dummy value or leave empty
                        if (zaddReply !== 0) {
                            this.log.createLog("ERROR", `Redis error while initializing shares for mining account '${account.id}'.`, "");
                        }
                    }
                }
                else {
                }
            }
        });
        this.getRandomProxy = () => __awaiter(this, void 0, void 0, function* () {
            const proxies = yield prismaClient_1.prisma.proxy.findMany();
            const randomProxy = proxies[Math.floor(Math.random() * proxies.length)];
            return randomProxy;
        });
    }
}
exports.default = MagicService;