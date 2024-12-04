"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const helper_1 = require("../utils/helper");
const logger_1 = __importDefault(require("../utils/logger"));
function ErrorMiddleware(error, req, res, next) {
    var _a, _b;
    const status_code = (_a = error.statusCode) !== null && _a !== void 0 ? _a : 500;
    const error_message = error.statusCode ? error.message : 'erros.internal_server_error';
    if (status_code === 500) {
        logger_1.default.error(error.message);
    }
    return (0, helper_1.showError)(req, res, [error_message], { status_code, translation: (_b = error.options) === null || _b === void 0 ? void 0 : _b.translation });
}
exports.default = ErrorMiddleware;
