import { User } from '@prisma/client';
import { Gender, SortByField, SortOrder } from './user.enums';
import { PaginationInfo } from '../common/api.types';

// Request types
export interface ListUsersQueryParams {
  page?: string;
  limit?: string;
  search?: string;
  gender?: string;
  includeDeleted?: string;
  sortBy?: string;
  sortOrder?: string;
}

export interface ListUsersFilters {
  page: number;
  limit: number;
  search?: string;
  gender?: Gender;
  includeDeleted: boolean;
  sortBy: SortByField;
  sortOrder: SortOrder;
}

// Response types
export interface ListUsersResponse {
  users: User[];
  pagination: PaginationInfo;
}

// Repository types
export interface FindManyUsersOptions {
  skip: number;
  take: number;
  where: UserWhereInput;
  orderBy: UserOrderByInput;
}

export interface UserWhereInput {
  isDeleted?: boolean;
  gender?: string;
  OR?: Array<{
    fullName?: { contains: string };
    email?: { contains: string };
  }>;
}

export interface UserOrderByInput {
  [key: string]: 'asc' | 'desc';
}

// Get User by ID types
export interface GetUserByIdParams {
  id: number;
  includeDeleted: boolean;
}

// Create User types
export interface CreateUserBody {
  fullName: string;
  email: string;
  contactNumber?: string | null;
  gender?: string | null;
}

// Update User types
export interface UpdateUserParams {
  id: number;
}

export interface UpdateUserBody {
  fullName?: string;
  email?: string;
  contactNumber?: string | null;
  gender?: string | null;
}
