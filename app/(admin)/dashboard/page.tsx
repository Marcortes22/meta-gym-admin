import type { Metadata } from 'next';
import { Dumbbell, Users, FileText, KeyRound, TrendingUp, Activity } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Dashboard | Meta Gym Admin',
  description: 'Panel de administración de Meta Gym',
};

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8 p-8">
      {/* Header con saludo y fecha */}
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-bold tracking-tight text-white">
          Dashboard
        </h1>
        <p className="text-gray-400 text-lg">
          Bienvenido al panel de administración de Meta Gym
        </p>
      </div>

      {/* Métricas principales */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Gimnasios */}
        <div className="group relative overflow-hidden rounded-xl border border-border/40 bg-linear-to-br from-[#1a1a1b] to-[#0f0f10] p-6 transition-all duration-300 hover:border-[#fe6b24]/50 hover:shadow-lg hover:shadow-[#fe6b24]/10">
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <div className="rounded-lg bg-[#fe6b24]/10 p-2">
                  <Dumbbell className="h-5 w-5 text-[#fe6b24]" />
                </div>
                <p className="text-sm font-medium text-gray-400">
                  Total Gimnasios
                </p>
              </div>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-bold text-white">0</p>
                <span className="text-xs text-green-500 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  +0%
                </span>
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 right-0 opacity-5 group-hover:opacity-10 transition-opacity">
            <Dumbbell className="h-24 w-24 text-[#fe6b24]" />
          </div>
        </div>

        {/* Usuarios Activos */}
        <div className="group relative overflow-hidden rounded-xl border border-border/40 bg-linear-to-br from-[#1a1a1b] to-[#0f0f10] p-6 transition-all duration-300 hover:border-[#fe6b24]/50 hover:shadow-lg hover:shadow-[#fe6b24]/10">
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <div className="rounded-lg bg-blue-500/10 p-2">
                  <Users className="h-5 w-5 text-blue-500" />
                </div>
                <p className="text-sm font-medium text-gray-400">
                  Usuarios Activos
                </p>
              </div>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-bold text-white">0</p>
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  <Activity className="h-3 w-3" />
                  0%
                </span>
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 right-0 opacity-5 group-hover:opacity-10 transition-opacity">
            <Users className="h-24 w-24 text-blue-500" />
          </div>
        </div>

        {/* Solicitudes Pendientes */}
        <div className="group relative overflow-hidden rounded-xl border border-border/40 bg-linear-to-br from-[#1a1a1b] to-[#0f0f10] p-6 transition-all duration-300 hover:border-[#fe6b24]/50 hover:shadow-lg hover:shadow-[#fe6b24]/10">
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <div className="rounded-lg bg-yellow-500/10 p-2">
                  <FileText className="h-5 w-5 text-yellow-500" />
                </div>
                <p className="text-sm font-medium text-gray-400">
                  Solicitudes
                </p>
              </div>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-bold text-white">0</p>
                <span className="text-xs text-gray-500">
                  pendientes
                </span>
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 right-0 opacity-5 group-hover:opacity-10 transition-opacity">
            <FileText className="h-24 w-24 text-yellow-500" />
          </div>
        </div>

        {/* Tokens Emitidos */}
        <div className="group relative overflow-hidden rounded-xl border border-border/40 bg-linear-to-br from-[#1a1a1b] to-[#0f0f10] p-6 transition-all duration-300 hover:border-[#fe6b24]/50 hover:shadow-lg hover:shadow-[#fe6b24]/10">
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <div className="rounded-lg bg-purple-500/10 p-2">
                  <KeyRound className="h-5 w-5 text-purple-500" />
                </div>
                <p className="text-sm font-medium text-gray-400">
                  Tokens Activos
                </p>
              </div>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-bold text-white">0</p>
                <span className="text-xs text-gray-500">
                  emitidos
                </span>
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 right-0 opacity-5 group-hover:opacity-10 transition-opacity">
            <KeyRound className="h-24 w-24 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Acciones rápidas */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <a 
          href="/dashboard/solicitudes"
          className="group rounded-xl border border-border/40 bg-linear-to-br from-[#1a1a1b] to-[#0f0f10] p-6 transition-all duration-300 hover:border-[#fe6b24] hover:shadow-lg hover:shadow-[#fe6b24]/10"
        >
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-[#fe6b24]/10 p-3 group-hover:bg-[#fe6b24] transition-colors">
              <FileText className="h-6 w-6 text-[#fe6b24] group-hover:text-white transition-colors" />
            </div>
            <div>
              <h3 className="font-semibold text-white group-hover:text-[#fe6b24] transition-colors">
                Gestionar Solicitudes
              </h3>
              <p className="text-sm text-gray-400">
                Revisar solicitudes de gimnasios
              </p>
            </div>
          </div>
        </a>

        <a 
          href="/dashboard/tokens"
          className="group rounded-xl border border-border/40 bg-linear-to-br from-[#1a1a1b] to-[#0f0f10] p-6 transition-all duration-300 hover:border-[#fe6b24] hover:shadow-lg hover:shadow-[#fe6b24]/10"
        >
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-purple-500/10 p-3 group-hover:bg-purple-500 transition-colors">
              <KeyRound className="h-6 w-6 text-purple-500 group-hover:text-white transition-colors" />
            </div>
            <div>
              <h3 className="font-semibold text-white group-hover:text-purple-500 transition-colors">
                Generar Tokens
              </h3>
              <p className="text-sm text-gray-400">
                Crear tokens de acceso
              </p>
            </div>
          </div>
        </a>

        <a 
          href="/dashboard/gimnasios"
          className="group rounded-xl border border-border/40 bg-linear-to-br from-[#1a1a1b] to-[#0f0f10] p-6 transition-all duration-300 hover:border-[#fe6b24] hover:shadow-lg hover:shadow-[#fe6b24]/10"
        >
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-blue-500/10 p-3 group-hover:bg-blue-500 transition-colors">
              <Dumbbell className="h-6 w-6 text-blue-500 group-hover:text-white transition-colors" />
            </div>
            <div>
              <h3 className="font-semibold text-white group-hover:text-blue-500 transition-colors">
                Ver Gimnasios
              </h3>
              <p className="text-sm text-gray-400">
                Administrar gimnasios registrados
              </p>
            </div>
          </div>
        </a>
      </div>
    </div>
  );
}
