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
class DockerService {
    updateDockerById(id, input) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prismaClient_1.prisma.docker.update({
                where: { id },
                data: input,
            });
        });
    }
    createDocker(input) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prismaClient_1.prisma.docker.create({
                data: input,
            });
        });
    }
    deleteDockerById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prismaClient_1.prisma.docker.delete({
                where: { id },
            });
        });
    }
    getDockers() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prismaClient_1.prisma.docker.findMany();
        });
    }
}
exports.default = DockerService;