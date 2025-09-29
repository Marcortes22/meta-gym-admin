import { RegisterForm } from '@/features/auth/ui/register-form'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Registro - MetaGym Admin',
  description: 'Crea tu cuenta en MetaGym Admin'
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md">
        <RegisterForm />
      </div>
    </div>
  )
}