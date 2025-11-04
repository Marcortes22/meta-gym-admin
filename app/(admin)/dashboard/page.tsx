import type { Metadata } from 'next';
import { DashboardPage as DashboardPageComponent } from '@/modules/dashboard/pages/dashboard.page';

export const metadata: Metadata = {
  title: 'Dashboard | Meta Gym Admin',
  description: 'Panel de administración de Meta Gym',
};

export default function DashboardPage() {
  return <DashboardPageComponent />;
}
