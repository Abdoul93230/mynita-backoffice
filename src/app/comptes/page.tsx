'use client'

import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { AppLayout } from '@/components/layout/AppLayout'
import { PageHeader } from '@/components/shared/PageHeader'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { EmptyState } from '@/components/shared/EmptyState'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { getComptes, getAgents } from '@/lib/store'
import { ClientAccount, Agent } from '@/lib/types'
import { formatDate } from '@/lib/utils'
import { Search, Eye, CreditCard } from 'lucide-react'

export default function ComptesPage() {
  const router = useRouter()
  const [comptes, setComptes] = useState<ClientAccount[]>([])
  const [agents, setAgents] = useState<Agent[]>([])
  const [search, setSearch] = useState('')
  const [filterStatut, setFilterStatut] = useState<string>('all')
  const [filterType, setFilterType] = useState<string>('all')
  const [filterAgent, setFilterAgent] = useState<string>('all')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setComptes(getComptes())
    setAgents(getAgents())
  }, [])

  const filteredComptes = useMemo(() => {
    return comptes.filter(c => {
      const matchSearch = `${c.nomComplet} ${c.telephone}`
        .toLowerCase()
        .includes(search.toLowerCase())
      const matchStatut = filterStatut === 'all' || c.statut === filterStatut
      const matchType = filterType === 'all' || c.typeCompte === filterType
      const matchAgent = filterAgent === 'all' || c.agentId === filterAgent
      return matchSearch && matchStatut && matchType && matchAgent
    })
  }, [comptes, search, filterStatut, filterType, filterAgent])

  const getAgentName = (agentId: string) => {
    const agent = agents.find(a => a.id === agentId)
    return agent ? `${agent.prenom} ${agent.nom}` : 'Inconnu'
  }

  if (!mounted) return null

  return (
    <AppLayout title="Comptes Clients">
      <PageHeader
        title="Comptes Clients"
        description={`${comptes.length} comptes enregistrés`}
      />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Rechercher par nom ou téléphone..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterStatut} onValueChange={(v) => setFilterStatut(v ?? 'all')}>
          <SelectTrigger className="w-full sm:w-[160px]">
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous statuts</SelectItem>
            <SelectItem value="en_attente">En attente</SelectItem>
            <SelectItem value="actif">Actif</SelectItem>
            <SelectItem value="desactive">Désactivé</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterType} onValueChange={(v) => setFilterType(v ?? 'all')}>
          <SelectTrigger className="w-full sm:w-[140px]">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous types</SelectItem>
            <SelectItem value="normale">Normale</SelectItem>
            <SelectItem value="pro">Pro</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterAgent} onValueChange={(v) => setFilterAgent(v ?? 'all')}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Agent" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous agents</SelectItem>
            {agents.map(agent => (
              <SelectItem key={agent.id} value={agent.id}>
                {agent.prenom} {agent.nom}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      {filteredComptes.length === 0 ? (
        <EmptyState
          icon={CreditCard}
          title="Aucun compte trouvé"
          description="Aucun compte ne correspond à vos critères"
        />
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left text-gray-500">
                  <th className="px-4 py-3 font-medium">Client</th>
                  <th className="px-4 py-3 font-medium">Type</th>
                  <th className="px-4 py-3 font-medium">Agent responsable</th>
                  <th className="px-4 py-3 font-medium">Statut</th>
                  <th className="px-4 py-3 font-medium">Date création</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredComptes.map((compte, idx) => (
                  <tr
                    key={compte.id}
                    className={`border-b border-gray-50 hover:bg-gray-50/50 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}
                  >
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-gray-900">{compte.nomComplet}</p>
                        <p className="text-xs text-gray-500">{compte.telephone}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                        compte.typeCompte === 'pro' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {compte.typeCompte === 'pro' ? 'Pro' : 'Normale'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{getAgentName(compte.agentId)}</td>
                    <td className="px-4 py-3">
                      <StatusBadge statut={compte.statut} />
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      {formatDate(compte.dateCreation)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end">
                        <button
                          onClick={() => router.push(`/comptes/${compte.id}`)}
                          className="p-1.5 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-[#2352C8]"
                          title="Voir détail"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </AppLayout>
  )
}
