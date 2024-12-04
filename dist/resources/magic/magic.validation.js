"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateMinerSchema = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
exports.authenticateMinerSchema = (0, zod_1.object)({
    worker_name: (0, zod_1.string)().min(1).max(50),
    worker_password: (0, zod_1.string)().min(1).max(50),
    public_ip: (0, zod_1.string)().min(1).max(50).optional(),
    coin: (0, zod_1.nativeEnum)(client_1.Coins),
    instance_id: (0, zod_1.string)().min(1).max(50),
});
