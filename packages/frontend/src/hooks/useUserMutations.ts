import { useMutation, useQueryClient } from '@tanstack/react-query'
import { userService } from '../services/user.service'
import type { CreateUserData, UpdateUserData } from '../services/user.service'
import { queryKeys } from '../lib/query-keys'
import type { PaginatedResponse } from '../types/api.types'
import type { User } from '../types/user.types'

export function useCreateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateUserData) => userService.createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.lists() })
    },
  })
}

export function useUpdateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateUserData }) =>
      userService.updateUser(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.users.lists() })

      const previousData = queryClient.getQueriesData({
        queryKey: queryKeys.users.lists(),
      })

      queryClient.setQueriesData<PaginatedResponse<User>>(
        { queryKey: queryKeys.users.lists() },
        (old) => {
          if (!old) return old
          return {
            ...old,
            users: old.users.map((user) =>
              user.id === id ? { ...user, ...data } : user
            ),
          }
        }
      )

      return { previousData }
    },
    onError: (_err, _variables, context) => {
      if (context?.previousData) {
        context.previousData.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data)
        })
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.lists() })
    },
  })
}

export function useDeleteUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => userService.deleteUser(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.users.lists() })

      const previousData = queryClient.getQueriesData({
        queryKey: queryKeys.users.lists(),
      })

      queryClient.setQueriesData<PaginatedResponse<User>>(
        { queryKey: queryKeys.users.lists() },
        (old) => {
          if (!old) return old
          return {
            ...old,
            users: old.users.map((user) =>
              user.id === id ? { ...user, isDeleted: true } : user
            ),
          }
        }
      )

      return { previousData }
    },
    onError: (_err, _id, context) => {
      if (context?.previousData) {
        context.previousData.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data)
        })
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.lists() })
    },
  })
}

export function useRestoreUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => userService.restoreUser(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.users.lists() })

      const previousData = queryClient.getQueriesData({
        queryKey: queryKeys.users.lists(),
      })

      queryClient.setQueriesData<PaginatedResponse<User>>(
        { queryKey: queryKeys.users.lists() },
        (old) => {
          if (!old) return old
          return {
            ...old,
            users: old.users.map((user) =>
              user.id === id ? { ...user, isDeleted: false } : user
            ),
          }
        }
      )

      return { previousData }
    },
    onError: (_err, _id, context) => {
      if (context?.previousData) {
        context.previousData.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data)
        })
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.lists() })
    },
  })
}

export function usePermanentDeleteUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => userService.permanentDeleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.lists() })
    },
  })
}
