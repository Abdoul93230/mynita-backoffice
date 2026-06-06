'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Shield,
  BarChart3,
  ScrollText,
  Settings,
  LogOut,
  X,
} from 'lucide-react'
import { CurrentUser } from '@/lib/types'
import { logout } from '@/lib/store'
import { useRouter } from 'next/navigation'
import { cn, initials, roleLabel } from '@/lib/utils'

interface SidebarProps {
  user: CurrentUser
  open: boolean
  onClose: () => void
}

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/agents', label: 'Agents', icon: Users },
  { href: '/comptes', label: 'Comptes Clients', icon: CreditCard },
  { href: '/admins', label: 'Admins', icon: Shield, superOnly: true },
  { href: '/reporting', label: 'Reporting', icon: BarChart3 },
  { href: '/audit', label: "Journal d'audit", icon: ScrollText },
  { href: '/settings', label: 'Paramètres', icon: Settings },
]

export function Sidebar({ user, open, onClose }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  const filteredNav = navItems.filter(
    item => !item.superOnly || user.role === 'super_admin'
  )

  const handleLogout = () => {
    logout()
    router.replace('/login')
  }

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      {/* Logo */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#F2714A] to-[#2352C8] flex items-center justify-center">
            <span className="text-white font-bold text-sm">N</span>
          </div>
          <span className="text-xl font-bold">
            <span className="text-[#F2714A]">my</span>
            <span className="text-[#2352C8]">NITA</span>
          </span>
        </Link>
        <button
          onClick={onClose}
          className="lg:hidden p-1 rounded-md hover:bg-gray-100"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {filteredNav.map(item => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-[#2352C8]/10 text-[#2352C8]'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              <item.icon className={cn('w-5 h-5', isActive ? 'text-[#2352C8]' : 'text-gray-400')} />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* User info */}
      <div className="border-t border-gray-100 p-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#2352C8] flex items-center justify-center">
            <span className="text-white text-sm font-medium">
              {initials(user.nom, user.prenom)}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user.prenom} {user.nom}
            </p>
            <p className="text-xs text-gray-500 truncate">{roleLabel(user.role)}</p>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
            title="Se déconnecter"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-[240px] h-screen fixed left-0 top-0 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile overlay */}
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={onClose} />
          <aside className="relative w-[280px] h-full">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  )
}
