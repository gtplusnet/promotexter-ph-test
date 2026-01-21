import { Request, Response, NextFunction } from 'express';
import {
  ListUsersQueryParams,
  ListUsersFilters,
  Gender,
  SortByField,
  SortOrder,
  PAGINATION_DEFAULTS,
  VALID_SORT_FIELDS,
  VALID_SORT_ORDERS,
  VALID_GENDERS,
} from '../types/user';
import { ApiResponse, ValidationErrorDetail } from '../types/common/api.types';

// Extend Express Request to include validated filters
declare global {
  namespace Express {
    interface Request {
      validatedFilters?: ListUsersFilters;
    }
  }
}

/**
 * Validates and transforms List Users query parameters
 * Follows SRP - only handles validation logic
 */
export function validateListUsersQuery(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const query = req.query as ListUsersQueryParams;
  const errors: ValidationErrorDetail[] = [];

  // Parse and validate page
  const page = parsePositiveInteger(query.page, PAGINATION_DEFAULTS.PAGE);
  if (query.page && page < 1) {
    errors.push({ field: 'page', message: 'Page must be a positive integer' });
  }

  // Parse and validate limit
  let limit = parsePositiveInteger(query.limit, PAGINATION_DEFAULTS.LIMIT);
  if (query.limit && limit < 1) {
    errors.push({ field: 'limit', message: 'Limit must be a positive integer' });
  }
  if (limit > PAGINATION_DEFAULTS.MAX_LIMIT) {
    limit = PAGINATION_DEFAULTS.MAX_LIMIT;
  }

  // Validate gender
  const gender = query.gender?.toLowerCase() as Gender | undefined;
  if (query.gender && !VALID_GENDERS.includes(gender as typeof VALID_GENDERS[number])) {
    errors.push({
      field: 'gender',
      message: `Gender must be one of: ${VALID_GENDERS.join(', ')}`,
    });
  }

  // Validate sortBy
  const sortBy = (query.sortBy || SortByField.CREATED_AT) as SortByField;
  if (query.sortBy && !VALID_SORT_FIELDS.includes(query.sortBy as typeof VALID_SORT_FIELDS[number])) {
    errors.push({
      field: 'sortBy',
      message: `sortBy must be one of: ${VALID_SORT_FIELDS.join(', ')}`,
    });
  }

  // Validate sortOrder
  const sortOrder = (query.sortOrder?.toLowerCase() || SortOrder.DESC) as SortOrder;
  if (query.sortOrder && !VALID_SORT_ORDERS.includes(query.sortOrder.toLowerCase() as typeof VALID_SORT_ORDERS[number])) {
    errors.push({
      field: 'sortOrder',
      message: `sortOrder must be one of: ${VALID_SORT_ORDERS.join(', ')}`,
    });
  }

  // Parse includeDeleted
  const includeDeleted = parseBoolean(query.includeDeleted, false);

  // If validation errors, return 400
  if (errors.length > 0) {
    const response: ApiResponse<null> = {
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        details: errors,
      },
    };
    res.status(400).json(response);
    return;
  }

  // Attach validated filters to request
  req.validatedFilters = {
    page,
    limit,
    search: query.search?.trim() || undefined,
    gender: gender as Gender | undefined,
    includeDeleted,
    sortBy,
    sortOrder,
  };

  next();
}

/**
 * Parse string to positive integer with default
 */
function parsePositiveInteger(value: string | undefined, defaultValue: number): number {
  if (!value) return defaultValue;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
}

/**
 * Parse string to boolean with default
 */
function parseBoolean(value: string | undefined, defaultValue: boolean): boolean {
  if (!value) return defaultValue;
  return value.toLowerCase() === 'true';
}
