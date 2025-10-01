import { LoginForm } from '@/features/auth/ui/login-form'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Login - MetaGym Admin',
  description: 'Inicia sesión en MetaGym Admin'
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  )
}