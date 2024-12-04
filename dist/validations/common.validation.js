"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.idSchema = void 0;
const zod_1 = require("zod");
exports.idSchema = (0, zod_1.object)({
    id: (0, zod_1.string)().min(3).max(255),
});
