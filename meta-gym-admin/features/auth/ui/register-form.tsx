'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { RegisterFormData, registerSchema } from '../model/schemas'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { Alert } from '@/shared/components/ui/alert'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { createClient } from '@/shared/api/supabase/client'
import { useAuth } from '@/shared/hooks/useAuth'
import Link from 'next/link'

export function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const { checkAuth } = useAuth()
  const supabase = createClient()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema)
  })

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setIsLoading(true)
      setError(null)
      setSuccess(false)

      const { error: authError, data: authData } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.name
          }
        }
      })

      if (authError) {
        if (authError.message.includes('already registered')) {
          setError('Este email ya está registrado')
        } else {
          setError('Error al crear la cuenta: ' + authError.message)
        }
        return
      }

      // Si el registro fue exitoso pero necesita confirmación
      if (authData.user && !authData.session) {
        setSuccess(true)
        return
      }

      // Si el registro fue exitoso y ya está autenticado
      if (authData.session) {
        await checkAuth()
        router.push('/dashboard')
        router.refresh()
      }
    } catch (err) {
      console.error('Register error:', err)
      setError('Error inesperado al crear la cuenta')
    } finally {
      setIsLoading(false)
    }
  }

  const isFormLoading = isLoading || isSubmitting

  if (success) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center text-green-600">
            ¡Registro Exitoso!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            Te hemos enviado un email de confirmación. Por favor revisa tu bandeja de entrada y haz clic en el enlace para activar tu cuenta.
          </Alert>
          <div className="text-center">
            <Link href="/login" className="text-blue-600 hover:underline">
              Volver al Login
            </Link>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">
          Crear Cuenta
        </CardTitle>
        <CardDescription className="text-center">
          Regístrate para acceder a MetaGym
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre</Label>
            <Input
              id="name"
              type="text"
              placeholder="Tu nombre completo"
              disabled={isFormLoading}
              {...register('name')}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="tu@email.com"
              disabled={isFormLoading}
              {...register('email')}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              disabled={isFormLoading}
              {...register('password')}
            />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              disabled={isFormLoading}
              {...register('confirmPassword')}
            />
            {errors.confirmPassword && (
              <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isFormLoading}
            loading={isFormLoading}
          >
            {isFormLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
          </Button>
        </form>

        <div className="text-center text-sm">
          <span className="text-gray-600">¿Ya tienes una cuenta? </span>
          <Link href="/login" className="text-blue-600 hover:underline">
            Inicia sesión aquí
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}