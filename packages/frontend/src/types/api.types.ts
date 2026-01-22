export interface ApiResponse<T> {
  success: boolean
  data: T
  error?: ApiError
  message?: string
}

export interface ApiError {
  code: string
  message: string
  details?: ValidationErrorDetail[]
}

export interface ValidationErrorDetail {
  field: string
  message: string
}

export interface PaginationInfo {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface PaginatedResponse<T> {
  users: T[]
  pagination: PaginationInfo
}
