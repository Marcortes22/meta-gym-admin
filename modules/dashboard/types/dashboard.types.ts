/**
 * Estadísticas del dashboard
 */
export interface DashboardStats {
  totalActiveTenants: number;
  totalReceivedRequests: number;
  pendingRequests: number;
  approvedRequests: number;
  rejectedRequests: number;
}

/**
 * Datos para la gráfica de crecimiento mensual
 */
export interface MonthlyGrowthData {
  month: string;
  tenants: number;
  requests: number;
}

/**
 * Métricas de crecimiento
 */
export interface GrowthMetrics {
  percentage: number;
  trend: 'up' | 'down' | 'stable';
  comparisonText: string;
}
