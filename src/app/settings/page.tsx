'use client'

import { useEffect, useState } from 'react'
import { AppLayout } from '@/components/layout/AppLayout'
import { PageHeader } from '@/components/shared/PageHeader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { getSettings, updateSettings, addAuditLog, getCurrentUser } from '@/lib/store'
import { AppSettings } from '@/lib/types'
import { Save, Plus, X } from 'lucide-react'

export default function SettingsPage() {
  const [settings, setSettings] = useState<AppSettings | null>(null)
  const [saved, setSaved] = useState(false)
  const [newMotifRefus, setNewMotifRefus] = useState('')
  const [newMotifDesactivation, setNewMotifDesactivation] = useState('')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setSettings(getSettings())
  }, [])

  const handleSave = () => {
    if (!settings) return
    const user = getCurrentUser()
    if (!user) return
    updateSettings(settings)
    addAuditLog({
      adminId: user.id,
      adminNom: `${user.prenom} ${user.nom}`,
      action: 'Modification paramètres',
      cible: 'Paramètres plateforme',
      detail: 'Mise à jour des paramètres de la plateforme',
      ip: '192.168.1.1',
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const addMotifRefus = () => {
    if (!newMotifRefus.trim() || !settings) return
    setSettings({
      ...settings,
      motifsRefus: [...settings.motifsRefus, newMotifRefus.trim()],
    })
    setNewMotifRefus('')
  }

  const removeMotifRefus = (idx: number) => {
    if (!settings) return
    setSettings({
      ...settings,
      motifsRefus: settings.motifsRefus.filter((_, i) => i !== idx),
    })
  }

  const addMotifDesactivation = () => {
    if (!newMotifDesactivation.trim() || !settings) return
    setSettings({
      ...settings,
      motifsDesactivation: [...settings.motifsDesactivation, newMotifDesactivation.trim()],
    })
    setNewMotifDesactivation('')
  }

  const removeMotifDesactivation = (idx: number) => {
    if (!settings) return
    setSettings({
      ...settings,
      motifsDesactivation: settings.motifsDesactivation.filter((_, i) => i !== idx),
    })
  }

  if (!mounted || !settings) return null

  return (
    <AppLayout title="Paramètres">
      <PageHeader
        title="Paramètres"
        description="Configuration de la plateforme myNITA"
        actions={
          <Button
            onClick={handleSave}
            className="bg-[#2352C8] hover:bg-[#1a3f9e] text-white"
          >
            <Save className="w-4 h-4 mr-2" />
            Enregistrer
          </Button>
        }
      />

      {/* Success toast */}
      {saved && (
        <div className="fixed top-4 right-4 z-50 bg-emerald-500 text-white px-4 py-3 rounded-lg shadow-lg text-sm font-medium animate-in fade-in slide-in-from-top-2">
          Paramètres enregistrés avec succès
        </div>
      )}

      <div className="space-y-6">
        {/* General */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Général</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nom de la plateforme
              </label>
              <Input
                value={settings.nomPlateforme}
                onChange={e =>
                  setSettings({ ...settings, nomPlateforme: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Logo (placeholder)
              </label>
              <div className="h-10 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-center text-xs text-gray-400">
                Upload logo (non fonctionnel)
              </div>
            </div>
          </div>
        </div>

        {/* Motifs de refus */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Motifs de refus</h3>
          <div className="space-y-2 mb-4">
            {settings.motifsRefus.map((motif, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2"
              >
                <span className="text-sm text-gray-700">{motif}</span>
                <button
                  onClick={() => removeMotifRefus(idx)}
                  className="p-1 rounded hover:bg-red-100 text-gray-400 hover:text-red-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              value={newMotifRefus}
              onChange={e => setNewMotifRefus(e.target.value)}
              placeholder="Nouveau motif de refus..."
              onKeyDown={e => e.key === 'Enter' && addMotifRefus()}
            />
            <Button variant="outline" onClick={addMotifRefus}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Motifs de désactivation */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Motifs de désactivation</h3>
          <div className="space-y-2 mb-4">
            {settings.motifsDesactivation.map((motif, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2"
              >
                <span className="text-sm text-gray-700">{motif}</span>
                <button
                  onClick={() => removeMotifDesactivation(idx)}
                  className="p-1 rounded hover:bg-red-100 text-gray-400 hover:text-red-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              value={newMotifDesactivation}
              onChange={e => setNewMotifDesactivation(e.target.value)}
              placeholder="Nouveau motif de désactivation..."
              onKeyDown={e => e.key === 'Enter' && addMotifDesactivation()}
            />
            <Button variant="outline" onClick={addMotifDesactivation}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Limites opérationnelles */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Limites opérationnelles</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Limite comptes / jour (par agent)
              </label>
              <Input
                type="number"
                value={settings.limiteComptesJourDefaut}
                onChange={e =>
                  setSettings({
                    ...settings,
                    limiteComptesJourDefaut: Number(e.target.value),
                  })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Délai alerte attente (heures)
              </label>
              <Input
                type="number"
                value={settings.delaiAlertAttente}
                onChange={e =>
                  setSettings({
                    ...settings,
                    delaiAlertAttente: Number(e.target.value),
                  })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Seuil alerte refus (%)
              </label>
              <Input
                type="number"
                value={settings.seuilAlertRefus}
                onChange={e =>
                  setSettings({
                    ...settings,
                    seuilAlertRefus: Number(e.target.value),
                  })
                }
              />
            </div>
          </div>
        </div>

        {/* Message templates */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Modèles de messages</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                SMS Activation
              </label>
              <textarea
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none h-20 focus:outline-none focus:ring-2 focus:ring-[#2352C8]/20 focus:border-[#2352C8]"
                defaultValue="Félicitations ! Votre compte myNITA a été activé. Vous pouvez maintenant effectuer vos transferts. Support: 80 00 11 22"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Bienvenue
              </label>
              <textarea
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none h-20 focus:outline-none focus:ring-2 focus:ring-[#2352C8]/20 focus:border-[#2352C8]"
                defaultValue="Bienvenue sur myNITA ! Votre demande de compte a été reçue et est en cours de traitement. Nous reviendrons vers vous sous 48h."
              />
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-3">
            * Les modèles de messages ne sont pas fonctionnels dans ce prototype.
          </p>
        </div>
      </div>
    </AppLayout>
  )
}
