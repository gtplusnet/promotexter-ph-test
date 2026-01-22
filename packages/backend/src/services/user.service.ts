import { User } from '@prisma/client';
import { userRepository, UserRepository } from '../repositories/user.repository';
import {
  ListUsersFilters,
  ListUsersResponse,
  UserWhereInput,
  UserOrderByInput,
  FindManyUsersOptions,
  CreateUserBody,
  UpdateUserBody,
} from '../types/user';
import { PaginationInfo } from '../types/common/api.types';
import { ApiError } from '../middlewares/error.middleware';

export class UserService {
  constructor(private readonly repository: UserRepository) {}

  /**
   * Create a new user
   */
  async createUser(data: CreateUserBody): Promise<User> {
    // Check for duplicate email
    const existing = await this.repository.findByEmail(data.email);
    if (existing) {
      throw new ApiError(409, 'EMAIL_EXISTS', 'A user with this email already exists');
    }

    return this.repository.create(data);
  }

  /**
   * Update an existing user
   */
  async updateUser(id: number, data: UpdateUserBody): Promise<User> {
    // Check if user exists and is not deleted
    const user = await this.repository.findById(id);
    if (!user || user.isDeleted) {
      throw new ApiError(404, 'USER_NOT_FOUND', `User with ID ${id} not found`);
    }

    // If email is being updated, check for duplicates
    if (data.email && data.email !== user.email) {
      const existing = await this.repository.findByEmail(data.email);
      if (existing) {
        throw new ApiError(409, 'EMAIL_EXISTS', 'A user with this email already exists');
      }
    }

    return this.repository.update(id, data);
  }

  /**
   * Soft delete a user
   */
  async softDeleteUser(id: number): Promise<User> {
    const user = await this.repository.findById(id);

    if (!user) {
      throw new ApiError(404, 'USER_NOT_FOUND', `User with ID ${id} not found`);
    }

    if (user.isDeleted) {
      throw new ApiError(400, 'USER_ALREADY_DELETED', 'User is already deleted');
    }

    return this.repository.softDelete(id);
  }

  /**
   * Restore a soft-deleted user
   */
  async restoreUser(id: number): Promise<User> {
    const user = await this.repository.findById(id);

    if (!user) {
      throw new ApiError(404, 'USER_NOT_FOUND', `User with ID ${id} not found`);
    }

    if (!user.isDeleted) {
      throw new ApiError(400, 'USER_NOT_DELETED', 'User is not deleted');
    }

    return this.repository.restore(id);
  }

  /**
   * Hard delete a user (permanently remove from database)
   */
  async hardDeleteUser(id: number): Promise<void> {
    const user = await this.repository.findById(id);

    if (!user) {
      throw new ApiError(404, 'USER_NOT_FOUND', `User with ID ${id} not found`);
    }

    await this.repository.hardDelete(id);
  }

  /**
   * Get a single user by ID
   */
  async getUserById(id: number, includeDeleted: boolean = false): Promise<User> {
    const user = await this.repository.findById(id);

    if (!user || (user.isDeleted && !includeDeleted)) {
      throw new ApiError(404, 'USER_NOT_FOUND', `User with ID ${id} not found`);
    }

    return user;
  }

  /**
   * List users with filtering, search, pagination, and sorting
   */
  async listUsers(filters: ListUsersFilters): Promise<ListUsersResponse> {
    // Build where clause
    const where = this.buildWhereClause(filters);

    // Build order by clause
    const orderBy = this.buildOrderByClause(filters.sortBy, filters.sortOrder);

    // Calculate pagination offset
    const skip = (filters.page - 1) * filters.limit;

    // Build options
    const options: FindManyUsersOptions = {
      skip,
      take: filters.limit,
      where,
      orderBy,
    };

    // Fetch users and count in single transaction
    const { users, total } = await this.repository.findManyWithCount(options);

    // Build pagination info
    const pagination = this.buildPaginationInfo(filters.page, filters.limit, total);

    return { users, pagination };
  }

  /**
   * Build Prisma where clause from filters
   */
  private buildWhereClause(filters: ListUsersFilters): UserWhereInput {
    const where: UserWhereInput = {};

    // Soft delete filter (default: exclude deleted)
    if (!filters.includeDeleted) {
      where.isDeleted = false;
    }

    // Gender filter
    if (filters.gender) {
      where.gender = filters.gender;
    }

    // Search filter (partial match on fullName and email)
    if (filters.search) {
      where.OR = [
        { fullName: { contains: filters.search } },
        { email: { contains: filters.search } },
      ];
    }

    return where;
  }

  /**
   * Build Prisma orderBy clause
   */
  private buildOrderByClause(
    sortBy: string,
    sortOrder: 'asc' | 'desc'
  ): UserOrderByInput {
    return { [sortBy]: sortOrder };
  }

  /**
   * Build pagination metadata
   */
  private buildPaginationInfo(
    page: number,
    limit: number,
    total: number
  ): PaginationInfo {
    return {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }
}

// Export singleton instance with repository injection
export const userService = new UserService(userRepository);
