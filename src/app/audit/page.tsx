'use client'

import { useEffect, useState, useMemo } from 'react'
import { AppLayout } from '@/components/layout/AppLayout'
import { PageHeader } from '@/components/shared/PageHeader'
import { EmptyState } from '@/components/shared/EmptyState'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { getAuditLogs } from '@/lib/store'
import { AuditLog } from '@/lib/types'
import { formatDateTime } from '@/lib/utils'
import { ScrollText, Search, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

const PAGE_SIZE = 10

export default function AuditPage() {
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [filterAdmin, setFilterAdmin] = useState<string>('all')
  const [filterAction, setFilterAction] = useState<string>('all')
  const [dateDebut, setDateDebut] = useState('')
  const [dateFin, setDateFin] = useState('')
  const [page, setPage] = useState(1)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setLogs(getAuditLogs())
  }, [])

  const uniqueAdmins = useMemo(() => {
    const admins = new Map<string, string>()
    logs.forEach(l => admins.set(l.adminId, l.adminNom))
    return Array.from(admins.entries())
  }, [logs])

  const uniqueActions = useMemo(() => {
    const actions = new Set<string>()
    logs.forEach(l => actions.add(l.action))
    return Array.from(actions)
  }, [logs])

  const filteredLogs = useMemo(() => {
    return logs.filter(l => {
      const matchAdmin = filterAdmin === 'all' || l.adminId === filterAdmin
      const matchAction = filterAction === 'all' || l.action === filterAction
      const matchDateDebut = !dateDebut || new Date(l.date) >= new Date(dateDebut)
      const matchDateFin = !dateFin || new Date(l.date) <= new Date(dateFin + 'T23:59:59')
      return matchAdmin && matchAction && matchDateDebut && matchDateFin
    })
  }, [logs, filterAdmin, filterAction, dateDebut, dateFin])

  const totalPages = Math.ceil(filteredLogs.length / PAGE_SIZE)
  const paginatedLogs = filteredLogs.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  if (!mounted) return null

  return (
    <AppLayout title="Journal d'audit">
      <PageHeader
        title="Journal d'audit"
        description={`${filteredLogs.length} entrées`}
      />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <Select value={filterAdmin} onValueChange={v => { setFilterAdmin(v ?? 'all'); setPage(1) }}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Admin" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les admins</SelectItem>
            {uniqueAdmins.map(([id, name]) => (
              <SelectItem key={id} value={id}>{name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterAction} onValueChange={v => { setFilterAction(v ?? 'all'); setPage(1) }}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Action" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les actions</SelectItem>
            {uniqueActions.map(action => (
              <SelectItem key={action} value={action}>{action}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          type="date"
          value={dateDebut}
          onChange={e => { setDateDebut(e.target.value); setPage(1) }}
          className="w-full sm:w-[160px]"
          placeholder="Date début"
        />
        <Input
          type="date"
          value={dateFin}
          onChange={e => { setDateFin(e.target.value); setPage(1) }}
          className="w-full sm:w-[160px]"
          placeholder="Date fin"
        />
      </div>

      {/* Table */}
      {paginatedLogs.length === 0 ? (
        <EmptyState
          icon={ScrollText}
          title="Aucune entrée trouvée"
          description="Aucun log ne correspond à vos critères"
        />
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left text-gray-500">
                  <th className="px-4 py-3 font-medium">Admin</th>
                  <th className="px-4 py-3 font-medium">Action</th>
                  <th className="px-4 py-3 font-medium">Cible</th>
                  <th className="px-4 py-3 font-medium">Détail</th>
                  <th className="px-4 py-3 font-medium">IP</th>
                  <th className="px-4 py-3 font-medium">Date / heure</th>
                </tr>
              </thead>
              <tbody>
                {paginatedLogs.map((log, idx) => (
                  <tr
                    key={log.id}
                    className={`border-b border-gray-50 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}
                  >
                    <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">
                      {log.adminNom}
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-blue-50 text-[#2352C8]">
                        {log.action}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-700">{log.cible}</td>
                    <td className="px-4 py-3 text-gray-500 max-w-[200px] truncate">
                      {log.detail}
                    </td>
                    <td className="px-4 py-3 text-gray-500 font-mono text-xs">
                      {log.ip}
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
                      {formatDateTime(log.date)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
              <p className="text-sm text-gray-500">
                Page {page} sur {totalPages} ({filteredLogs.length} entrées)
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </AppLayout>
  )
}
