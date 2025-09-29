'use client'

import { Button } from '@/shared/components/ui/button'
import { useAuth } from '@/shared/hooks/useAuth'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useState } from 'react'

// Íconos simplificados como texto para evitar dependencias
const menuItems = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: '🏠'
  },
  {
    title: 'Gimnasios',
    url: '/dashboard/gyms',
    icon: '🏋️'
  },
  {
    title: 'Usuarios',
    url: '/dashboard/users',
    icon: '👥'
  },
  {
    title: 'Planes',
    url: '/dashboard/plans',
    icon: '📋'
  },
  {
    title: 'Configuración',
    url: '/dashboard/settings',
    icon: '⚙️'
  }
]

interface SimpleSidebarProps {
  isCollapsed: boolean
  onToggle: () => void
}

function SimpleSidebar({ isCollapsed, onToggle }: SimpleSidebarProps) {
  const { user, signOut } = useAuth()
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <div className={`bg-gray-900 text-white flex flex-col h-full transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-md bg-blue-600 text-white">
            <span className="text-sm font-bold">MG</span>
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-semibold">MetaGym</span>
              <span className="text-xs text-gray-400">Admin Panel</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Navigation */}
      <div className="flex-1 p-4">
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.title}
              href={item.url}
              className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-800 transition-colors"
            >
              <span className="text-lg">{item.icon}</span>
              {!isCollapsed && <span className="text-sm">{item.title}</span>}
            </Link>
          ))}
        </nav>
      </div>
      
      {/* Footer */}
      <div className="p-4 border-t border-gray-700">
        <div className="space-y-2">
          {!isCollapsed && (
            <div className="text-xs text-gray-400 truncate">
              {user?.user_metadata?.name || user?.email}
            </div>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={handleSignOut}
            className="w-full bg-transparent border-gray-600 text-white hover:bg-gray-800"
          >
            {isCollapsed ? '🚪' : 'Cerrar Sesión'}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <SimpleSidebar isCollapsed={sidebarCollapsed} onToggle={toggleSidebar} />
      <div className="flex flex-1 flex-col">
        <header className="flex h-14 shrink-0 items-center gap-2 border-b bg-white px-4 shadow-sm">
          <button
            onClick={toggleSidebar}
            className="p-2 hover:bg-gray-100 rounded-md transition-colors"
          >
            <span className="text-lg">☰</span>
          </button>
          <div className="flex-1" />
          <div className="text-sm text-gray-600">
            MetaGym Admin Dashboard
          </div>
        </header>
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}