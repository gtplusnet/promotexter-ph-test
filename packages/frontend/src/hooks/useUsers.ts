import { useQuery } from '@tanstack/react-query'
import { userService } from '../services/user.service'
import type { ListUsersFilters } from '../types/user.types'
import { queryKeys } from '../lib/query-keys'

export function useUsers(filters: ListUsersFilters) {
  return useQuery({
    queryKey: queryKeys.users.list(filters),
    queryFn: () => userService.listUsers(filters),
    placeholderData: (previousData) => previousData,
  })
}

export function useUser(id: number, includeDeleted = false) {
  return useQuery({
    queryKey: queryKeys.users.detail(id),
    queryFn: () => userService.getUser(id, includeDeleted),
    enabled: !!id,
  })
}
