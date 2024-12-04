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
class ClientService {
    createClient(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prismaClient_1.prisma.client.create({
                data
            });
        });
    }
    getClientById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prismaClient_1.prisma.client.findUnique({
                where: {
                    id
                }
            });
        });
    }
    getClientByWorkerNameIpAndPassword(workerName, password, publicIp) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prismaClient_1.prisma.client.findFirst({
                where: {
                    workerName,
                    password
                }
            });
        });
    }
    getAllClients() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prismaClient_1.prisma.client.findMany();
        });
    }
    updateClient(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prismaClient_1.prisma.client.update({
                where: {
                    id
                },
                data
            });
        });
    }
    deleteClient(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prismaClient_1.prisma.client.delete({
                where: {
                    id
                }
            });
        });
    }
}
exports.default = ClientService;
