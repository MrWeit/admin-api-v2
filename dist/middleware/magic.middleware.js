"use strict";
// src/middleware/authenticate.ts
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
// Retrieve the private key from environment variables
const PRIVATE_KEY = process.env.MAGIC_PRIVATE_KEY;
// Define the expected header name (e.g., 'x-api-key' or use 'Authorization')
const API_KEY_HEADER = 'X-Private-Key'; // You can change this to 'authorization' if preferred
function authenticatedMagicKeyMiddleware(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        // Retrieve the API key from headers
        const apiKey = req.header(API_KEY_HEADER);
        if (!apiKey) {
            return next(new Error('API key is required'));
        }
        // Validate the API key
        if (apiKey !== PRIVATE_KEY) {
            return next(new Error('Invalid API key'));
        }
        // Proceed to the next middleware or route handler
        next();
    });
}
;
exports.default = authenticatedMagicKeyMiddleware;
