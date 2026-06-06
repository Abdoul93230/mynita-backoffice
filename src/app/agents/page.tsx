'use client'

import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { AppLayout } from '@/components/layout/AppLayout'
import { PageHeader } from '@/components/shared/PageHeader'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { EmptyState } from '@/components/shared/EmptyState'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  getAgents,
  createAgent,
  updateAgent,
  deleteAgent,
  addAuditLog,
  getCurrentUser,
} from '@/lib/store'
import { Agent, AgentStatus } from '@/lib/types'
import { formatDate } from '@/lib/utils'
import { Plus, Search, Eye, UserCheck, UserX, Trash2, Users } from 'lucide-react'

export default function AgentsPage() {
  const router = useRouter()
  const [agents, setAgents] = useState<Agent[]>([])
  const [search, setSearch] = useState('')
  const [filterStatut, setFilterStatut] = useState<string>('all')
  const [createOpen, setCreateOpen] = useState(false)
  const [confirmAction, setConfirmAction] = useState<{ type: string; agent: Agent } | null>(null)
  const [mounted, setMounted] = useState(false)

  // Form state
  const [form, setForm] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    zone: '',
    ville: '',
    identifiantApp: '',
    passwordApp: '',
    limiteComptesJour: 10,
  })

  useEffect(() => {
    setMounted(true)
    setAgents(getAgents())
  }, [])

  const filteredAgents = useMemo(() => {
    return agents.filter(a => {
      const matchSearch =
        `${a.nom} ${a.prenom} ${a.email} ${a.telephone} ${a.zone} ${a.ville}`
          .toLowerCase()
          .includes(search.toLowerCase())
      const matchStatut = filterStatut === 'all' || a.statut === filterStatut
      return matchSearch && matchStatut
    })
  }, [agents, search, filterStatut])

  const handleCreate = () => {
    const user = getCurrentUser()
    if (!user) return
    const newAgent = createAgent({
      ...form,
      statut: 'actif',
      createdBy: user.id,
    })
    addAuditLog({
      adminId: user.id,
      adminNom: `${user.prenom} ${user.nom}`,
      action: 'Création agent',
      cible: `Agent ${form.prenom} ${form.nom}`,
      detail: `Nouvel agent créé pour la zone ${form.zone}`,
      ip: '192.168.1.1',
    })
    setAgents(getAgents())
    setCreateOpen(false)
    setForm({
      nom: '',
      prenom: '',
      email: '',
      telephone: '',
      zone: '',
      ville: '',
      identifiantApp: '',
      passwordApp: '',
      limiteComptesJour: 10,
    })
  }

  const handleToggleStatus = (agent: Agent) => {
    const user = getCurrentUser()
    if (!user) return
    const newStatut: AgentStatus = agent.statut === 'actif' ? 'suspendu' : 'actif'
    updateAgent(agent.id, { statut: newStatut })
    addAuditLog({
      adminId: user.id,
      adminNom: `${user.prenom} ${user.nom}`,
      action: newStatut === 'suspendu' ? 'Suspension agent' : 'Activation agent',
      cible: `Agent ${agent.prenom} ${agent.nom}`,
      detail: `Agent ${newStatut === 'suspendu' ? 'suspendu' : 'réactivé'}`,
      ip: '192.168.1.1',
    })
    setAgents(getAgents())
  }

  const handleDelete = (agent: Agent) => {
    const user = getCurrentUser()
    if (!user) return
    deleteAgent(agent.id)
    addAuditLog({
      adminId: user.id,
      adminNom: `${user.prenom} ${user.nom}`,
      action: 'Suppression agent',
      cible: `Agent ${agent.prenom} ${agent.nom}`,
      detail: 'Agent supprimé du système',
      ip: '192.168.1.1',
    })
    setAgents(getAgents())
  }

  if (!mounted) return null

  return (
    <AppLayout title="Agents">
      <PageHeader
        title="Gestion des Agents"
        description={`${agents.length} agents enregistrés`}
        actions={
          <Button
            onClick={() => setCreateOpen(true)}
            className="bg-[#2352C8] hover:bg-[#1a3f9e] text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nouvel Agent
          </Button>
        }
      />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Rechercher un agent..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterStatut} onValueChange={(v) => setFilterStatut(v ?? 'all')}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Tous les statuts" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="actif">Actif</SelectItem>
            <SelectItem value="suspendu">Suspendu</SelectItem>
            <SelectItem value="en_attente">En attente</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      {filteredAgents.length === 0 ? (
        <EmptyState
          icon={Users}
          title="Aucun agent trouvé"
          description="Aucun agent ne correspond à vos critères de recherche"
        />
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left text-gray-500">
                  <th className="px-4 py-3 font-medium">Nom / Prénom</th>
                  <th className="px-4 py-3 font-medium">Zone / Ville</th>
                  <th className="px-4 py-3 font-medium">Téléphone</th>
                  <th className="px-4 py-3 font-medium">Statut</th>
                  <th className="px-4 py-3 font-medium">Comptes créés</th>
                  <th className="px-4 py-3 font-medium">Comptes actifs</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAgents.map((agent, idx) => (
                  <tr
                    key={agent.id}
                    className={`border-b border-gray-50 hover:bg-gray-50/50 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}
                  >
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-gray-900">
                          {agent.prenom} {agent.nom}
                        </p>
                        <p className="text-xs text-gray-500">{agent.email}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {agent.zone} / {agent.ville}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{agent.telephone}</td>
                    <td className="px-4 py-3">
                      <StatusBadge statut={agent.statut} />
                    </td>
                    <td className="px-4 py-3 text-gray-900 font-medium">
                      {agent.nbComptesCreesTotal}
                    </td>
                    <td className="px-4 py-3 text-gray-900 font-medium">
                      {agent.nbComptesActifsTotal}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => router.push(`/agents/${agent.id}`)}
                          className="p-1.5 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-[#2352C8]"
                          title="Voir détail"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() =>
                            setConfirmAction({
                              type: agent.statut === 'actif' ? 'suspend' : 'activate',
                              agent,
                            })
                          }
                          className={`p-1.5 rounded-lg ${
                            agent.statut === 'actif'
                              ? 'hover:bg-orange-50 text-gray-400 hover:text-orange-500'
                              : 'hover:bg-green-50 text-gray-400 hover:text-green-500'
                          }`}
                          title={agent.statut === 'actif' ? 'Suspendre' : 'Activer'}
                        >
                          {agent.statut === 'actif' ? (
                            <UserX className="w-4 h-4" />
                          ) : (
                            <UserCheck className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={() => setConfirmAction({ type: 'delete', agent })}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
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

      {/* Create Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Nouvel Agent</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
              <Input
                value={form.prenom}
                onChange={e => setForm({ ...form, prenom: e.target.value })}
                placeholder="Prénom"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
              <Input
                value={form.nom}
                onChange={e => setForm({ ...form, nom: e.target.value })}
                placeholder="Nom"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <Input
                type="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="email@mynita.ne"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
              <Input
                value={form.telephone}
                onChange={e => setForm({ ...form, telephone: e.target.value })}
                placeholder="+227 90 00 00 00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Zone</label>
              <Input
                value={form.zone}
                onChange={e => setForm({ ...form, zone: e.target.value })}
                placeholder="Niamey"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ville</label>
              <Input
                value={form.ville}
                onChange={e => setForm({ ...form, ville: e.target.value })}
                placeholder="Niamey"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Limite/jour</label>
              <Input
                type="number"
                value={form.limiteComptesJour}
                onChange={e => setForm({ ...form, limiteComptesJour: Number(e.target.value) })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Identifiant App</label>
              <Input
                value={form.identifiantApp}
                onChange={e => setForm({ ...form, identifiantApp: e.target.value })}
                placeholder="AGT-XXX-000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe App</label>
              <Input
                value={form.passwordApp}
                onChange={e => setForm({ ...form, passwordApp: e.target.value })}
                placeholder="Nita@Agent00"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>
              Annuler
            </Button>
            <Button
              onClick={handleCreate}
              disabled={!form.nom || !form.prenom || !form.email || !form.telephone}
              className="bg-[#2352C8] hover:bg-[#1a3f9e] text-white"
            >
              Créer l&apos;agent
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm Dialog */}
      {confirmAction && (
        <ConfirmDialog
          open={true}
          onClose={() => setConfirmAction(null)}
          onConfirm={() => {
            if (confirmAction.type === 'delete') {
              handleDelete(confirmAction.agent)
            } else {
              handleToggleStatus(confirmAction.agent)
            }
          }}
          title={
            confirmAction.type === 'delete'
              ? 'Supprimer cet agent ?'
              : confirmAction.type === 'suspend'
              ? 'Suspendre cet agent ?'
              : 'Activer cet agent ?'
          }
          description={
            confirmAction.type === 'delete'
              ? `L'agent ${confirmAction.agent.prenom} ${confirmAction.agent.nom} sera définitivement supprimé.`
              : confirmAction.type === 'suspend'
              ? `L'agent ${confirmAction.agent.prenom} ${confirmAction.agent.nom} sera suspendu et ne pourra plus créer de comptes.`
              : `L'agent ${confirmAction.agent.prenom} ${confirmAction.agent.nom} sera réactivé.`
          }
          confirmLabel={
            confirmAction.type === 'delete'
              ? 'Supprimer'
              : confirmAction.type === 'suspend'
              ? 'Suspendre'
              : 'Activer'
          }
          variant={confirmAction.type === 'delete' || confirmAction.type === 'suspend' ? 'destructive' : 'default'}
        />
      )}
    </AppLayout>
  )
}
