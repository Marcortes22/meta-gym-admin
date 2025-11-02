import type { Metadata } from 'next';
import { Dumbbell, Search, Filter, MapPin, Users } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Gimnasios | Meta Gym Admin',
  description: 'Gestión de gimnasios registrados',
};

export default function GimnasiosPage() {
  return (
    <div className="flex flex-col gap-8 p-8">
      {/* Header con búsqueda */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-500/10 p-2">
              <Dumbbell className="h-6 w-6 text-blue-500" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-white">
              Gimnasios
            </h1>
          </div>
          <p className="text-gray-400 text-lg">
            Administra los gimnasios registrados en la plataforma
          </p>
        </div>

        {/* Barra de búsqueda y filtros */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar gimnasio por nombre, ciudad..."
              className="w-full rounded-lg border border-border/40 bg-[#1a1a1b] py-3 pl-10 pr-4 text-white placeholder:text-gray-500 focus:border-[#fe6b24] focus:outline-none focus:ring-1 focus:ring-[#fe6b24]"
            />
          </div>
          <button className="flex items-center gap-2 rounded-lg border border-border/40 bg-[#1a1a1b] px-6 py-3 text-gray-400 transition-colors hover:border-[#fe6b24] hover:text-white">
            <Filter className="h-5 w-5" />
            Filtros
          </button>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-xl border border-border/40 bg-linear-to-br from-[#1a1a1b] to-[#0f0f10] p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-500/10 p-2">
              <Dumbbell className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">0</p>
              <p className="text-sm text-gray-400">Total Gimnasios</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border/40 bg-linear-to-br from-[#1a1a1b] to-[#0f0f10] p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-green-500/10 p-2">
              <MapPin className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">0</p>
              <p className="text-sm text-gray-400">Ciudades</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border/40 bg-linear-to-br from-[#1a1a1b] to-[#0f0f10] p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-purple-500/10 p-2">
              <Users className="h-5 w-5 text-purple-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">0</p>
              <p className="text-sm text-gray-400">Miembros Totales</p>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de gimnasios */}
      <div className="rounded-xl border border-border/40 bg-linear-to-br from-[#1a1a1b] to-[#0f0f10] p-12">
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          <div className="rounded-full bg-blue-500/10 p-6">
            <Dumbbell className="h-12 w-12 text-blue-500" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white mb-2">
              No hay gimnasios registrados
            </h3>
            <p className="text-gray-400 max-w-md">
              Los gimnasios aprobados aparecerán aquí. Puedes gestionar sus configuraciones, ver estadísticas y más
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
