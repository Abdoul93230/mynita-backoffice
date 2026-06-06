'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { AppLayout } from '@/components/layout/AppLayout'
import { PageHeader } from '@/components/shared/PageHeader'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { Button } from '@/components/ui/button'
import {
  getCompte,
  getAgent,
  updateCompte,
  addAuditLog,
  getCurrentUser,
} from '@/lib/store'
import { ClientAccount, Agent } from '@/lib/types'
import { formatDate, initialsFromFullName } from '@/lib/utils'
import {
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Briefcase,
  Building,
  CheckCircle,
  XCircle,
  RotateCcw,
} from 'lucide-react'
import Link from 'next/link'

export default function CompteDetailPage() {
  const params = useParams()
  const [compte, setCompte] = useState<ClientAccount | null>(null)
  const [agent, setAgent] = useState<Agent | null>(null)
  const [confirmAction, setConfirmAction] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const id = params.id as string
    const c = getCompte(id)
    if (c) {
      setCompte(c)
      setAgent(getAgent(c.agentId))
    }
  }, [params.id])

  const handleAction = (action: string) => {
    if (!compte) return
    const user = getCurrentUser()
    if (!user) return

    let patch: Partial<ClientAccount> = {}
    let auditAction = ''
    let detail = ''

    switch (action) {
      case 'activate':
        patch = { statut: 'actif' }
        auditAction = 'Activation compte'
        detail = 'Compte client activé'
        break
      case 'deactivate':
        patch = {
          statut: 'desactive',
          motifDesactivation: 'Décision administrative',
          dateDesactivation: new Date().toISOString(),
        }
        auditAction = 'Désactivation compte'
        detail = 'Compte client désactivé'
        break
      case 'reactivate':
        patch = {
          statut: 'actif',
          motifDesactivation: null,
          dateDesactivation: null,
        }
        auditAction = 'Réactivation compte'
        detail = 'Compte client réactivé'
        break
    }

    const updated = updateCompte(compte.id, patch)
    addAuditLog({
      adminId: user.id,
      adminNom: `${user.prenom} ${user.nom}`,
      action: auditAction,
      cible: `Compte ${compte.nomComplet}`,
      detail,
      ip: '192.168.1.1',
    })
    setCompte(updated)
  }

  if (!mounted || !compte) return null

  const avatarColor =
    compte.statut === 'actif'
      ? 'bg-emerald-500'
      : compte.statut === 'en_attente'
      ? 'bg-amber-500'
      : 'bg-red-500'

  return (
    <AppLayout title="Détail Compte">
      <PageHeader
        title={compte.nomComplet}
        breadcrumbs={[
          { label: 'Comptes Clients', href: '/comptes' },
          { label: compte.nomComplet },
        ]}
        actions={
          <div className="flex gap-2">
            {compte.statut === 'en_attente' && (
              <Button
                onClick={() => setConfirmAction('activate')}
                className="bg-[#10B981] hover:bg-emerald-600 text-white"
              >
                <CheckCircle className="w-4 h-4 mr-2" /> Activer
              </Button>
            )}
            {compte.statut === 'actif' && (
              <Button
                variant="outline"
                onClick={() => setConfirmAction('deactivate')}
                className="border-red-200 text-red-600 hover:bg-red-50"
              >
                <XCircle className="w-4 h-4 mr-2" /> Désactiver
              </Button>
            )}
            {compte.statut === 'desactive' && (
              <Button
                onClick={() => setConfirmAction('reactivate')}
                className="bg-[#2352C8] hover:bg-[#1a3f9e] text-white"
              >
                <RotateCcw className="w-4 h-4 mr-2" /> Réactiver
              </Button>
            )}
          </div>
        }
      />

      {/* Header Card with Avatar */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm mb-6">
        <div className="flex items-center gap-4">
          <div className={`w-16 h-16 rounded-full ${avatarColor} flex items-center justify-center`}>
            <span className="text-white text-xl font-bold">
              {initialsFromFullName(compte.nomComplet)}
            </span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{compte.nomComplet}</h2>
            <div className="flex items-center gap-3 mt-1">
              <StatusBadge statut={compte.statut} />
              <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                compte.typeCompte === 'pro' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'
              }`}>
                {compte.typeCompte === 'pro' ? 'Compte Pro' : 'Compte Normal'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* MyNITA Card Visual */}
      <div className="mb-6">
        <div className="w-full max-w-md bg-gradient-to-br from-[#2352C8] to-[#1a3f9e] rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-6 -mb-6" />
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-gradient-to-br from-[#F2714A] to-[#ff8c6b] flex items-center justify-center">
                <span className="text-white font-bold text-[10px]">N</span>
              </div>
              <span className="text-sm font-bold">myNITA</span>
            </div>
            <span className="text-xs bg-white/20 px-2 py-0.5 rounded">
              {compte.typeCompte === 'pro' ? 'PRO' : 'STANDARD'}
            </span>
          </div>
          <p className="text-lg font-mono tracking-wider mb-4">
            {compte.telephone}
          </p>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-white/60">Titulaire</p>
              <p className="text-sm font-medium">{compte.nomComplet}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-white/60">Depuis</p>
              <p className="text-sm font-medium">{formatDate(compte.dateCreation)}</p>
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
              <User className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Né(e) le</p>
                <p className="text-sm text-gray-700">
                  {formatDate(compte.dateNaissance)} à {compte.lieuNaissance}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-700">{compte.telephone}</span>
            </div>
            {compte.email && (
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-700">{compte.email}</span>
              </div>
            )}
            <div className="flex items-center gap-3">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-700">{compte.residence}</span>
            </div>
          </div>

          {/* Deactivation info */}
          {compte.statut === 'desactive' && compte.motifDesactivation && (
            <div className="mt-4 p-3 bg-red-50 rounded-lg border border-red-100">
              <p className="text-xs font-medium text-red-700 mb-1">Motif de désactivation</p>
              <p className="text-sm text-red-600">{compte.motifDesactivation}</p>
              {compte.dateDesactivation && (
                <p className="text-xs text-red-500 mt-1">
                  Désactivé le {formatDate(compte.dateDesactivation)}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Pro Info or Agent Info */}
        {compte.professionnel ? (
          <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Informations professionnelles</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Briefcase className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Fonction</p>
                  <p className="text-sm text-gray-700">{compte.professionnel.fonction}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Building className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Employeur</p>
                  <p className="text-sm text-gray-700">{compte.professionnel.employeur}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Zone d&apos;activité</p>
                  <p className="text-sm text-gray-700">{compte.professionnel.zone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Expiration</p>
                  <p className="text-sm text-gray-700">{formatDate(compte.professionnel.dateExpiration)}</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Agent responsable</h3>
            {agent ? (
              <Link href={`/agents/${agent.id}`} className="block hover:bg-gray-50 -mx-2 px-2 py-2 rounded-lg transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#2352C8] flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {agent.prenom.charAt(0)}{agent.nom.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {agent.prenom} {agent.nom}
                    </p>
                    <p className="text-xs text-gray-500">{agent.zone} - {agent.telephone}</p>
                  </div>
                </div>
              </Link>
            ) : (
              <p className="text-sm text-gray-500">Agent non trouvé</p>
            )}
          </div>
        )}
      </div>

      {/* Agent card if professionnel section is shown */}
      {compte.professionnel && agent && (
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm mb-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Agent responsable</h3>
          <Link href={`/agents/${agent.id}`} className="block hover:bg-gray-50 -mx-2 px-2 py-2 rounded-lg transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#2352C8] flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {agent.prenom.charAt(0)}{agent.nom.charAt(0)}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {agent.prenom} {agent.nom}
                </p>
                <p className="text-xs text-gray-500">{agent.zone} - {agent.telephone}</p>
              </div>
            </div>
          </Link>
        </div>
      )}

      {/* Confirm Dialog */}
      {confirmAction && (
        <ConfirmDialog
          open={true}
          onClose={() => setConfirmAction(null)}
          onConfirm={() => handleAction(confirmAction)}
          title={
            confirmAction === 'activate'
              ? 'Activer ce compte ?'
              : confirmAction === 'deactivate'
              ? 'Désactiver ce compte ?'
              : 'Réactiver ce compte ?'
          }
          description={
            confirmAction === 'activate'
              ? `Le compte de ${compte.nomComplet} sera activé et fonctionnel.`
              : confirmAction === 'deactivate'
              ? `Le compte de ${compte.nomComplet} sera désactivé. Le client ne pourra plus effectuer de transactions.`
              : `Le compte de ${compte.nomComplet} sera réactivé.`
          }
          confirmLabel={
            confirmAction === 'activate'
              ? 'Activer'
              : confirmAction === 'deactivate'
              ? 'Désactiver'
              : 'Réactiver'
          }
          variant={confirmAction === 'deactivate' ? 'destructive' : 'default'}
        />
      )}
    </AppLayout>
  )
}
