import type { ApiResponse } from '../types/api.types'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export class ApiClientError extends Error {
  code: string
  details?: any

  constructor(message: string, code: string, details?: any) {
    super(message)
    this.name = 'ApiClientError'
    this.code = code
    this.details = details
  }
}

interface RequestConfig extends RequestInit {
  params?: Record<string, string | number | boolean>
}

async function request<T>(
  endpoint: string,
  config: RequestConfig = {}
): Promise<T> {
  const { params, ...init } = config

  let url = `${API_BASE_URL}${endpoint}`

  if (params) {
    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, String(value))
      }
    })
    const queryString = searchParams.toString()
    if (queryString) {
      url += `?${queryString}`
    }
  }

  const headers = {
    'Content-Type': 'application/json',
    ...init.headers,
  }

  try {
    const response = await fetch(url, {
      ...init,
      headers,
    })

    if (!response.ok) {
      const errorData: ApiResponse<any> = await response.json().catch(() => ({
        success: false,
        error: {
          code: 'NETWORK_ERROR',
          message: `HTTP ${response.status}: ${response.statusText}`,
        },
      }))

      const error = errorData.error || {
        code: 'UNKNOWN_ERROR',
        message: 'An unknown error occurred',
      }

      throw new ApiClientError(error.message, error.code, error.details)
    }

    const data: ApiResponse<T> = await response.json()

    if (!data.success) {
      const error = data.error || {
        code: 'API_ERROR',
        message: 'API request failed',
      }
      throw new ApiClientError(error.message, error.code, error.details)
    }

    return data.data
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw error
    }

    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new ApiClientError(
        'Network error. Please check your connection.',
        'NETWORK_ERROR'
      )
    }

    throw new ApiClientError(
      error instanceof Error ? error.message : 'An unexpected error occurred',
      'UNKNOWN_ERROR'
    )
  }
}

export const apiClient = {
  get: <T>(endpoint: string, config?: RequestConfig) =>
    request<T>(endpoint, { ...config, method: 'GET' }),

  post: <T>(endpoint: string, data?: any, config?: RequestConfig) =>
    request<T>(endpoint, {
      ...config,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    }),

  put: <T>(endpoint: string, data?: any, config?: RequestConfig) =>
    request<T>(endpoint, {
      ...config,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    }),

  delete: <T>(endpoint: string, config?: RequestConfig) =>
    request<T>(endpoint, { ...config, method: 'DELETE' }),
}
