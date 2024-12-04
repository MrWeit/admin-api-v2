"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createClientSchema = void 0;
const zod_1 = require("zod");
exports.createClientSchema = (0, zod_1.object)({
    name: (0, zod_1.string)().min(3).max(255),
    username: (0, zod_1.string)().min(3).max(255),
    password: (0, zod_1.string)().min(6).max(255),
    publicIps: (0, zod_1.string)().min(7).max(15).array(),
    workerName: (0, zod_1.string)().min(3).max(255),
    workerPassword: (0, zod_1.string)().min(3).max(255),
});
