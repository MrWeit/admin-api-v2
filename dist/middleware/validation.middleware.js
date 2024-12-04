"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = void 0;
const zod_1 = require("zod");
const helper_1 = require("../utils/helper"); // Adjust the import path as needed
const validateRequest = (schema) => {
    return (req, res, next) => {
        try {
            // Validate the request body against the schema
            schema.parse(req.body);
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                // Extract error messages
                const messages = error.errors.map((err) => err.path.join('.') + ': ' + err.message);
                // Use the showError function to send the response
                return (0, helper_1.showError)(req, res, messages, {
                    error_description: 'Validation Error',
                    status_code: 400,
                });
            }
            else {
                // For other types of errors, pass to the default error handler
                next(error);
            }
        }
    };
};
exports.validateRequest = validateRequest;
