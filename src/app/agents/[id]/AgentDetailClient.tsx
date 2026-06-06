'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { AppLayout } from '@/components/layout/AppLayout'
import { PageHeader } from '@/components/shared/PageHeader'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { Button } from '@/components/ui/button'
import {
  getAgent,
  getComptesByAgent,
  updateAgent,
  addAuditLog,
  getCurrentUser,
} from '@/lib/store'
import { Agent, ClientAccount } from '@/lib/types'
import { formatDate, initials } from '@/lib/utils'
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  Eye,
  EyeOff,
  RefreshCw,
  UserCheck,
  UserX,
  CreditCard,
  CheckCircle,
  Clock,
} from 'lucide-react'
import Link from 'next/link'

export default function AgentDetailClient() {
  const params = useParams()
  const router = useRouter()
  const [agent, setAgent] = useState<Agent | null>(null)
  const [comptes, setComptes] = useState<ClientAccount[]>([])
  const [showPassword, setShowPassword] = useState(false)
  const [confirmAction, setConfirmAction] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const id = params.id as string
    const a = getAgent(id)
    if (a) {
      setAgent(a)
      setComptes(getComptesByAgent(id))
    }
  }, [params.id])

  const handleToggleStatus = () => {
    if (!agent) return
    const user = getCurrentUser()
    if (!user) return
    const newStatut = agent.statut === 'actif' ? 'suspendu' as const : 'actif' as const
    const updated = updateAgent(agent.id, { statut: newStatut })
    addAuditLog({
      adminId: user.id,
      adminNom: `${user.prenom} ${user.nom}`,
      action: newStatut === 'suspendu' ? 'Suspension agent' : 'Activation agent',
      cible: `Agent ${agent.prenom} ${agent.nom}`,
      detail: `Agent ${newStatut === 'suspendu' ? 'suspendu' : 'réactivé'}`,
      ip: '192.168.1.1',
    })
    setAgent(updated)
  }

  const handleResetPassword = () => {
    if (!agent) return
    const user = getCurrentUser()
    if (!user) return
    const newPwd = `Nita@${Math.random().toString(36).substring(2, 8)}`
    const updated = updateAgent(agent.id, { passwordApp: newPwd })
    addAuditLog({
      adminId: user.id,
      adminNom: `${user.prenom} ${user.nom}`,
      action: 'Reset mot de passe agent',
      cible: `Agent ${agent.prenom} ${agent.nom}`,
      detail: 'Mot de passe application mobile réinitialisé',
      ip: '192.168.1.1',
    })
    setAgent(updated)
    setShowPassword(true)
  }

  if (!mounted || !agent) return null

  return (
    <AppLayout title="Détail Agent">
      <PageHeader
        title={`${agent.prenom} ${agent.nom}`}
        breadcrumbs={[
          { label: 'Agents', href: '/agents' },
          { label: `${agent.prenom} ${agent.nom}` },
        ]}
        actions={
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() =>
                setConfirmAction(agent.statut === 'actif' ? 'suspend' : 'activate')
              }
              className={
                agent.statut === 'actif'
                  ? 'border-orange-200 text-orange-600 hover:bg-orange-50'
                  : 'border-green-200 text-green-600 hover:bg-green-50'
              }
            >
              {agent.statut === 'actif' ? (
                <>
                  <UserX className="w-4 h-4 mr-2" /> Suspendre
                </>
              ) : (
                <>
                  <UserCheck className="w-4 h-4 mr-2" /> Activer
                </>
              )}
            </Button>
          </div>
        }
      />

      {/* Header card */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-[#2352C8] flex items-center justify-center">
            <span className="text-white text-xl font-bold">
              {initials(agent.nom, agent.prenom)}
            </span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {agent.prenom} {agent.nom}
            </h2>
            <div className="flex items-center gap-3 mt-1">
              <StatusBadge statut={agent.statut} />
              <span className="text-sm text-gray-500">
                {agent.zone} - {agent.ville}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Personal Info */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Informations personnelles</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-700">{agent.email}</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-700">{agent.telephone}</span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-700">{agent.zone} / {agent.ville}</span>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-700">
                Recruté le {formatDate(agent.dateRecrutement)}
              </span>
            </div>
          </div>
        </div>

        {/* App Credentials */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">
            Identifiants Application Mobile
          </h3>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-gray-500 uppercase tracking-wider">Identifiant</label>
              <p className="text-sm font-mono text-gray-900 mt-1 bg-gray-50 rounded-lg px-3 py-2">
                {agent.identifiantApp}
              </p>
            </div>
            <div>
              <label className="text-xs text-gray-500 uppercase tracking-wider">Mot de passe</label>
              <div className="flex items-center gap-2 mt-1">
                <p className="flex-1 text-sm font-mono text-gray-900 bg-gray-50 rounded-lg px-3 py-2">
                  {showPassword ? agent.passwordApp : '••••••••••'}
                </p>
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-2 rounded-lg hover:bg-gray-100 text-gray-400"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                <button
                  onClick={handleResetPassword}
                  className="p-2 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-[#2352C8]"
                  title="Réinitialiser"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
            <CreditCard className="w-5 h-5 text-[#2352C8]" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{agent.nbComptesCreesTotal}</p>
            <p className="text-xs text-gray-500">Comptes créés</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{agent.nbComptesActifsTotal}</p>
            <p className="text-xs text-gray-500">Comptes actifs</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
            <Clock className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{agent.limiteComptesJour}</p>
            <p className="text-xs text-gray-500">Limite / jour</p>
          </div>
        </div>
      </div>

      {/* Comptes by this agent */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">
          Comptes gérés ({comptes.length})
        </h3>
        {comptes.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-8">
            Aucun compte créé par cet agent
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b border-gray-100">
                  <th className="pb-3 font-medium">Client</th>
                  <th className="pb-3 font-medium">Téléphone</th>
                  <th className="pb-3 font-medium">Type</th>
                  <th className="pb-3 font-medium">Statut</th>
                  <th className="pb-3 font-medium">Date création</th>
                  <th className="pb-3 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {comptes.map(compte => (
                  <tr key={compte.id} className="border-b border-gray-50 last:border-0">
                    <td className="py-3 font-medium text-gray-900">{compte.nomComplet}</td>
                    <td className="py-3 text-gray-600">{compte.telephone}</td>
                    <td className="py-3">
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${compte.typeCompte === 'pro' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'}`}>
                        {compte.typeCompte === 'pro' ? 'Pro' : 'Normale'}
                      </span>
                    </td>
                    <td className="py-3">
                      <StatusBadge statut={compte.statut} />
                    </td>
                    <td className="py-3 text-gray-500 text-xs">{formatDate(compte.dateCreation)}</td>
                    <td className="py-3">
                      <Link
                        href={`/comptes/${compte.id}`}
                        className="text-xs text-[#2352C8] hover:underline font-medium"
                      >
                        Voir
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Confirm Dialog */}
      {confirmAction && (
        <ConfirmDialog
          open={true}
          onClose={() => setConfirmAction(null)}
          onConfirm={handleToggleStatus}
          title={
            confirmAction === 'suspend' ? 'Suspendre cet agent ?' : 'Activer cet agent ?'
          }
          description={
            confirmAction === 'suspend'
              ? `L'agent ${agent.prenom} ${agent.nom} sera suspendu et ne pourra plus créer de comptes.`
              : `L'agent ${agent.prenom} ${agent.nom} sera réactivé.`
          }
          confirmLabel={confirmAction === 'suspend' ? 'Suspendre' : 'Activer'}
          variant={confirmAction === 'suspend' ? 'destructive' : 'default'}
        />
      )}
    </AppLayout>
  )
}
