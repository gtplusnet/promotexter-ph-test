import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../types/common/api.types';

/**
 * Custom error class for API errors
 * Follows Open/Closed Principle - can extend for specific error types
 */
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
    public details?: Array<{ field: string; message: string }>
  ) {
    super(message);
    this.name = 'ApiError';
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message: string, details?: Array<{ field: string; message: string }>) {
    return new ApiError(400, 'VALIDATION_ERROR', message, details);
  }

  static notFound(message: string) {
    return new ApiError(404, 'NOT_FOUND', message);
  }

  static conflict(message: string) {
    return new ApiError(409, 'CONFLICT', message);
  }

  static internal(message: string = 'An unexpected error occurred') {
    return new ApiError(500, 'INTERNAL_ERROR', message);
  }
}

/**
 * Global error handling middleware
 * Follows Single Responsibility - only handles error responses
 */
export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  console.error(`[ERROR] ${req.method} ${req.path}:`, err);

  if (err instanceof ApiError) {
    const response: ApiResponse<null> = {
      success: false,
      error: {
        code: err.code,
        message: err.message,
        details: err.details,
      },
    };
    res.status(err.statusCode).json(response);
    return;
  }

  // Handle Prisma errors
  if (err.name === 'PrismaClientKnownRequestError') {
    const response: ApiResponse<null> = {
      success: false,
      error: {
        code: 'DATABASE_ERROR',
        message: 'A database error occurred',
      },
    };
    res.status(500).json(response);
    return;
  }

  // Default error response
  const response: ApiResponse<null> = {
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred',
    },
  };
  res.status(500).json(response);
}

/**
 * Async handler wrapper to catch errors in async route handlers
 * Prevents need for try-catch in every controller method
 */
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>
) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
