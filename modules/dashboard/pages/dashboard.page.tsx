'use client';

import { useDashboardStats, useMonthlyGrowthData } from '../hooks/use-dashboard.hooks';
import { MonthlyGrowthChart } from '../components/monthly-growth-chart.component';
import { calculateGrowthPercentage } from '../queries/dashboard.queries';
import { Building2, FileText, TrendingUp, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Skeleton } from '@/shared/components/ui/skeleton';

export function DashboardPage() {
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: growthData, isLoading: growthLoading } = useMonthlyGrowthData();

  const growthPercentage = growthData ? calculateGrowthPercentage(growthData) : 0;

  return (
    <div className="flex flex-col gap-6 p-6 max-w-[1600px] mx-auto">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-white">
          Dashboard
        </h1>
        <p className="text-gray-400">
          Welcome to the Meta Gym administration panel
        </p>
      </div>


      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        <Card className="bg-[#1a1a1b] border-gray-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-400 uppercase tracking-wide flex items-center gap-2">
              <div className="p-2 bg-[#fe6b24]/10 rounded-lg">
                <Building2 className="h-4 w-4 text-[#fe6b24]" />
              </div>
              Total Active Tenants
            </CardTitle>
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-12 w-24 bg-gray-800" />
            ) : (
              <div className="flex items-baseline gap-2">
                <p className="text-5xl font-bold text-white">
                  {stats?.totalActiveTenants || 0}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
        <Card className="bg-[#1a1a1b] border-gray-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-400 uppercase tracking-wide flex items-center gap-2">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <FileText className="h-4 w-4 text-blue-400" />
              </div>
              Total Received Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-12 w-24 bg-gray-800" />
            ) : (
              <div className="flex items-baseline gap-2">
                <p className="text-5xl font-bold text-white">
                  {stats?.totalReceivedRequests || 0}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      {growthLoading ? (
        <Card className="bg-[#1a1a1b] border-gray-800">
          <CardContent className="pt-6">
            <Skeleton className="h-[300px] w-full bg-gray-800" />
          </CardContent>
        </Card>
      ) : growthData && growthData.length > 0 ? (
        <MonthlyGrowthChart data={growthData} growthPercentage={growthPercentage} />
      ) : null}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-[#1a1a1b] border-gray-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-xs font-medium text-gray-400 uppercase tracking-wide flex items-center gap-2">
              <Clock className="h-4 w-4 text-yellow-400" />
              Pending Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-10 w-16 bg-gray-800" />
            ) : (
              <p className="text-3xl font-bold text-yellow-400">
                {stats?.pendingRequests || 0}
              </p>
            )}
          </CardContent>
        </Card>
        <Card className="bg-[#1a1a1b] border-gray-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-xs font-medium text-gray-400 uppercase tracking-wide flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-400" />
              Approved Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-10 w-16 bg-gray-800" />
            ) : (
              <p className="text-3xl font-bold text-green-400">
                {stats?.approvedRequests || 0}
              </p>
            )}
          </CardContent>
        </Card>
        <Card className="bg-[#1a1a1b] border-gray-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-xs font-medium text-gray-400 uppercase tracking-wide flex items-center gap-2">
              <XCircle className="h-4 w-4 text-red-400" />
              Rejected Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-10 w-16 bg-gray-800" />
            ) : (
              <p className="text-3xl font-bold text-red-400">
                {stats?.rejectedRequests || 0}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <a
          href="/tenants"
          className="group rounded-xl border border-gray-800 bg-[#1a1a1b] p-6 transition-all duration-300 hover:border-[#fe6b24] hover:shadow-lg hover:shadow-[#fe6b24]/10"
        >
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-[#fe6b24]/10 p-3 group-hover:bg-[#fe6b24] transition-colors">
              <Building2 className="h-6 w-6 text-[#fe6b24] group-hover:text-white transition-colors" />
            </div>
            <div>
              <h3 className="font-semibold text-white group-hover:text-[#fe6b24] transition-colors">
                Manage Tenants
              </h3>
              <p className="text-sm text-gray-400">
                View and manage all registered tenants
              </p>
            </div>
          </div>
        </a>

        <a
          href="/dashboard/solicitudes"
          className="group rounded-xl border border-gray-800 bg-[#1a1a1b] p-6 transition-all duration-300 hover:border-[#fe6b24] hover:shadow-lg hover:shadow-[#fe6b24]/10"
        >
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-blue-500/10 p-3 group-hover:bg-blue-500 transition-colors">
              <FileText className="h-6 w-6 text-blue-400 group-hover:text-white transition-colors" />
            </div>
            <div>
              <h3 className="font-semibold text-white group-hover:text-blue-400 transition-colors">
                Review Requests
              </h3>
              <p className="text-sm text-gray-400">
                Process pending gym registration requests
              </p>
            </div>
          </div>
        </a>
      </div>
    </div>
  );
}
