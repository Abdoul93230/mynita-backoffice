import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, formatDistanceToNow } from "date-fns"
import { fr } from "date-fns/locale"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateStr: string): string {
  return format(new Date(dateStr), 'dd/MM/yyyy', { locale: fr })
}

export function formatDateTime(dateStr: string): string {
  return format(new Date(dateStr), 'dd/MM/yyyy HH:mm', { locale: fr })
}

export function formatRelative(dateStr: string): string {
  return formatDistanceToNow(new Date(dateStr), { addSuffix: true, locale: fr })
}

export function initials(nom: string, prenom: string): string {
  return `${prenom.charAt(0)}${nom.charAt(0)}`.toUpperCase()
}

export function initialsFromFullName(name: string): string {
  const parts = name.trim().split(' ')
  if (parts.length >= 2) {
    return `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(0)}`.toUpperCase()
  }
  return name.substring(0, 2).toUpperCase()
}

export function statusColor(statut: string): string {
  switch (statut) {
    case 'actif':
      return 'bg-emerald-100 text-emerald-700'
    case 'en_attente':
      return 'bg-amber-100 text-amber-700'
    case 'suspendu':
      return 'bg-orange-100 text-orange-700'
    case 'desactive':
      return 'bg-red-100 text-red-700'
    default:
      return 'bg-gray-100 text-gray-700'
  }
}

export function statusLabel(statut: string): string {
  switch (statut) {
    case 'actif':
      return 'Actif'
    case 'en_attente':
      return 'En attente'
    case 'suspendu':
      return 'Suspendu'
    case 'desactive':
      return 'Désactivé'
    default:
      return statut
  }
}

export function roleLabel(role: string): string {
  switch (role) {
    case 'super_admin':
      return 'Super Admin'
    case 'admin':
      return 'Admin'
    case 'superviseur':
      return 'Superviseur'
    case 'support':
      return 'Support'
    default:
      return role
  }
}

export function roleColor(role: string): string {
  switch (role) {
    case 'super_admin':
      return 'bg-purple-100 text-purple-700'
    case 'admin':
      return 'bg-blue-100 text-blue-700'
    case 'superviseur':
      return 'bg-cyan-100 text-cyan-700'
    case 'support':
      return 'bg-gray-100 text-gray-700'
    default:
      return 'bg-gray-100 text-gray-700'
  }
}
