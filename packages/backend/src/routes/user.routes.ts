import { Router } from 'express';
import { userController } from '../controllers/user.controller';
import { validateListUsersQuery, validateGetUserById, validateCreateUser } from '../middlewares/validation.middleware';
import { asyncHandler } from '../middlewares/error.middleware';

const router = Router();

/**
 * GET /api/users
 * List users with pagination, filtering, search, and sorting
 *
 * Query Parameters:
 * - page: Page number (default: 1)
 * - limit: Items per page (default: 10, max: 100)
 * - search: Search by fullName or email (case-insensitive, partial match)
 * - gender: Filter by gender (male, female)
 * - includeDeleted: Include soft-deleted records (default: false)
 * - sortBy: Sort field (fullName, email, createdAt, updatedAt - default: createdAt)
 * - sortOrder: Sort order (asc, desc - default: desc)
 */
router.get(
  '/',
  validateListUsersQuery,
  asyncHandler((req, res) => userController.listUsers(req, res))
);

/**
 * POST /api/users
 * Create a new user
 *
 * Request Body:
 * - fullName: string (required, 1-255 chars)
 * - email: string (required, valid email, unique)
 * - contactNumber: string (optional, max 50 chars)
 * - gender: string (optional, male/female)
 */
router.post(
  '/',
  validateCreateUser,
  asyncHandler((req, res) => userController.createUser(req, res))
);

/**
 * GET /api/users/:id
 * Get a single user by ID
 *
 * Path Parameters:
 * - id: User ID (positive integer)
 *
 * Query Parameters:
 * - includeDeleted: Allow fetching soft-deleted records (default: false)
 */
router.get(
  '/:id',
  validateGetUserById,
  asyncHandler((req, res) => userController.getUserById(req, res))
);

export default router;
