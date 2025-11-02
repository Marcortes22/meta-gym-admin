import type { Metadata } from 'next';
import { KeyRound, Plus, Activity, Shield } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Tokens | Meta Gym Admin',
  description: 'Gestión de tokens de acceso',
};

export default function TokensPage() {
  return (
    <div className="flex flex-col gap-8 p-8">
      {/* Header con acción */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-purple-500/10 p-2">
              <KeyRound className="h-6 w-6 text-purple-500" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-white">
              Tokens
            </h1>
          </div>
          <p className="text-gray-400 text-lg">
            Administra los tokens de acceso para los gimnasios
          </p>
        </div>

        <button className="group flex items-center gap-2 rounded-lg bg-[#fe6b24] px-6 py-3 font-semibold text-white transition-all hover:bg-[#fe6b24]/90 hover:shadow-lg hover:shadow-[#fe6b24]/20">
          <Plus className="h-5 w-5" />
          Generar Token
        </button>
      </div>

      {/* Estadísticas de tokens */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-xl border border-border/40 bg-linear-to-br from-[#1a1a1b] to-[#0f0f10] p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-purple-500/10 p-2">
              <KeyRound className="h-5 w-5 text-purple-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">0</p>
              <p className="text-sm text-gray-400">Total Tokens</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border/40 bg-linear-to-br from-[#1a1a1b] to-[#0f0f10] p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-green-500/10 p-2">
              <Activity className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">0</p>
              <p className="text-sm text-gray-400">Activos</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border/40 bg-linear-to-br from-[#1a1a1b] to-[#0f0f10] p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-red-500/10 p-2">
              <Shield className="h-5 w-5 text-red-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">0</p>
              <p className="text-sm text-gray-400">Expirados</p>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de tokens */}
      <div className="rounded-xl border border-border/40 bg-linear-to-br from-[#1a1a1b] to-[#0f0f10] p-12">
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          <div className="rounded-full bg-purple-500/10 p-6">
            <KeyRound className="h-12 w-12 text-purple-500" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white mb-2">
              No hay tokens generados
            </h3>
            <p className="text-gray-400 max-w-md mb-4">
              Crea tu primer token de acceso para permitir que los gimnasios se conecten a la plataforma
            </p>
            <button className="inline-flex items-center gap-2 rounded-lg bg-[#fe6b24] px-6 py-3 font-semibold text-white transition-all hover:bg-[#fe6b24]/90">
              <Plus className="h-5 w-5" />
              Generar Primer Token
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
