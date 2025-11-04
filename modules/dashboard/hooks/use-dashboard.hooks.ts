import { useQuery } from '@tanstack/react-query';
import { getDashboardStats, getMonthlyGrowthData } from '../queries/dashboard.queries';

/**
 * Hook para obtener las estadísticas del dashboard
 */
export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: getDashboardStats,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}

/**
 * Hook para obtener los datos de crecimiento mensual
 */
export function useMonthlyGrowthData() {
  return useQuery({
    queryKey: ['dashboard', 'monthly-growth'],
    queryFn: getMonthlyGrowthData,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}
