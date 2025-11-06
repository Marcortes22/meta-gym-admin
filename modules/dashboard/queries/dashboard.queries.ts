import { db } from '@/shared/lib/firebase/client';
import { collection, getDocs, query, where, Timestamp } from 'firebase/firestore';
import type { DashboardStats, MonthlyGrowthData } from '../types/dashboard.types';

const TENANTS_COLLECTION = 'tenants';
const REQUESTS_COLLECTION = 'register_requests';


export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    const tenantsRef = collection(db, TENANTS_COLLECTION);
    const activeTenantsQuery = query(tenantsRef, where('is_active', '==', true));
    const activeTenantsSnapshot = await getDocs(activeTenantsQuery);
    const totalActiveTenants = activeTenantsSnapshot.size;
    const requestsRef = collection(db, REQUESTS_COLLECTION);
    const requestsSnapshot = await getDocs(requestsRef);
    const totalReceivedRequests = requestsSnapshot.size;
    let pendingRequests = 0;
    let approvedRequests = 0;
    let rejectedRequests = 0;

    requestsSnapshot.forEach((doc) => {
      const data = doc.data();
      const state = data.state;
      
      if (state === 'pending') pendingRequests++;
      else if (state === 'approved') approvedRequests++;
      else if (state === 'rejected') rejectedRequests++;
    });

    return {
      totalActiveTenants,
      totalReceivedRequests,
      pendingRequests,
      approvedRequests,
      rejectedRequests,
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }
}

export async function getMonthlyGrowthData(): Promise<MonthlyGrowthData[]> {
  try {
    const requestsRef = collection(db, REQUESTS_COLLECTION);
    const requestsSnapshot = await getDocs(requestsRef);
    const tenantsRef = collection(db, TENANTS_COLLECTION);
    const tenantsSnapshot = await getDocs(tenantsRef);
    const monthsData: Record<string, { tenants: number; requests: number }> = {};
    const now = new Date();
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = monthNames[date.getMonth()];
      monthsData[monthKey] = { tenants: 0, requests: 0 };
    }
    requestsSnapshot.forEach((doc) => {
      const data = doc.data();
      const createdAt = data.createdAt?.toDate() || data.date?.toDate();
      if (createdAt) {
        const monthKey = monthNames[createdAt.getMonth()];
        if (monthsData[monthKey]) {
          monthsData[monthKey].requests++;
        }
      }
    });

    tenantsSnapshot.forEach((doc) => {
      const data = doc.data();
      const createdAt = data.created_at?.toDate();
      
      if (createdAt) {
        const monthKey = monthNames[createdAt.getMonth()];
        if (monthsData[monthKey]) {
          monthsData[monthKey].tenants++;
        }
      }
    });
    const result: MonthlyGrowthData[] = [];
    let accumulatedTenants = 0;
    let accumulatedRequests = 0;

    Object.entries(monthsData).forEach(([month, data]) => {
      accumulatedTenants += data.tenants;
      accumulatedRequests += data.requests;
      
      result.push({
        month,
        tenants: accumulatedTenants,
        requests: accumulatedRequests,
      });
    });

    return result;
  } catch (error) {
    console.error('Error fetching monthly growth data:', error);
    throw error;
  }
}


export function calculateGrowthPercentage(data: MonthlyGrowthData[]): number {
  if (data.length < 2) return 0;

  const currentMonth = data[data.length - 1];
  const previousMonth = data[data.length - 2];

  const currentTotal = currentMonth.tenants + currentMonth.requests;
  const previousTotal = previousMonth.tenants + previousMonth.requests;

  if (previousTotal === 0) return 0;

  const growth = ((currentTotal - previousTotal) / previousTotal) * 100;
  return Math.round(growth);
}
