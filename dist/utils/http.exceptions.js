"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Forbidden = exports.NotAcceptable = exports.UnauthorizedError = exports.NotFoundError = exports.BadRequestError = void 0;
class ApiError extends Error {
    constructor(message, statusCode, options) {
        super(message);
        this.statusCode = statusCode;
        this.options = options;
    }
}
exports.default = ApiError;
class BadRequestError extends ApiError {
    constructor(message) {
        super(message, 400);
    }
}
exports.BadRequestError = BadRequestError;
class NotFoundError extends ApiError {
    constructor(message) {
        super(message, 404);
    }
}
exports.NotFoundError = NotFoundError;
class UnauthorizedError extends ApiError {
    constructor(message) {
        super(message, 401);
    }
}
exports.UnauthorizedError = UnauthorizedError;
class NotAcceptable extends ApiError {
    constructor(message) {
        super(message, 406);
    }
}
exports.NotAcceptable = NotAcceptable;
class Forbidden extends ApiError {
    constructor(message) {
        super(message, 403);
    }
}
exports.Forbidden = Forbidden;
