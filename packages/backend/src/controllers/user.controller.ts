import { Request, Response } from 'express';
import { userService, UserService } from '../services/user.service';
import { ApiResponse, PaginationInfo } from '../types/common/api.types';
import { UserDto, toUserDto, toUserDtoList } from '../types/user.dto';

/**
 * Response type for list users endpoint
 */
interface ListUsersResponseDto {
  users: UserDto[];
  pagination: PaginationInfo;
}

/**
 * UserController - Handles HTTP requests for User endpoints
 * Follows SRP - only handles request/response transformation
 */
export class UserController {
  constructor(private readonly service: UserService) {}

  /**
   * POST /api/users - Create a new user
   */
  async createUser(req: Request, res: Response): Promise<void> {
    const body = req.validatedCreateUserBody!;
    const user = await this.service.createUser(body);

    const response: ApiResponse<UserDto> = {
      success: true,
      data: toUserDto(user),
    };

    res.status(201).json(response);
  }

  /**
   * PUT /api/users/:id - Update an existing user
   */
  async updateUser(req: Request, res: Response): Promise<void> {
    const { id } = req.validatedUpdateUserParams!;
    const body = req.validatedUpdateUserBody!;
    const user = await this.service.updateUser(id, body);

    const response: ApiResponse<UserDto> = {
      success: true,
      data: toUserDto(user),
    };

    res.status(200).json(response);
  }

  /**
   * DELETE /api/users/:id - Soft delete a user
   */
  async softDeleteUser(req: Request, res: Response): Promise<void> {
    const { id } = req.validatedUserIdParam!;
    const user = await this.service.softDeleteUser(id);

    const response: ApiResponse<UserDto> = {
      success: true,
      data: toUserDto(user),
      message: 'User soft deleted successfully',
    };

    res.status(200).json(response);
  }

  /**
   * POST /api/users/:id/restore - Restore a soft-deleted user
   */
  async restoreUser(req: Request, res: Response): Promise<void> {
    const { id } = req.validatedUserIdParam!;
    const user = await this.service.restoreUser(id);

    const response: ApiResponse<UserDto> = {
      success: true,
      data: toUserDto(user),
      message: 'User restored successfully',
    };

    res.status(200).json(response);
  }

  /**
   * GET /api/users/:id - Get a single user by ID
   */
  async getUserById(req: Request, res: Response): Promise<void> {
    const { id, includeDeleted } = req.validatedGetUserParams!;
    const user = await this.service.getUserById(id, includeDeleted);

    const response: ApiResponse<UserDto> = {
      success: true,
      data: toUserDto(user),
    };

    res.status(200).json(response);
  }

  /**
   * GET /api/users - List users with pagination, filtering, and search
   * Errors are handled by global error middleware
   */
  async listUsers(req: Request, res: Response): Promise<void> {
    const filters = req.validatedFilters!;
    const result = await this.service.listUsers(filters);

    // Map entities to DTOs for consistent API response
    const response: ApiResponse<ListUsersResponseDto> = {
      success: true,
      data: {
        users: toUserDtoList(result.users),
        pagination: result.pagination,
      },
    };

    res.status(200).json(response);
  }
}

// Export singleton instance with service injection
export const userController = new UserController(userService);
