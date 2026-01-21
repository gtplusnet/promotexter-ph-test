import { Request, Response } from 'express';
import { userService, UserService } from '../services/user.service';
import { ApiResponse, PaginationInfo } from '../types/common/api.types';
import { UserDto, toUserDtoList } from '../types/user.dto';

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
