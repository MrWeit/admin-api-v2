"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const envalid_1 = require("envalid");
function validateEnv() {
    (0, envalid_1.cleanEnv)(process.env, {
        NODE_ENV: (0, envalid_1.str)({
            choices: ['development', 'production'],
        }),
        MONGO_URI: (0, envalid_1.str)(),
        PORT: (0, envalid_1.port)(),
        DEBUG: (0, envalid_1.str)(),
        LOGS_CRITICAL_DAYS: (0, envalid_1.port)(),
        LOGS_ERROR_DAYS: (0, envalid_1.port)(),
        LOGS_WARNING_DAYS: (0, envalid_1.port)(),
        LOGS_INFO_DAYS: (0, envalid_1.port)(),
        JWT_SECRET_KEY: (0, envalid_1.str)(),
        JWT_EXPIRATION: (0, envalid_1.str)(),
        MAGIC_PRIVATE_KEY: (0, envalid_1.str)(),
    });
}
exports.default = validateEnv;
