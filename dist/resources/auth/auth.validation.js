"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginAdminUserSchema = void 0;
const zod_1 = require("zod");
//Verify OTP
exports.loginAdminUserSchema = (0, zod_1.object)({
    username: (0, zod_1.string)({
        required_error: "username is required",
    }),
    password: (0, zod_1.string)({
        required_error: "password is required",
    }),
});
