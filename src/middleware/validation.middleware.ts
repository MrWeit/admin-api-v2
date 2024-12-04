import { ZodSchema, ZodError } from 'zod';
import { Request, Response, NextFunction } from 'express';
import { showError } from '@utils/helper'; // Adjust the import path as needed

export const validateRequest = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate the request body against the schema
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        // Extract error messages
        const messages = error.errors.map((err) => err.path.join('.') + ': ' + err.message);

        // Use the showError function to send the response
        return showError(req, res, messages, {
          error_description: 'Validation Error',
          status_code: 400,
        });
      } else {
        // For other types of errors, pass to the default error handler
        next(error);
      }
    }
  };
};
