"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateMiningAccountSchema = exports.createMiningAccountSchema = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const walletSchema = (0, zod_1.object)({
    address: (0, zod_1.string)().min(1).max(255),
    coin: (0, zod_1.nativeEnum)(client_1.Coins),
});
exports.createMiningAccountSchema = (0, zod_1.object)({
    note: (0, zod_1.string)().min(1).max(255),
    code: (0, zod_1.string)().min(1).max(255),
    coin: (0, zod_1.nativeEnum)(client_1.Coins),
    hashrateLimitPh: (0, zod_1.number)().min(0),
    hashratePerMachineTh: (0, zod_1.number)().min(0),
    multiplicationFactor: (0, zod_1.number)().min(0),
    clientId: (0, zod_1.string)().min(1).max(255),
    workerName: (0, zod_1.string)().min(1).max(255),
    poolId: (0, zod_1.string)().min(1).max(255),
    proxyId: (0, zod_1.string)().min(1).max(255),
    wallets: walletSchema.array().optional(),
    inDiff: (0, zod_1.number)().min(0),
});
exports.updateMiningAccountSchema = (0, zod_1.object)({
    note: (0, zod_1.string)().min(1).max(255),
    code: (0, zod_1.string)().min(1).max(255),
    coin: (0, zod_1.nativeEnum)(client_1.Coins),
    hashrateLimitPh: (0, zod_1.number)().min(0),
    hashratePerMachineTh: (0, zod_1.number)().min(0),
    multiplicationFactor: (0, zod_1.number)().min(0),
    clientId: (0, zod_1.string)().min(1).max(255),
    workerName: (0, zod_1.string)().min(1).max(255),
    poolId: (0, zod_1.string)().min(1).max(255),
    proxyId: (0, zod_1.string)().min(1).max(255),
    wallets: walletSchema.array().optional(),
    inDiff: (0, zod_1.number)().min(0),
});
