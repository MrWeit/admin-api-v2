"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postAllProxiesSchema = exports.proxySchema = exports.createUpdateSettingsSchema = void 0;
// src/validations/settings.validation.ts
const zod_1 = require("zod");
const poolSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Pool name is required"),
    port: zod_1.z.number().int().nonnegative("Port must be a non-negative integer"),
    domain: zod_1.z.string().min(1, "Domain is required"),
    id: zod_1.z.string().min(1, "Pool id is required").optional(),
});
const vpsSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "VPS name is required"),
    ip: zod_1.z
        .string()
        .min(1, "IP is required")
        .regex(/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/, "Invalid IP address"),
    id: zod_1.z.string().min(1, "VPS id is required").optional(),
});
exports.createUpdateSettingsSchema = zod_1.z.object({
    pools: zod_1.z.array(poolSchema).nonempty("At least one pool is required"),
    VPSs: zod_1.z.array(vpsSchema).nonempty("At least one VPS is required"),
    defaultMaxPhPerMiningAccountBtc: zod_1.z
        .number()
        .positive("Must be a positive number"),
    hashrateMultiplicationFactorBtc: zod_1.z
        .number()
        .min(0, "Must be greater than or equal to 0"),
    hashrateMultiplicationFactorLtc: zod_1.z
        .number()
        .min(0, "Must be greater than or equal to 0"),
    defaultMaxPhPerMiningAccountLtc: zod_1.z
        .number()
        .positive("Must be a positive number"),
    defaultInitialDifficultyBtc: zod_1.z
        .number()
        .positive("Must be a positive number"),
    defaultInitialDifficultyLtc: zod_1.z
        .number()
        .positive("Must be a positive number"),
    dockerPortRangeStart: zod_1.z
        .number()
        .int()
        .nonnegative("Port must be a non-negative integer"),
    dockerPortRangeEnd: zod_1.z
        .number()
        .int()
        .nonnegative("Port must be a non-negative integer"),
    dockerCliTcpPort: zod_1.z
        .number()
        .int()
        .nonnegative("Port must be a non-negative integer"),
});
exports.proxySchema = (0, zod_1.object)({
    entryPoint: (0, zod_1.string)().min(1).max(255),
    ip: (0, zod_1.string)().min(1).max(255),
    port: (0, zod_1.number)().min(0),
    countryCode: (0, zod_1.string)().min(1).max(255),
});
exports.postAllProxiesSchema = (0, zod_1.array)(exports.proxySchema).nonempty();
