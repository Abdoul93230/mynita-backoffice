'use client'

import { statusColor, statusLabel } from '@/lib/utils'

interface StatusBadgeProps {
  statut: string
  className?: string
}

export function StatusBadge({ statut, className = '' }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColor(statut)} ${className}`}
    >
      {statusLabel(statut)}
    </span>
  )
}
