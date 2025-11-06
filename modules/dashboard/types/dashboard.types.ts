
export interface DashboardStats {
  totalActiveTenants: number;
  totalReceivedRequests: number;
  pendingRequests: number;
  approvedRequests: number;
  rejectedRequests: number;
}


export interface MonthlyGrowthData {
  month: string;
  tenants: number;
  requests: number;
}

export interface GrowthMetrics {
  percentage: number;
  trend: 'up' | 'down' | 'stable';
  comparisonText: string;
}
