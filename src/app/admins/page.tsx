'use client'

import { useEffect, useState } from 'react'
import { AppLayout } from '@/components/layout/AppLayout'
import { PageHeader } from '@/components/shared/PageHeader'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
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
  getAdmins,
  createAdmin,
  updateAdmin,
  deleteAdmin,
  addAuditLog,
  getCurrentUser,
} from '@/lib/store'
import { Admin, AdminRole } from '@/lib/types'
import { formatDate, formatDateTime, roleLabel, roleColor } from '@/lib/utils'
import { Plus, Trash2, Shield, UserX, UserCheck } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function AdminsPage() {
  const router = useRouter()
  const [admins, setAdmins] = useState<Admin[]>([])
  const [createOpen, setCreateOpen] = useState(false)
  const [confirmAction, setConfirmAction] = useState<{ type: string; admin: Admin } | null>(null)
  const [mounted, setMounted] = useState(false)

  const [form, setForm] = useState({
    nom: '',
    prenom: '',
    email: '',
    role: 'admin' as AdminRole,
    password: '',
  })

  useEffect(() => {
    setMounted(true)
    const user = getCurrentUser()
    if (!user || user.role !== 'super_admin') {
      router.replace('/dashboard')
      return
    }
    setAdmins(getAdmins())
  }, [router])

  const handleCreate = () => {
    const user = getCurrentUser()
    if (!user) return
    const newAdmin = createAdmin({
      ...form,
      statut: 'actif',
      avatar: null,
    })
    addAuditLog({
      adminId: user.id,
      adminNom: `${user.prenom} ${user.nom}`,
      action: 'Création admin',
      cible: `Admin ${form.prenom} ${form.nom}`,
      detail: `Nouvel administrateur créé avec rôle ${roleLabel(form.role)}`,
      ip: '192.168.1.1',
    })
    setAdmins(getAdmins())
    setCreateOpen(false)
    setForm({ nom: '', prenom: '', email: '', role: 'admin', password: '' })
  }

  const handleToggleStatus = (admin: Admin) => {
    const user = getCurrentUser()
    if (!user) return
    const newStatut = admin.statut === 'actif' ? 'suspendu' as const : 'actif' as const
    updateAdmin(admin.id, { statut: newStatut })
    addAuditLog({
      adminId: user.id,
      adminNom: `${user.prenom} ${user.nom}`,
      action: newStatut === 'suspendu' ? 'Suspension admin' : 'Activation admin',
      cible: `Admin ${admin.prenom} ${admin.nom}`,
      detail: `Administrateur ${newStatut === 'suspendu' ? 'suspendu' : 'réactivé'}`,
      ip: '192.168.1.1',
    })
    setAdmins(getAdmins())
  }

  const handleDelete = (admin: Admin) => {
    const user = getCurrentUser()
    if (!user) return
    deleteAdmin(admin.id)
    addAuditLog({
      adminId: user.id,
      adminNom: `${user.prenom} ${user.nom}`,
      action: 'Suppression admin',
      cible: `Admin ${admin.prenom} ${admin.nom}`,
      detail: 'Administrateur supprimé du système',
      ip: '192.168.1.1',
    })
    setAdmins(getAdmins())
  }

  if (!mounted) return null

  return (
    <AppLayout title="Admins">
      <PageHeader
        title="Gestion des Administrateurs"
        description={`${admins.length} administrateurs`}
        actions={
          <Button
            onClick={() => setCreateOpen(true)}
            className="bg-[#2352C8] hover:bg-[#1a3f9e] text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nouvel Admin
          </Button>
        }
      />

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left text-gray-500">
                <th className="px-4 py-3 font-medium">Nom</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Rôle</th>
                <th className="px-4 py-3 font-medium">Statut</th>
                <th className="px-4 py-3 font-medium">Dernière connexion</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {admins.map((admin, idx) => (
                <tr
                  key={admin.id}
                  className={`border-b border-gray-50 hover:bg-gray-50/50 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}
                >
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900">
                      {admin.prenom} {admin.nom}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{admin.email}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${roleColor(admin.role)}`}>
                      {roleLabel(admin.role)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge statut={admin.statut} />
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">
                    {admin.derniereConnexion
                      ? formatDateTime(admin.derniereConnexion)
                      : 'Jamais'}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() =>
                          setConfirmAction({
                            type: admin.statut === 'actif' ? 'suspend' : 'activate',
                            admin,
                          })
                        }
                        className={`p-1.5 rounded-lg ${
                          admin.statut === 'actif'
                            ? 'hover:bg-orange-50 text-gray-400 hover:text-orange-500'
                            : 'hover:bg-green-50 text-gray-400 hover:text-green-500'
                        }`}
                        title={admin.statut === 'actif' ? 'Suspendre' : 'Activer'}
                      >
                        {admin.statut === 'actif' ? (
                          <UserX className="w-4 h-4" />
                        ) : (
                          <UserCheck className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        onClick={() => setConfirmAction({ type: 'delete', admin })}
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

      {/* Create Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Nouvel Administrateur</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
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
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <Input
                type="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="email@mynita.ne"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
              <Input
                type="password"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                placeholder="Mot de passe"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rôle</label>
              <Select value={form.role} onValueChange={(v) => v && setForm({ ...form, role: v as AdminRole })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="super_admin">Super Admin</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="superviseur">Superviseur</SelectItem>
                  <SelectItem value="support">Support</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>
              Annuler
            </Button>
            <Button
              onClick={handleCreate}
              disabled={!form.nom || !form.prenom || !form.email || !form.password}
              className="bg-[#2352C8] hover:bg-[#1a3f9e] text-white"
            >
              Créer
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
              handleDelete(confirmAction.admin)
            } else {
              handleToggleStatus(confirmAction.admin)
            }
          }}
          title={
            confirmAction.type === 'delete'
              ? 'Supprimer cet administrateur ?'
              : confirmAction.type === 'suspend'
              ? 'Suspendre cet administrateur ?'
              : 'Activer cet administrateur ?'
          }
          description={
            confirmAction.type === 'delete'
              ? `L'administrateur ${confirmAction.admin.prenom} ${confirmAction.admin.nom} sera supprimé.`
              : confirmAction.type === 'suspend'
              ? `L'administrateur ${confirmAction.admin.prenom} ${confirmAction.admin.nom} sera suspendu.`
              : `L'administrateur ${confirmAction.admin.prenom} ${confirmAction.admin.nom} sera réactivé.`
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
