/**
 * Respuesta paginada genérica
 */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

/**
 * Parámetros de paginación
 */
export interface PaginationParams {
  page?: number;
  pageSize?: number;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
}

/**
 * Respuesta de API genérica
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
  timestamp: Date;
}

/**
 * Error de API
 */
export interface ApiError {
  code: string;
  message: string;
  details?: any;
}

/**
 * Query params genéricos para búsquedas
 */
export interface SearchParams {
  search?: string;
  filters?: Record<string, any>;
  pagination?: PaginationParams;
}
