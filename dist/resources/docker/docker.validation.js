"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDockerSchema = void 0;
const zod_1 = require("zod");
exports.createDockerSchema = (0, zod_1.object)({
    name: (0, zod_1.string)().min(3).max(255),
    vpsId: (0, zod_1.string)().min(3).max(255),
    port: (0, zod_1.number)().min(1).max(65535),
});
