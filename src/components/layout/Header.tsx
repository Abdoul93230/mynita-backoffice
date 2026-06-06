'use client'

import { Menu, Bell } from 'lucide-react'
import { CurrentUser } from '@/lib/types'
import { initials, roleLabel, roleColor } from '@/lib/utils'
import { getComptes } from '@/lib/store'
import { useMemo } from 'react'

interface HeaderProps {
  title: string
  user: CurrentUser
  onMenuClick: () => void
}

export function Header({ title, user, onMenuClick }: HeaderProps) {
  const alertCount = useMemo(() => {
    const comptes = getComptes()
    return comptes.filter(c => c.statut === 'en_attente').length
  }, [])

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-20">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
        >
          <Menu className="w-5 h-5 text-gray-600" />
        </button>
        <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
      </div>

      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button className="relative p-2 rounded-lg hover:bg-gray-100">
          <Bell className="w-5 h-5 text-gray-500" />
          {alertCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {alertCount > 9 ? '9+' : alertCount}
            </span>
          )}
        </button>

        {/* Role badge */}
        <span className={`hidden sm:inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${roleColor(user.role)}`}>
          {roleLabel(user.role)}
        </span>

        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-[#2352C8] flex items-center justify-center">
          <span className="text-white text-xs font-medium">
            {initials(user.nom, user.prenom)}
          </span>
        </div>
      </div>
    </header>
  )
}
