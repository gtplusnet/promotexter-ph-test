import { apiClient } from '../lib/api-client'
import type { PaginatedResponse } from '../types/api.types'
import type { User, ListUsersFilters } from '../types/user.types'

export interface CreateUserData {
  fullName: string
  email: string
  contactNumber?: string
  gender?: 'male' | 'female'
}

export interface UpdateUserData {
  fullName?: string
  email?: string
  contactNumber?: string
  gender?: 'male' | 'female'
}

export const userService = {
  listUsers: async (filters: ListUsersFilters): Promise<PaginatedResponse<User>> => {
    const params: Record<string, string | number | boolean> = {
      page: filters.page,
      limit: filters.limit,
      sortBy: filters.sortBy,
      sortOrder: filters.sortOrder,
      includeDeleted: filters.includeDeleted,
    }

    if (filters.search) {
      params.search = filters.search
    }

    if (filters.gender && filters.gender !== 'all') {
      params.gender = filters.gender
    }

    return apiClient.get<PaginatedResponse<User>>('/api/users', { params })
  },

  getUser: async (id: number, includeDeleted = false): Promise<User> => {
    return apiClient.get<User>(`/api/users/${id}`, {
      params: { includeDeleted },
    })
  },

  createUser: async (data: CreateUserData): Promise<User> => {
    return apiClient.post<User>('/api/users', data)
  },

  updateUser: async (id: number, data: UpdateUserData): Promise<User> => {
    return apiClient.put<User>(`/api/users/${id}`, data)
  },

  deleteUser: async (id: number): Promise<User> => {
    return apiClient.delete<User>(`/api/users/${id}`)
  },

  restoreUser: async (id: number): Promise<User> => {
    return apiClient.post<User>(`/api/users/${id}/restore`)
  },

  permanentDeleteUser: async (id: number): Promise<void> => {
    return apiClient.delete<void>(`/api/users/${id}/permanent`)
  },
}
