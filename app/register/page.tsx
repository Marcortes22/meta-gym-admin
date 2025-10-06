import RegisterPage from '@/modules/auth/pages/RegisterPage';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Registro - MetaGym Admin',
  description: 'Crea tu cuenta en MetaGym Admin',
};

export default function RegisterRoute() {
  return <RegisterPage />;
}
