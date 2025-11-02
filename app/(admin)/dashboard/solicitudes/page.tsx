import type { Metadata } from 'next';
import { SolicitudesPage } from '@/modules/solicitudes/pages/solicitudes.page';

export const metadata: Metadata = {
  title: 'Solicitudes | Meta Gym Admin',
  description: 'Gestión de solicitudes de gimnasios',
};

export default function Page() {
  return <SolicitudesPage />;
}
