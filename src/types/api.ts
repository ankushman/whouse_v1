// ============================================================================
// AutoFlow Logistics - API Response Types
// Standardized response wrappers for API endpoints
// ============================================================================

export interface ApiResponse<T> {
  data: T | null
  error: string | null
  count?: number
}

export interface PaginatedResponse<T> {
  data: T[]
  count: number
  page: number
  pageSize: number
  totalPages: number
}

// Service result type (used internally, before wrapping in NextResponse)
export interface ServiceResult<T = unknown> {
  data?: T
  error?: string
  count?: number
  page?: number
  pageSize?: number
  totalPages?: number
}
