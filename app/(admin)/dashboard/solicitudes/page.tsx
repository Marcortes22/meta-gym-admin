import type { Metadata } from 'next';
import { FileText, Clock, CheckCircle2, XCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Solicitudes | Meta Gym Admin',
  description: 'Gestión de solicitudes de gimnasios',
};

export default function SolicitudesPage() {
  return (
    <div className="flex flex-col gap-8 p-8">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-yellow-500/10 p-2">
            <FileText className="h-6 w-6 text-yellow-500" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-white">
            Solicitudes
          </h1>
        </div>
        <p className="text-gray-400 text-lg">
          Gestiona las solicitudes de registro de nuevos gimnasios
        </p>
      </div>

      {/* Estado de solicitudes */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-xl border border-border/40 bg-linear-to-br from-[#1a1a1b] to-[#0f0f10] p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-yellow-500/10 p-2">
              <Clock className="h-5 w-5 text-yellow-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">0</p>
              <p className="text-sm text-gray-400">Pendientes</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border/40 bg-linear-to-br from-[#1a1a1b] to-[#0f0f10] p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-green-500/10 p-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">0</p>
              <p className="text-sm text-gray-400">Aprobadas</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border/40 bg-linear-to-br from-[#1a1a1b] to-[#0f0f10] p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-red-500/10 p-2">
              <XCircle className="h-5 w-5 text-red-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">0</p>
              <p className="text-sm text-gray-400">Rechazadas</p>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="rounded-xl border border-border/40 bg-linear-to-br from-[#1a1a1b] to-[#0f0f10] p-12">
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          <div className="rounded-full bg-yellow-500/10 p-6">
            <FileText className="h-12 w-12 text-yellow-500" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white mb-2">
              No hay solicitudes pendientes
            </h3>
            <p className="text-gray-400 max-w-md">
              Las nuevas solicitudes de registro de gimnasios aparecerán aquí para su revisión y aprobación
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
