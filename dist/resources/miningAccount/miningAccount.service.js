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
Object.defineProperty(exports, "__esModule", { value: true });
const prismaClient_1 = require("../../utils/prismaClient");
class MiningAccountService {
    createMiningAccount(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prismaClient_1.prisma.miningAccount.create({
                data
            });
        });
    }
    getMiningAccountById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prismaClient_1.prisma.miningAccount.findUnique({
                where: {
                    id
                }
            });
        });
    }
    getMiningAccountsByIdWithPoolAndProxy(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prismaClient_1.prisma.miningAccount.findUnique({
                where: {
                    id
                },
                include: {
                    pool: true,
                    proxy: true
                }
            });
        });
    }
    getMiningAccountsByClientIdAndCoin(clientId, coin) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prismaClient_1.prisma.miningAccount.findMany({
                where: {
                    clientId,
                    coin
                },
                include: {
                    pool: true,
                    proxy: true
                }
            });
        });
    }
    getMiningAccounts() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prismaClient_1.prisma.miningAccount.findMany();
        });
    }
    updateMiningAccount(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prismaClient_1.prisma.miningAccount.update({
                where: {
                    id
                },
                data
            });
        });
    }
    deleteMiningAccount(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prismaClient_1.prisma.miningAccount.delete({
                where: {
                    id
                }
            });
        });
    }
    createMultipleMiningAccounts(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const createdAccounts = [];
            for (const accountData of data) {
                const createdAccount = yield prismaClient_1.prisma.miningAccount.create({
                    data: accountData,
                });
                createdAccounts.push(createdAccount);
            }
            return createdAccounts;
        });
    }
    getProxies() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prismaClient_1.prisma.proxy.findMany({
                include: {
                    miningAccounts: true,
                },
            });
        });
    }
}
exports.default = MiningAccountService;
