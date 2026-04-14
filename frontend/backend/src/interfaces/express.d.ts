import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: any; // Replace with proper IUser type later
    }
  }
}
