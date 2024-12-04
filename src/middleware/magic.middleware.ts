// src/middleware/authenticate.ts

import { Request, Response, NextFunction } from 'express';

// Retrieve the private key from environment variables
const PRIVATE_KEY = process.env.MAGIC_PRIVATE_KEY;

// Define the expected header name (e.g., 'x-api-key' or use 'Authorization')
const API_KEY_HEADER = 'X-Private-Key'; // You can change this to 'authorization' if preferred

// Custom interface to extend Express Request if needed
interface AuthenticatedRequestWithMagicKey extends Request {
  apiKey?: string;
}

async function authenticatedMagicKeyMiddleware(
  req: AuthenticatedRequestWithMagicKey,
  res: Response,
  next: NextFunction
): Promise<void> {
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
};

export default authenticatedMagicKeyMiddleware;
