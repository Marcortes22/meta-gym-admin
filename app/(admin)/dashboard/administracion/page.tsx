import type { Metadata } from 'next';
import { Settings, Users, Database, Shield, Bell, Palette } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Administración | Meta Gym Admin',
  description: 'Configuración y administración del sistema',
};

export default function AdministracionPage() {
  return (
    <div className="flex flex-col gap-8 p-8">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-[#fe6b24]/10 p-2">
            <Settings className="h-6 w-6 text-[#fe6b24]" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-white">
            Administración
          </h1>
        </div>
        <p className="text-gray-400 text-lg">
          Configuración general del sistema y usuarios administradores
        </p>
      </div>

      {/* Secciones de configuración */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Usuarios Administradores */}
        <div className="group rounded-xl border border-border/40 bg-linear-to-br from-[#1a1a1b] to-[#0f0f10] p-6 transition-all duration-300 hover:border-[#fe6b24]/50 hover:shadow-lg hover:shadow-[#fe6b24]/10">
          <div className="flex items-start gap-4">
            <div className="rounded-lg bg-blue-500/10 p-3 group-hover:bg-blue-500/20 transition-colors">
              <Users className="h-6 w-6 text-blue-500" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white mb-2">
                Usuarios Administradores
              </h3>
              <p className="text-sm text-gray-400 mb-4">
                Gestiona los usuarios con acceso al panel de administración
              </p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-white">1</span>
                <button className="text-sm text-[#fe6b24] hover:text-[#fe6b24]/80 font-medium">
                  Ver todos →
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Base de Datos */}
        <div className="group rounded-xl border border-border/40 bg-linear-to-br from-[#1a1a1b] to-[#0f0f10] p-6 transition-all duration-300 hover:border-[#fe6b24]/50 hover:shadow-lg hover:shadow-[#fe6b24]/10">
          <div className="flex items-start gap-4">
            <div className="rounded-lg bg-green-500/10 p-3 group-hover:bg-green-500/20 transition-colors">
              <Database className="h-6 w-6 text-green-500" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white mb-2">
                Base de Datos
              </h3>
              <p className="text-sm text-gray-400 mb-4">
                Configuración y mantenimiento de Firestore
              </p>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span className="text-sm text-green-500 font-medium">
                  Conectado
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Seguridad */}
        <div className="group rounded-xl border border-border/40 bg-linear-to-br from-[#1a1a1b] to-[#0f0f10] p-6 transition-all duration-300 hover:border-[#fe6b24]/50 hover:shadow-lg hover:shadow-[#fe6b24]/10">
          <div className="flex items-start gap-4">
            <div className="rounded-lg bg-purple-500/10 p-3 group-hover:bg-purple-500/20 transition-colors">
              <Shield className="h-6 w-6 text-purple-500" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white mb-2">
                Seguridad
              </h3>
              <p className="text-sm text-gray-400 mb-4">
                Reglas de seguridad y autenticación
              </p>
              <button className="text-sm text-[#fe6b24] hover:text-[#fe6b24]/80 font-medium">
                Configurar →
              </button>
            </div>
          </div>
        </div>

        {/* Notificaciones */}
        <div className="group rounded-xl border border-border/40 bg-linear-to-br from-[#1a1a1b] to-[#0f0f10] p-6 transition-all duration-300 hover:border-[#fe6b24]/50 hover:shadow-lg hover:shadow-[#fe6b24]/10">
          <div className="flex items-start gap-4">
            <div className="rounded-lg bg-yellow-500/10 p-3 group-hover:bg-yellow-500/20 transition-colors">
              <Bell className="h-6 w-6 text-yellow-500" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white mb-2">
                Notificaciones
              </h3>
              <p className="text-sm text-gray-400 mb-4">
                Configuración de alertas y notificaciones
              </p>
              <button className="text-sm text-[#fe6b24] hover:text-[#fe6b24]/80 font-medium">
                Configurar →
              </button>
            </div>
          </div>
        </div>

        {/* Apariencia */}
        <div className="group rounded-xl border border-border/40 bg-linear-to-br from-[#1a1a1b] to-[#0f0f10] p-6 transition-all duration-300 hover:border-[#fe6b24]/50 hover:shadow-lg hover:shadow-[#fe6b24]/10 md:col-span-2">
          <div className="flex items-start gap-4">
            <div className="rounded-lg bg-[#fe6b24]/10 p-3 group-hover:bg-[#fe6b24]/20 transition-colors">
              <Palette className="h-6 w-6 text-[#fe6b24]" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white mb-2">
                Apariencia y Branding
              </h3>
              <p className="text-sm text-gray-400 mb-4">
                Personaliza los colores y el logo de la plataforma
              </p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-[#0f0f10] border border-border/40"></div>
                  <span className="text-sm text-gray-400">#0f0f10</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-[#fe6b24]"></div>
                  <span className="text-sm text-gray-400">#fe6b24</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
