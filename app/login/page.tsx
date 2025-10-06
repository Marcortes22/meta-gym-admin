import LoginPage from '@/modules/auth/pages/LoginPage';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login - MetaGym Admin',
  description: 'Inicia sesión en MetaGym Admin',
};

export default function LoginRoute() {
  return <LoginPage />;
}
