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
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Bienvenido al panel de administración de MetaGym
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Gimnasios
            </CardTitle>
            <span className="text-2xl">🏋️</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              +2 desde el mes pasado
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Usuarios Activos
            </CardTitle>
            <span className="text-2xl">👥</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">
              +180 desde el mes pasado
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Planes Activos
            </CardTitle>
            <span className="text-2xl">📋</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89</div>
            <p className="text-xs text-muted-foreground">
              +12 desde el mes pasado
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Ingresos Mensuales
            </CardTitle>
            <span className="text-2xl">💰</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,231</div>
            <p className="text-xs text-muted-foreground">
              +20.1% desde el mes pasado
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Actividad Reciente</CardTitle>
            <CardDescription>
              Últimos cambios en la plataforma
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="size-2 rounded-full bg-blue-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Nuevo gimnasio registrado</p>
                  <p className="text-xs text-muted-foreground">Hace 2 horas</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="size-2 rounded-full bg-green-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Plan premium activado</p>
                  <p className="text-xs text-muted-foreground">Hace 4 horas</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="size-2 rounded-full bg-yellow-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Usuario actualizado</p>
                  <p className="text-xs text-muted-foreground">Hace 6 horas</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Enlaces Rápidos</CardTitle>
            <CardDescription>
              Acciones frecuentemente utilizadas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              <button className="flex items-center gap-3 rounded-lg border p-3 text-left hover:bg-accent">
                <span>🏋️</span>
                <div>
                  <p className="text-sm font-medium">Gestionar Gimnasios</p>
                  <p className="text-xs text-muted-foreground">Ver y editar gimnasios</p>
                </div>
              </button>
              <button className="flex items-center gap-3 rounded-lg border p-3 text-left hover:bg-accent">
                <span>👥</span>
                <div>
                  <p className="text-sm font-medium">Gestionar Usuarios</p>
                  <p className="text-xs text-muted-foreground">Administrar cuentas de usuario</p>
                </div>
              </button>
              <button className="flex items-center gap-3 rounded-lg border p-3 text-left hover:bg-accent">
                <span>📊</span>
                <div>
                  <p className="text-sm font-medium">Ver Reportes</p>
                  <p className="text-xs text-muted-foreground">Analizar métricas y estadísticas</p>
                </div>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}