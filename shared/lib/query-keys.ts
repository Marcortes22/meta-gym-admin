/**
 * Query Keys para TanStack Query
 * Centraliza todas las keys de queries para mejor mantenibilidad
 */

export const queryKeys = {
  // Auth queries
  auth: {
    all: ['auth'] as const,
    user: () => [...queryKeys.auth.all, 'user'] as const,
    adminUser: (email: string) => [...queryKeys.auth.all, 'admin', email] as const,
  },

  // Gimnasios queries
  gyms: {
    all: ['gyms'] as const,
    list: (filters?: Record<string, any>) => [...queryKeys.gyms.all, 'list', filters] as const,
    detail: (id: string) => [...queryKeys.gyms.all, 'detail', id] as const,
  },

  // Solicitudes queries
  requests: {
    all: ['requests'] as const,
    list: (status?: string) => [...queryKeys.requests.all, 'list', status] as const,
    detail: (id: string) => [...queryKeys.requests.all, 'detail', id] as const,
  },

  // Gym Requests (alias para solicitudes)
  gymRequests: {
    all: ['gym-requests'] as const,
    byState: (state: string) => [...queryKeys.gymRequests.all, 'state', state] as const,
    detail: (id: string) => [...queryKeys.gymRequests.all, 'detail', id] as const,
  },
} as const;

// Export aliases
export const gymRequestKeys = queryKeys.gymRequests;

