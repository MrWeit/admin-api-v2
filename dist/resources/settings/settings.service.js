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
Object.defineProperty(exports, "__esModule", { value: true });
const prismaClient_1 = require("../../utils/prismaClient");
const lodash_1 = require("lodash");
const functions_1 = require("../../utils/functions");
class SettingsService {
    getVPSs() {
        return __awaiter(this, void 0, void 0, function* () {
            return prismaClient_1.prisma.vPS.findMany();
        });
    }
    getPools() {
        return __awaiter(this, void 0, void 0, function* () {
            return prismaClient_1.prisma.pool.findMany();
        });
    }
    createVPS(input) {
        return __awaiter(this, void 0, void 0, function* () {
            return prismaClient_1.prisma.vPS.create({ data: input });
        });
    }
    createPool(input) {
        return __awaiter(this, void 0, void 0, function* () {
            return prismaClient_1.prisma.pool.create({ data: input });
        });
    }
    updateVPS(where, input) {
        return __awaiter(this, void 0, void 0, function* () {
            return prismaClient_1.prisma.vPS.update({ where, data: input });
        });
    }
    updatePool(where, input) {
        return __awaiter(this, void 0, void 0, function* () {
            return prismaClient_1.prisma.pool.update({ where, data: input });
        });
    }
    getSettingsWithStatus() {
        return __awaiter(this, void 0, void 0, function* () {
            const settings = yield prismaClient_1.prisma.settings.findFirst({ include: { pools: true, VPSs: true } });
            if (!settings) {
                return [];
            }
            const newVPSs = settings.VPSs.map((vps) => __awaiter(this, void 0, void 0, function* () {
                return Object.assign(Object.assign({}, vps), { status: (yield (0, functions_1.pingServer)(vps.ip)) ? "online" : "offline" });
            }));
            return Object.assign(Object.assign({}, settings), { VPSs: yield Promise.all(newVPSs) });
        });
    }
    getSettings() {
        return __awaiter(this, void 0, void 0, function* () {
            return prismaClient_1.prisma.settings.findFirst({ include: { pools: true, VPSs: true } });
        });
    }
    createSettings(input) {
        return __awaiter(this, void 0, void 0, function* () {
            return prismaClient_1.prisma.settings.create({ data: input, });
        });
    }
    updateSettings(where, input) {
        return __awaiter(this, void 0, void 0, function* () {
            return prismaClient_1.prisma.settings.update({ where, data: input });
        });
    }
    createUpdateSettings(input) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                //Will check if settings already exists
                //If exists, will update settings
                //If not, will create settings
                const settings = yield this.getSettings();
                if (!settings) {
                    const { pools, VPSs } = input, settingsData = __rest(input, ["pools", "VPSs"]);
                    yield this.createSettings(Object.assign(Object.assign({}, settingsData), { pools: {
                            create: input.pools,
                        }, VPSs: {
                            create: input.VPSs,
                        } }));
                }
                else {
                    const { pools, VPSs } = input, settingsData = __rest(input, ["pools", "VPSs"]);
                    yield this.updateSettings({ id: settings.id }, Object.assign(Object.assign({}, settingsData), { pools: {
                            deleteMany: settings.pools.filter((pool) => !pools.find((newPool) => newPool.id === pool.id)).map((pool) => ({ id: pool.id })),
                            create: pools.filter((pool) => !pool.id),
                            update: pools.map((pool) => {
                                if (pool.id) {
                                    return {
                                        where: { id: pool.id },
                                        data: (0, lodash_1.omit)(pool, ['id']),
                                    };
                                }
                                return undefined;
                            }).filter((pool) => pool !== undefined),
                        }, VPSs: {
                            deleteMany: settings.VPSs.filter((vps) => !VPSs.find((newVPS) => newVPS.id === vps.id)).map((vps) => ({ id: vps.id })),
                            create: VPSs.filter((vps) => !vps.id),
                            update: VPSs.map((vps) => {
                                if (vps.id) {
                                    return {
                                        where: { id: vps.id },
                                        data: (0, lodash_1.omit)(vps, ['id']),
                                    };
                                }
                                return undefined;
                            }).filter((vps) => vps !== undefined),
                        } }));
                }
            }
            catch (error) {
                throw new Error(error);
            }
        });
    }
    postJsonProxiesList(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return prismaClient_1.prisma.proxy.createMany({
                data
            });
        });
    }
    getProxies() {
        return __awaiter(this, void 0, void 0, function* () {
            return prismaClient_1.prisma.proxy.findMany({
                include: {
                    miningAccounts: true
                }
            });
        });
    }
}
exports.default = SettingsService;
