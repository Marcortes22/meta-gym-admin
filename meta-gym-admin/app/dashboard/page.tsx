import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dashboard - MetaGym Admin',
  description: 'Panel de administración de MetaGym'
}

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-black">Dashboard</h1>
        <p className="text-muted-foreground">
          Bienvenido al panel de administración de MetaGym
        </p>
      </div>
    </div>
  )
}